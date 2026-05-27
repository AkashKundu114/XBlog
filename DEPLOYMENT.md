# Deployment Guide

This guide covers four deployment strategies from quickest to most scalable.

---

## Option A — Docker Compose on a VPS (Recommended)

### 1 — Provision a server

Any Ubuntu 22.04 VPS with ≥ 1 GB RAM works (DigitalOcean, Hetzner, Linode, etc.).

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

### 2 — Upload your code

```bash
git clone https://github.com/your-org/xblog.git
cd xblog
```

### 3 — Create production env files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:
```
DATABASE_URL=postgresql://xblog:STRONG_PASS@db:5432/xblog
JWT_SECRET=GENERATE_WITH: openssl rand -base64 48
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXTAUTH_SECRET=GENERATE_WITH: openssl rand -base64 48
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4 — Build and launch

```bash
docker compose up -d --build
```

This starts:
- **db** — PostgreSQL 15
- **backend** — Express API on port 5000
- **frontend** — Next.js on port 3000
- **nginx** — Reverse proxy on ports 80 + 443

### 5 — Run migrations + seed

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

### 6 — Enable HTTPS with Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
sudo systemctl reload nginx
```

### 7 — Verify

```
https://yourdomain.com         → Blog frontend
https://yourdomain.com/api/health  → {"status":"ok"}
https://yourdomain.com/login   → Admin login
```

---

## Option B — Vercel (Frontend) + Railway (Backend + DB)

Ideal for teams that want zero-ops infrastructure.

### Backend on Railway

1. Create a new Railway project
2. Add a **PostgreSQL** service
3. Add a **new service** from your repo, set root to `/backend`
4. Set environment variables (copy from `backend/.env.example`)
5. Railway auto-deploys on push

### Frontend on Vercel

1. Import the repo into Vercel, set root directory to `frontend`
2. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app/api
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   ```
3. Deploy

---

## Option C — Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Backend
cd backend
fly launch --name xblog-api --region iad
fly secrets set JWT_SECRET="..." DATABASE_URL="..."
fly deploy

# Frontend
cd ../frontend
fly launch --name xblog-web --region iad
fly secrets set NEXTAUTH_SECRET="..." NEXT_PUBLIC_API_URL="https://xblog-api.fly.dev/api"
fly deploy
```

---

## Option D — CI/CD with GitHub Actions

A ready-made workflow file is at `.github/workflows/deploy.yml` (create as needed):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /srv/xblog
            git pull origin main
            docker compose up -d --build
            docker compose exec -T backend npx prisma migrate deploy
```

---

## Updating a Running Instance

```bash
# Pull latest code
git pull origin main

# Rebuild + restart (zero-downtime with Docker healthchecks)
docker compose up -d --build --no-deps backend frontend

# Run any new migrations
docker compose exec backend npx prisma migrate deploy
```

---

## Database Backups

```bash
# Manual backup
docker compose exec db pg_dump -U xblog xblog | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
gunzip -c backup_20240101.sql.gz | docker compose exec -T db psql -U xblog xblog
```

Set up a cron job for automated daily backups:
```bash
0 2 * * * cd /srv/xblog && docker compose exec -T db pg_dump -U xblog xblog | gzip > /backups/xblog_$(date +\%Y\%m\%d).sql.gz
```

---

## Production Checklist

- [ ] Strong `JWT_SECRET` and `NEXTAUTH_SECRET` (≥ 32 random chars)
- [ ] Changed default seed passwords
- [ ] HTTPS enabled (Certbot or cloud LB)
- [ ] `NODE_ENV=production` set in backend
- [ ] Cloudinary keys configured for media uploads
- [ ] PostgreSQL port **not** exposed publicly (only accessible to backend)
- [ ] Daily database backups configured
- [ ] Log rotation configured for Docker (`--log-opt max-size=10m`)
- [ ] Rate limiting reviewed (`generalLimiter` = 200 req/15 min)
- [ ] `FRONTEND_URL` CORS origin locked to your domain

---

## Monitoring (Optional)

```bash
# Live logs
docker compose logs -f backend frontend

# Resource usage
docker stats

# Uptime check with cURL
watch -n 30 'curl -sf https://yourdomain.com/api/health | jq .status'
```

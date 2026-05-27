# XBlog — Full-Stack Blog Platform

A production-ready, full-stack blog platform built with **Next.js 14**, **Express**, **PostgreSQL**, and **Prisma**. Features a rich Tiptap editor, infinite-scroll post feed, JWT authentication, Cloudinary media uploads, and a complete admin dashboard.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Radix UI, Framer Motion |
| State | TanStack Query v5, Zustand |
| Editor | Tiptap (rich text + code highlight) |
| Backend | Express 4, TypeScript, Prisma ORM |
| Database | PostgreSQL 15 |
| Auth | NextAuth.js v4 + JWT (access + refresh tokens) |
| Media | Cloudinary (image upload + transformation) |
| Logging | Winston |
| Container | Docker + Docker Compose |

---

## Project Structure

```
xblog/
├── backend/                  # Express API
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   └── src/
│       ├── config/           # Env, logger, CORS
│       ├── database/         # Prisma client singleton
│       ├── modules/          # Feature modules (auth, posts, …)
│       └── shared/           # Middlewares, utils
├── frontend/                 # Next.js app
│   └── src/
│       ├── app/              # App Router pages
│       ├── components/       # UI components
│       ├── hooks/            # React Query hooks
│       ├── lib/              # API client, auth, utils
│       ├── stores/           # Zustand stores
│       └── types/            # TypeScript types
├── nginx/                    # Reverse proxy config
├── docker-compose.yml        # Production stack
├── docker-compose.dev.yml    # Dev stack (with hot-reload)
└── DEPLOYMENT.md             # Step-by-step deploy guide
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 14 (or Docker)
- **Cloudinary** account (free tier works)

---

## Local Development

### 1 — Clone & install

```bash
git clone https://github.com/your-org/xblog.git
cd xblog

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2 — Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit both files with your values
```

### 3 — Start PostgreSQL

```bash
# Via Docker (easiest)
docker run -d \
  --name xblog-postgres \
  -e POSTGRES_DB=xblog \
  -e POSTGRES_USER=xblog \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:15-alpine
```

### 4 — Database setup

```bash
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

### 5 — Start dev servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm run dev
```

### Or use Docker Compose for everything

```bash
docker compose -f docker-compose.dev.yml up
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (min 32 chars) |
| `JWT_ACCESS_EXPIRES_IN` | — | Access token TTL (default `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | — | Refresh token TTL (default `7d`) |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | Cloudinary API secret |
| `FRONTEND_URL` | — | CORS allowed origin (default `http://localhost:3000`) |
| `PORT` | — | HTTP port (default `5000`) |
| `NODE_ENV` | — | `development` / `production` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |
| `NEXTAUTH_SECRET` | ✅ | NextAuth encryption secret |
| `NEXTAUTH_URL` | ✅ | Full URL of the frontend (e.g. `https://xblog.example.com`) |
| `NEXT_PUBLIC_APP_URL` | — | Same as NEXTAUTH_URL |

---

## Database Setup

```bash
# Run all pending migrations
npx prisma migrate deploy

# Seed with sample content
npm run db:seed
# → Creates admin@blog.com / Admin@123456
# → Creates author@blog.com / Author@123456

# Open Prisma Studio (GUI)
npm run db:studio

# Reset DB completely (development only!)
npm run db:reset
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Email + password login |
| POST | `/auth/refresh` | — | Rotate refresh token |
| POST | `/auth/logout` | — | Revoke refresh token |
| GET | `/auth/me` | Bearer | Current user info |

### Posts
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts` | — | Paginated list (filter by status, category, tag, search) |
| GET | `/posts/slug/:slug` | — | Single post by slug |
| GET | `/posts/:id` | ADMIN/AUTHOR | Single post by ID |
| POST | `/posts` | ADMIN/AUTHOR | Create post |
| PATCH | `/posts/:id` | ADMIN/AUTHOR | Update post |
| DELETE | `/posts/:id` | ADMIN | Delete post |
| POST | `/posts/:id/view` | — | Track view |

### Categories / Tags / Users / Analytics
Similar CRUD structure — see source for full details.

### Health check
```
GET /health → { status: "ok", timestamp, env }
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions covering:

- Docker Compose (VPS / bare-metal)
- Fly.io
- Railway
- Vercel (frontend) + Railway (backend)

---

## Default Credentials (seed data)

| Role | Email | Password |
|---|---|---|
| Admin | admin@blog.com | Admin@123456 |
| Author | author@blog.com | Author@123456 |

> **Change these immediately in production.**

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## License

MIT

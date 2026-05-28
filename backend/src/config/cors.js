const { env } = require('./env');

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [env.FRONTEND_URL, 'http://localhost:3000'];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Visitor-Id'],
};

module.exports = { corsOptions };

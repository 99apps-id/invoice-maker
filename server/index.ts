import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool, { query } from './db.js';
import authRoutes from './routes/authSecure.js';
import invoiceRoutes from './routes/invoices.js';
import clientRoutes from './routes/clients.js';
import catalogRoutes from './routes/catalog.js';
import profileRoutes from './routes/profiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
app.disable('x-powered-by');
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS Policy: Whitelist specific domain origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or allowed origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Akses diblokir oleh kebijakan CORS'));
      }
    },
    credentials: true,
  })
);

// 3. Body Parser Limits
app.use(express.json({ limit: '3mb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '256kb' }));
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type application/json diperlukan' });
  }
  next();
});

// 4. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi beberapa saat lagi.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login, silakan tunggu 15 menit.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// Auto-run schema initialization on startup
async function initDatabaseSchema() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(sql);
      console.log('✅ PostgreSQL Schema initialized successfully');
    }
  } catch (err) {
    console.error('⚠️ PostgreSQL Schema init warning:', err);
  }
}

initDatabaseSchema();

// Health Check Endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const dbRes = await query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'Tagih Dong PostgreSQL API Server',
      database: 'connected',
      timestamp: dbRes.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: 'Database connection error' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/profiles', profileRoutes);

// Global Error Handler Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server Internal Error:', err);
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  res.status(status).json({
    error: status === 500 ? 'Terjadi kesalahan internal pada server' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tagih Dong Backend API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import petitionRoutes from './routes/petitions.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : '*',
  credentials: true,
};

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/api/', limiter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/petitions', petitionRoutes);
app.use('/api/admin', adminRoutes);

// Serve SPA from first available directory
const candidateDirs = [
  path.join(__dirname, '..', 'frontend', 'build'),
  path.join(__dirname, 'public'),
];
let staticDir = null;
for (const dir of candidateDirs) {
  if (fs.existsSync(path.join(dir, 'index.html'))) {
    staticDir = dir;
    break;
  }
}
if (staticDir) {
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not found' });
    return res.sendFile(path.join(staticDir, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
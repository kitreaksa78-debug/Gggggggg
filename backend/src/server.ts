/**
 * Standalone Backend Server for Nexus Video Downloader
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { videoRouter } from './routes/video.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Security headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigin) {
    const allowedList = allowedOrigin.split(',').map(o => o.trim());
    if (origin && allowedList.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Mount video API routes
app.use('/api/video', videoRouter);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', provider: 'Cobalt Real Engine' });
});

app.use('/api', errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`[Nexus Standalone Backend] Listening on port ${port}`);
  });
}

export default app;

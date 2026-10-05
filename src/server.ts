/**
 * Nexus Video Downloader - Full-Stack Express Server
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { videoRouter } from './routes/video.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function createServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const port = parseInt(process.env.PORT || '3000', 10);

  // Security Headers
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // CORS Configuration
  const allowedOrigin = process.env.CORS_ORIGIN;
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

  // Body parser with strict size ceiling to prevent memory denial-of-service
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // API Routes
  app.use('/api/video', videoRouter);

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Nexus Video Downloader',
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Handler for API
  app.use('/api', errorHandler);

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: rootDir,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(rootDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  return { app, port };
}

if (process.env.NODE_ENV !== 'test') {
  createServer().then(({ app, port }) => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`[Nexus Server] Running at http://0.0.0.0:${port}`);
    });
  }).catch(err => {
    console.error('[Nexus Server] Failed to start server:', err);
    process.exit(1);
  });
}

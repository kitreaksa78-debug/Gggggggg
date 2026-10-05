/**
 * Video API Routes for Nexus Video Downloader
 */

import { Router } from 'express';
import {
  getVideoInfoHandler,
  downloadVideoHandler,
  getProviderStatusHandler,
} from '../controllers/videoController.ts';
import {
  validateVideoInfoRequest,
  validateVideoDownloadRequest,
} from '../middleware/validation.ts';
import {
  rateLimitInfo,
  rateLimitDownload,
} from '../middleware/rateLimit.ts';

export const videoRouter = Router();

// Metadata & Format inspection
videoRouter.post('/info', rateLimitInfo, validateVideoInfoRequest, getVideoInfoHandler);

// Media Download initiation & streaming (both POST and GET supported)
videoRouter.post('/download', rateLimitDownload, validateVideoDownloadRequest, downloadVideoHandler);
videoRouter.get('/download', rateLimitDownload, validateVideoDownloadRequest, downloadVideoHandler);

// Provider Health & Configuration Status Check
videoRouter.get('/status', getProviderStatusHandler);

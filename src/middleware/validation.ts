/**
 * Input Validation Middleware for Nexus Video Downloader
 */

import { Request, Response, NextFunction } from 'express';
import { validateVideoUrl } from '../utils/urlValidator.ts';

export function validateVideoInfoRequest(req: Request, res: Response, next: NextFunction): void {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_URL',
        message: 'A valid URL string is required.',
      },
    });
    return;
  }

  const validation = validateVideoUrl(url);
  if (!validation.isValid || !validation.normalizedUrl) {
    res.status(400).json({
      success: false,
      error: validation.error || {
        code: 'INVALID_URL',
        message: 'The submitted URL is invalid or not supported.',
      },
    });
    return;
  }

  // Attach normalized url and platform to request
  (req as any).validatedUrl = validation.normalizedUrl;
  (req as any).detectedPlatform = validation.platform;

  next();
}

export function validateVideoDownloadRequest(req: Request, res: Response, next: NextFunction): void {
  // Support both POST body and GET query params for flexible browser downloads
  const url = (req.body && req.body.url) || req.query.url;
  const formatId = (req.body && req.body.formatId) || req.query.formatId;

  if (!url || typeof url !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_URL',
        message: 'A valid URL string is required for download.',
      },
    });
    return;
  }

  const validation = validateVideoUrl(url);
  if (!validation.isValid || !validation.normalizedUrl) {
    res.status(400).json({
      success: false,
      error: validation.error || {
        code: 'INVALID_URL',
        message: 'The submitted URL is invalid or not supported.',
      },
    });
    return;
  }

  (req as any).validatedUrl = validation.normalizedUrl;
  (req as any).validatedFormatId = typeof formatId === 'string' ? formatId : undefined;

  next();
}

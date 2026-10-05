/**
 * Video Controller for Nexus Video Downloader
 */

import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
import { videoService } from '../services/videoService.ts';

export async function getVideoInfoHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const url = (req as any).validatedUrl || req.body.url;
    const info = await videoService.getVideoInfo(url);

    res.json({
      success: true,
      platform: info.platform,
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      author: info.author,
      formats: info.formats.map(f => ({
        formatId: f.formatId,
        quality: f.quality,
        extension: f.extension,
        size: f.size,
        directDownloadUrl: f.directDownloadUrl,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadVideoHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const url = (req as any).validatedUrl || req.body.url || req.query.url;
    const formatId = (req as any).validatedFormatId || req.body.formatId || req.query.formatId;

    const result = await videoService.downloadVideo(url, formatId);

    // If client requested direct redirect or provider supplied external CDN link
    if (req.query.mode === 'redirect' && result.downloadUrl) {
      res.redirect(result.downloadUrl);
      return;
    }

    if (result.stream) {
      res.setHeader('Content-Type', result.mimeType || 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(result.filename)}"; filename*=UTF-8''${encodeURIComponent(result.filename)}`
      );

      if (result.size) {
        res.setHeader('Content-Length', result.size.toString());
      }

      // Convert Web ReadableStream to Node.js Readable stream if necessary
      if (typeof (Readable as any).fromWeb === 'function' && result.stream && !(result.stream instanceof Readable)) {
        const nodeStream = (Readable as any).fromWeb(result.stream);
        nodeStream.pipe(res);

        req.on('close', () => {
          nodeStream.destroy();
        });
      } else if (typeof (result.stream as any).pipe === 'function') {
        (result.stream as any).pipe(res);

        req.on('close', () => {
          if (typeof (result.stream as any).destroy === 'function') {
            (result.stream as any).destroy();
          }
        });
      } else {
        // Fallback to sending downloadUrl
        res.json({
          success: true,
          downloadUrl: result.downloadUrl,
          filename: result.filename,
        });
      }
    } else if (result.downloadUrl) {
      // If we don't have a readable body, redirect or return download URL
      if (req.method === 'GET') {
        res.redirect(result.downloadUrl);
      } else {
        res.json({
          success: true,
          downloadUrl: result.downloadUrl,
          filename: result.filename,
        });
      }
    } else {
      res.status(502).json({
        success: false,
        error: {
          code: 'DOWNLOAD_ERROR',
          message: 'Unable to stream or locate media file from provider.',
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export function getProviderStatusHandler(_req: Request, res: Response): void {
  const status = videoService.getProviderStatus();
  res.json({
    success: true,
    provider: status,
  });
}

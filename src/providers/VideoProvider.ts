/**
 * Video Provider Abstraction Interface
 * Strict contract for real video metadata retrieval and media download
 */

import { SupportedPlatform } from '../utils/urlValidator.ts';

export interface VideoFormat {
  formatId: string;
  quality: string;       // e.g. "1080p", "720p", "480p", "360p", "Audio (128kbps)"
  extension: string;     // e.g. "mp4", "mp3", "webm"
  size?: number;         // file size in bytes if provided by upstream
  hasAudio?: boolean;
  hasVideo?: boolean;
  isAudioOnly?: boolean;
  directDownloadUrl?: string; // If provided directly by the real provider
}

export interface VideoInfo {
  platform: SupportedPlatform;
  title: string;
  thumbnail: string;
  duration: number;      // duration in seconds
  formats: VideoFormat[];
  author?: string;
  sourceUrl: string;
}

export interface DownloadResult {
  stream?: NodeJS.ReadableStream | ReadableStream;
  downloadUrl?: string;
  filename: string;
  mimeType: string;
  size?: number;
}

export interface ProviderStatus {
  isConfigured: boolean;
  providerName: string;
  apiUrl: string;
  docsUrl: string;
  statusMessage: string;
  requiresKey: boolean;
  hasApiKey: boolean;
}

export interface IVideoProvider {
  getVideoInfo(url: string): Promise<VideoInfo>;
  getFormats(url: string): Promise<VideoFormat[]>;
  download(url: string, formatId?: string): Promise<DownloadResult>;
  getProviderStatus(): ProviderStatus;
}

export type SupportedPlatform = 'youtube' | 'tiktok' | 'facebook';

export interface VideoFormat {
  formatId: string;
  quality: string;
  extension: string;
  size?: number;
  hasAudio?: boolean;
  hasVideo?: boolean;
  isAudioOnly?: boolean;
  directDownloadUrl?: string;
}

export interface VideoInfo {
  platform: SupportedPlatform;
  title: string;
  thumbnail: string;
  duration: number;
  author?: string;
  formats: VideoFormat[];
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

export interface AppError {
  code:
    | 'INVALID_URL'
    | 'UNSUPPORTED_PLATFORM'
    | 'VIDEO_UNAVAILABLE'
    | 'PRIVATE_VIDEO'
    | 'PRIVATE_URL'
    | 'SSRF_ATTEMPT'
    | 'PROVIDER_CONFIG_REQUIRED'
    | 'PROVIDER_ERROR'
    | 'RATE_LIMITED'
    | 'DOWNLOAD_ERROR'
    | 'SERVER_ERROR'
    | 'NETWORK_ERROR';
  message: string;
  details?: {
    providerName?: string;
    docsUrl?: string;
    requiredEnvVars?: string[];
    upstreamStatus?: number;
    upstreamMessage?: string;
  };
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: SupportedPlatform;
  url: string;
  quality: string;
  extension: string;
  timestamp: number;
}

/**
 * Video Service - Business logic layer connecting controllers with RealVideoProvider
 */

import { RealVideoProvider } from '../providers/RealVideoProvider.ts';
import { IVideoProvider, VideoInfo, VideoFormat, DownloadResult, ProviderStatus } from '../providers/VideoProvider.ts';

export class VideoService {
  private provider: IVideoProvider;

  constructor() {
    // Only real provider is initialized
    this.provider = new RealVideoProvider();
  }

  public async getVideoInfo(url: string): Promise<VideoInfo> {
    return this.provider.getVideoInfo(url);
  }

  public async getAvailableFormats(url: string): Promise<VideoFormat[]> {
    return this.provider.getFormats(url);
  }

  public async downloadVideo(url: string, formatId?: string): Promise<DownloadResult> {
    return this.provider.download(url, formatId);
  }

  public getProviderStatus(): ProviderStatus {
    return this.provider.getProviderStatus();
  }
}

// Singleton instance
export const videoService = new VideoService();

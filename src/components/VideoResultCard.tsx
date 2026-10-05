import React, { useState } from 'react';
import { Download, Film, Music, Check, Clock, User, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { VideoInfo, VideoFormat, SupportedPlatform } from '../types/index.ts';

interface VideoResultCardProps {
  video: VideoInfo;
  onDownload: (format: VideoFormat) => Promise<void>;
  downloadingFormatId: string | null;
  downloadProgress: { stage: 'idle' | 'preparing' | 'downloading' | 'complete' | 'error'; percent?: number } | null;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({
  video,
  onDownload,
  downloadingFormatId,
  downloadProgress,
}) => {
  const [imgError, setImgError] = useState(false);

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getPlatformBadgeColor = (platform: SupportedPlatform) => {
    switch (platform) {
      case 'youtube':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50';
      case 'tiktok':
        return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/50';
      case 'facebook':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50';
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900">
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12 md:p-8">
        {/* Left Column: Thumbnail */}
        <div className="md:col-span-5">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            {!imgError && video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-neutral-400">
                <Film className="h-10 w-10 stroke-1 text-neutral-500" />
                <span className="mt-2 text-xs">Video Thumbnail</span>
              </div>
            )}

            {/* Platform watermark badge */}
            <span
              className={`absolute top-2.5 left-2.5 rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border ${getPlatformBadgeColor(
                video.platform
              )}`}
            >
              {video.platform}
            </span>

            {/* Duration pill if available */}
            {formatDuration(video.duration) && (
              <span className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(video.duration)}</span>
              </span>
            )}
          </div>

          {/* Author/Creator */}
          {video.author && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium text-neutral-700 dark:text-neutral-200">{video.author}</span>
            </div>
          )}
        </div>

        {/* Right Column: Title and Available Formats */}
        <div className="flex flex-col justify-between md:col-span-7">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
              {video.title}
            </h2>

            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Real formats confirmed by media processor
            </p>
          </div>

          {/* Formats Grid */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
              Available Formats ({video.formats.length})
            </h3>

            {video.formats.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-500">
                No downloadable streams were returned by the provider for this video.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {video.formats.map(format => {
                  const isCurrent = downloadingFormatId === format.formatId;
                  const isAudio = format.isAudioOnly || format.extension === 'mp3';

                  return (
                    <div
                      key={format.formatId}
                      className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/20'
                          : 'border-neutral-200 bg-neutral-50/60 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          {isAudio ? (
                            <Music className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Film className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          )}
                          <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                            {format.quality}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="uppercase font-mono">{format.extension}</span>
                          {format.size && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums font-mono">{formatFileSize(format.size)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Download Action Button */}
                      <button
                        onClick={() => onDownload(format)}
                        disabled={Boolean(downloadingFormatId)}
                        className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                          isCurrent
                            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>
                              {downloadProgress?.stage === 'preparing'
                                ? 'Preparing...'
                                : downloadProgress?.stage === 'downloading'
                                ? 'Downloading...'
                                : 'Processing...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            <span>Download {format.extension.toUpperCase()}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real Download Progress Indicator (if active) */}
          {downloadingFormatId && downloadProgress && (
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs dark:border-indigo-900/60 dark:bg-indigo-950/40">
              <div className="flex items-center justify-between font-medium text-indigo-950 dark:text-indigo-200">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {downloadProgress.stage === 'preparing' && 'Connecting to real provider and negotiating media stream...'}
                    {downloadProgress.stage === 'downloading' && 'Streaming media to your browser...'}
                    {downloadProgress.stage === 'complete' && 'Download ready! Check your browser downloads.'}
                  </span>
                </span>
                {downloadProgress.percent !== undefined && (
                  <span className="tabular-nums font-mono font-semibold">{downloadProgress.percent}%</span>
                )}
              </div>

              {/* Indeterminate real stream progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-indigo-200/60 dark:bg-indigo-900/60">
                {downloadProgress.percent !== undefined ? (
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-400"
                    style={{ width: `${downloadProgress.percent}%` }}
                  />
                ) : (
                  <div className="h-full w-1/3 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

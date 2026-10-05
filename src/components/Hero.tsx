import React, { useState, useEffect } from 'react';
import { ArrowRight, Clipboard, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { detectPlatformFromUrl, SupportedPlatform } from '../utils/urlValidator.ts';

interface HeroProps {
  url: string;
  setUrl: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  loadingStage: 'idle' | 'analyzing' | 'formats' | 'downloading';
  detectedPlatform: SupportedPlatform | null;
  onClear: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  loadingStage,
  detectedPlatform,
  onClear,
}) => {
  const [canPaste, setCanPaste] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'clipboard' in navigator && typeof navigator.clipboard.readText === 'function') {
      setCanPaste(true);
    }
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // Permission denied or clipboard empty
    }
  };

  const getPlatformLabel = (platform: SupportedPlatform | null) => {
    switch (platform) {
      case 'youtube':
        return 'YouTube Detected';
      case 'tiktok':
        return 'TikTok Detected';
      case 'facebook':
        return 'Facebook Detected';
      default:
        return null;
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Compliance Kicker */}
        <p className="mb-3 text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
          Official Media Processing Engine
        </p>

        {/* Primary Hero Headline */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-white" style={{ textWrap: 'balance' }}>
          Download Videos Easily
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg dark:text-neutral-300">
          Paste a video URL and download available media in seconds.
        </p>

        {/* URL Input Form */}
        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-2xl">
          <div className="relative flex flex-col items-center gap-2 sm:flex-row">
            <div className="relative w-full">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste YouTube, TikTok or Facebook URL..."
                aria-label="Video URL"
                disabled={isLoading}
                required
                className="w-full rounded-xl border border-neutral-300 bg-white py-4 pr-24 pl-5 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400"
              />

              {/* Action buttons inside input */}
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
                {url ? (
                  <button
                    type="button"
                    onClick={onClear}
                    title="Clear input"
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  canPaste && (
                    <button
                      type="button"
                      onClick={handlePaste}
                      title="Paste from clipboard"
                      className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Primary Download Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:whitespace-nowrap dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {loadingStage === 'analyzing'
                      ? 'Analyzing video...'
                      : loadingStage === 'formats'
                      ? 'Getting formats...'
                      : 'Processing...'}
                  </span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Detected platform notification or real status indicator */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {detectedPlatform ? (
                <span className="flex items-center gap-1 text-indigo-600 font-medium dark:text-indigo-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{getPlatformLabel(detectedPlatform)}</span>
                </span>
              ) : url.trim().length > 5 ? (
                <span className="flex items-center gap-1 text-neutral-400">
                  <span>Checking link format...</span>
                </span>
              ) : (
                <span className="text-neutral-500 dark:text-neutral-400">
                  Supported: YouTube · TikTok · Facebook
                </span>
              )}
            </div>

            <div className="text-neutral-400 dark:text-neutral-500">
              Only public, permitted media
            </div>
          </div>
        </form>

        {/* Quick Platform Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>YouTube Videos & Shorts</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>TikTok Public Clips</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span>Facebook Watch & Reels</span>
          </div>
        </div>
      </div>
    </section>
  );
};

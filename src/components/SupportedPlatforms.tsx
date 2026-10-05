import React from 'react';
import { Youtube, Smartphone, Facebook, Check, AlertCircle, ShieldCheck } from 'lucide-react';

export const SupportedPlatforms: React.FC = () => {
  const platforms = [
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/40',
      description: 'Public standard videos, Shorts, and community-shared audio tracks.',
      urlFormats: ['youtube.com/watch?v=...', 'youtu.be/...', 'youtube.com/shorts/...'],
      qualities: ['1080p Full HD', '720p HD', '480p SD', '360p', 'Audio MP3'],
      restrictions: 'Private, unlisted with key, paywalled, or DRM-protected streams are not supported.',
    },
    {
      name: 'TikTok',
      icon: Smartphone,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
      description: 'Public vertical videos and creator audio clips shared openly on the platform.',
      urlFormats: ['tiktok.com/@user/video/...', 'vm.tiktok.com/...', 'vt.tiktok.com/...'],
      qualities: ['HD Watermark-Free', 'Original Audio MP3'],
      restrictions: 'Private user accounts, age-restricted clips, or friends-only content cannot be accessed.',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      description: 'Public Facebook Watch videos, public page clips, and public creator reels.',
      urlFormats: ['facebook.com/watch/?v=...', 'fb.watch/...', 'facebook.com/reel/...'],
      qualities: ['HD High Definition', 'SD Standard Definition'],
      restrictions: 'Private group posts, personal timeline posts with restricted audiences, or login-gated videos are excluded.',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
              Platform Matrix
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Supported Platforms
            </h2>
            <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
              Engineered exclusively for publicly accessible, copyright-compliant video links.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500 md:mt-0 dark:text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Zero login credentials or cookies collected</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {platforms.map(platform => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${platform.bgColor}`}>
                      <Icon className={`h-6 w-6 ${platform.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                        {platform.name}
                      </h3>
                      <span className="text-xs text-neutral-400">Public content only</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {platform.description}
                  </p>

                  <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                    <h4 className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                      Supported URL Patterns
                    </h4>
                    <div className="mt-2 space-y-1">
                      {platform.urlFormats.map(fmt => (
                        <div key={fmt} className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                          {fmt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                    <h4 className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                      Permitted Formats
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {platform.qualities.map(q => (
                        <span
                          key={q}
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-neutral-200/60 bg-neutral-50/60 p-3 text-[11px] text-neutral-500 dark:border-neutral-800/80 dark:bg-neutral-950/40 dark:text-neutral-400">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Scope constraint: </span>
                  {platform.restrictions}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

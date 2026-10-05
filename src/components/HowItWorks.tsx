import React from 'react';
import { Copy, ClipboardCheck, Play, Sliders, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Copy Permitted Video URL',
      desc: 'Copy a publicly accessible link from YouTube, TikTok, or Facebook that you have permission to download.',
      icon: Copy,
    },
    {
      num: '02',
      title: 'Paste into Nexus Downloader',
      desc: 'Paste the link into the search box. Nexus automatically verifies and detects the platform.',
      icon: ClipboardCheck,
    },
    {
      num: '03',
      title: 'Click Download',
      desc: 'Initiate the real metadata analysis. Our backend connects securely to the upstream media engine.',
      icon: Play,
    },
    {
      num: '04',
      title: 'Choose Available Format',
      desc: 'Select from real video resolutions (1080p, 720p, 480p, 360p) or extract audio format as MP3.',
      icon: Sliders,
    },
    {
      num: '05',
      title: 'Download Permitted Media',
      desc: 'The browser receives the actual streamed media attachment directly to your device storage.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="border-t border-neutral-200/80 bg-neutral-50/50 py-16 md:py-24 dark:border-neutral-800/80 dark:bg-neutral-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            Simple Workflow
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            How It Works
          </h2>
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
            A transparent 5-step process designed strictly for authorized, publicly accessible content.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {step.num}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 dark:border-neutral-800">
                  Step {idx + 1} of 5
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

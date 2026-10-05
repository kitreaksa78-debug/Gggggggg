import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenProviderModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenProviderModal }) => {
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-white py-12 transition-colors dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="font-display text-base font-bold text-neutral-900 dark:text-white">
              Nexus Video Downloader
            </span>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Personal media archiver for permitted, public video content.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => handleNav('home')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('how-it-works')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('supported-platforms')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Supported Platforms
            </button>
            <button
              onClick={() => handleNav('history')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              History
            </button>
            <button
              onClick={() => handleNav('privacy')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={onOpenProviderModal}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Provider Status
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6 text-center text-xs text-neutral-400 dark:border-neutral-900 dark:text-neutral-500">
          <p>
            © 2026 Nexus Video Downloader. Strictly compliant with copyright laws. YouTube, TikTok, and Facebook are trademarks of their respective owners and are not affiliated with Nexus.
          </p>
        </div>
      </div>
    </footer>
  );
};

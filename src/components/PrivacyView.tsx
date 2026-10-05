import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Database, Key } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-neutral-200 pb-8 dark:border-neutral-800">
          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            Compliance & Transparency
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Last updated: October 2026 · Built with zero personal data retention by design.
          </p>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {/* Section 1: URL Processing */}
          <section>
            <div className="flex items-center gap-2.5">
              <EyeOff className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                1. Purpose-Bound URL Processing
              </h2>
            </div>
            <p className="mt-2">
              Nexus Video Downloader processes submitted video URLs strictly and exclusively to fulfill your immediate download request. The URL you submit is validated against our security whitelist and forwarded to our configured media processing engine to inspect available media formats and stream the authorized media file back to your device. URLs are not logged into permanent databases or shared with marketing third parties.
            </p>
          </section>

          {/* Section 2: No Credential Harvesting */}
          <section>
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                2. Absolute Non-Collection of Passwords and Accounts
              </h2>
            </div>
            <p className="mt-2">
              We never ask for, collect, or store your passwords for YouTube, Google, TikTok, Facebook, or any other platform. We do not prompt for two-factor authentication codes, session tokens, or account credentials. You do not need an account on Nexus to use the service.
            </p>
          </section>

          {/* Section 3: No Browser Cookies Requested */}
          <section>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                3. No Social Media Cookies or Session Extraction
              </h2>
            </div>
            <p className="mt-2">
              Nexus Video Downloader does not extract cookies, browser storage, or authentication headers from your third-party social media sessions. We strictly reject URLs and endpoints requiring active authentication or login cookies.
            </p>
          </section>

          {/* Section 4: Server-Side Provider Key Security */}
          <section>
            <div className="flex items-center gap-2.5">
              <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                4. Confidential Provider API Keys
              </h2>
            </div>
            <p className="mt-2">
              All upstream media provider keys (<code className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">DOWNLOAD_PROVIDER_API_KEY</code>) are quarantined strictly on the backend server environment. They are never exposed in JavaScript bundles, HTML DOM, browser network requests, or client responses.
            </p>
          </section>

          {/* Section 5: Temporary Streaming & Memory Clean-up */}
          <section>
            <div className="flex items-center gap-2.5">
              <Server className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                5. Ephemeral Media Streaming
              </h2>
            </div>
            <p className="mt-2">
              Media downloads are piped ephemerally as memory or byte streams directly from the provider through the backend to the user's browser. Downloaded media files are not permanently cached or warehoused on our servers. As soon as the browser stream concludes or disconnects, all associated memory buffers are garbage-collected immediately.
            </p>
          </section>

          {/* Section 6: Local History */}
          <section>
            <div className="flex items-center gap-2.5">
              <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                6. Local Browser History Storage
              </h2>
            </div>
            <p className="mt-2">
              The "Download History" feature operates exclusively inside your browser's local sandbox (<code className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">window.localStorage</code>). It stores only non-sensitive metadata (video title, selected format, and timestamp). It is never synchronized to our servers, and you can erase it entirely at any time using the "Clear History" button.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

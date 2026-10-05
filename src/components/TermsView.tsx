import React from 'react';
import { FileText, AlertTriangle, Scale, ShieldAlert, CheckCircle } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-neutral-200 pb-8 dark:border-neutral-800">
          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            Legal Agreement
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Please read these terms carefully before utilizing Nexus Video Downloader.
          </p>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {/* User Responsibility */}
          <section className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                1. User Authorization and Rights Responsibility
              </h2>
            </div>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Users of Nexus Video Downloader are solely and exclusively responsible for ensuring that they possess the legal right, license, or explicit authorization from copyright holders to download, save, or archive any content processed through the service. Nexus Video Downloader is intended for personal archiving of user-owned videos, creative-commons media, and publicly authorized broadcasts.
            </p>
          </section>

          {/* Platform Restrictions */}
          <section>
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                2. Prohibition on Circumvention & Access Controls
              </h2>
            </div>
            <p className="mt-2">
              Nexus Video Downloader is strictly NOT designed to bypass digital rights management (DRM), platform access controls, authentication paywalls, geo-blocks, or private user account restrictions. Any attempt to use the tool to reverse engineer protected streams, extract encrypted digital assets, or evade platform technological protection measures is strictly prohibited.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                3. Permitted and Authorized Usage
              </h2>
            </div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Downloading media that you personally created or recorded.</li>
              <li>Downloading public media distributed under Creative Commons (CC-BY, CC0) or open public licenses.</li>
              <li>Archiving public domain videos where copyright protection has expired.</li>
              <li>Fair use educational or fair dealing commentary where explicitly allowed under applicable national law.</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                4. Prohibited Activities
              </h2>
            </div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Commercial redistribution or monetization of third-party media without licensing.</li>
              <li>Attempting Server-Side Request Forgery (SSRF) against internal or cloud metadata endpoints.</li>
              <li>Automated scraping or abusive high-frequency flooding that triggers upstream rate limits.</li>
              <li>Downloading private, unlisted-with-access-token, or age-restricted videos without platform permission.</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                5. Disclaimer of Warranties & Limitation of Liability
              </h2>
            </div>
            <p className="mt-2">
              Nexus Video Downloader is provided on an "as is" and "as available" basis without warranties of any kind. Availability is subject to the stability, terms, and interfaces of external third-party media processing providers and upstream video platforms. Nexus disclaims all liability for any direct or indirect damages resulting from user misuse of downloaded media.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

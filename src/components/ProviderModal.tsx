import React, { useState } from 'react';
import { X, Server, ExternalLink, Key, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Copy, Check } from 'lucide-react';
import { ProviderStatus } from '../types/index.ts';

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ProviderStatus | null;
  onRefresh: () => Promise<void>;
}

export const ProviderModal: React.FC<ProviderModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const sampleEnv = `# Server Configuration
PORT=3000
DOWNLOAD_PROVIDER=real

# Option 1: Cobalt Media Engine (Open-Source API)
# Official Docs: https://github.com/imputnet/cobalt/blob/current/docs/api.md
DOWNLOAD_PROVIDER_API_URL=https://api.cobalt.tools
DOWNLOAD_PROVIDER_API_KEY=your_cobalt_api_key_here

# Option 2: RapidAPI Social Video Downloader API
# DOWNLOAD_PROVIDER_API_URL=https://social-download-all-in-one.p.rapidapi.com
# DOWNLOAD_PROVIDER_API_KEY=your_rapidapi_key_here
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">
                Real Provider Architecture
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Server-side media processing engine configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6 text-sm">
          {/* Status Banner */}
          <div
            className={`rounded-xl border p-4 ${
              status?.isConfigured
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 font-semibold">
                {status?.isConfigured ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>
                  {status?.isConfigured
                    ? 'Provider Ready'
                    : 'Provider Configuration Notice'}
                </span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-xs font-medium underline opacity-80 hover:opacity-100 disabled:opacity-40"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Check Live Status</span>
              </button>
            </div>

            <p className="mt-2 text-xs leading-relaxed opacity-90">
              {status?.statusMessage || 'Checking connection to backend server...'}
            </p>
          </div>

          {/* Provider Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
              <span className="text-neutral-400">Configured Provider:</span>
              <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                {status?.providerName || 'Cobalt Media Engine'}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
              <span className="text-neutral-400">Endpoint URL:</span>
              <p className="mt-1 truncate font-mono text-neutral-900 dark:text-white">
                {status?.apiUrl || 'https://api.cobalt.tools'}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
              <span className="text-neutral-400">Server API Key:</span>
              <p className="mt-1 font-mono text-neutral-900 dark:text-white">
                {status?.hasApiKey ? '•••••••••••• (Installed)' : 'Not supplied'}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
              <span className="text-neutral-400">Official API Specs:</span>
              <a
                href={status?.docsUrl || 'https://github.com/imputnet/cobalt/blob/current/docs/api.md'}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>Cobalt Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Setup Guide */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase dark:text-white">
              Exact Setup Steps (Production or Local)
            </h4>

            <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <strong>Obtain Provider Credentials:</strong> Use either an open Cobalt instance (e.g. self-hosted via Docker or authorized public instance) or a RapidAPI Social Downloader key.
              </li>
              <li>
                <strong>Configure Server Environment:</strong> Copy the variables below to your server's <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">.env</code> file.
              </li>
              <li>
                <strong>Restart Backend:</strong> Run <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">npm run dev</code> or restart your deployment container.
              </li>
              <li>
                <strong>No Client Leakage:</strong> Secrets are strictly read by <code className="font-mono text-indigo-600 dark:text-indigo-400">RealVideoProvider.ts</code> on the server and never sent to browser clients.
              </li>
            </ol>
          </div>

          {/* Copyable .env snippet */}
          <div className="relative rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs text-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-mono text-[11px] text-neutral-400">.env</span>
              <button
                onClick={handleCopyEnv}
                className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300 transition hover:bg-neutral-700"
              >
                {copiedEnv ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-neutral-300">
              {sampleEnv}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

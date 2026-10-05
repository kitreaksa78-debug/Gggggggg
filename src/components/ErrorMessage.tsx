import React from 'react';
import { AlertCircle, Key, ExternalLink, RefreshCw, ShieldAlert, WifiOff } from 'lucide-react';
import { AppError } from '../types/index.ts';

interface ErrorMessageProps {
  error: AppError;
  onRetry?: () => void;
  onOpenProviderModal: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onOpenProviderModal,
}) => {
  const isConfigRequired = error.code === 'PROVIDER_CONFIG_REQUIRED';
  const isPrivateOrUnavailable = error.code === 'PRIVATE_VIDEO' || error.code === 'VIDEO_UNAVAILABLE';
  const isRateLimited = error.code === 'RATE_LIMITED';

  return (
    <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-2xl border border-red-200 bg-red-50/70 p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/30">
      <div className="flex items-start gap-3.5">
        {isConfigRequired ? (
          <Key className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        ) : isPrivateOrUnavailable ? (
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-red-900 dark:text-red-200">
              {isConfigRequired
                ? 'External Provider Configuration Required'
                : error.code === 'RATE_LIMITED'
                ? 'Rate Limit Exceeded'
                : error.code === 'PRIVATE_VIDEO'
                ? 'Private or Login-Restricted Content'
                : 'Unable to Process Video'}
            </h3>
            <span className="font-mono text-[11px] font-semibold tracking-wider text-red-700 uppercase dark:text-red-400">
              {error.code}
            </span>
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-red-800 dark:text-red-300">
            {error.message}
          </p>

          {/* Details for Provider Config Error */}
          {isConfigRequired && (
            <div className="mt-3.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-semibold">How to configure the real provider:</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed">
                <li>
                  Open your server configuration file (<code className="rounded bg-black/10 px-1 py-0.5 font-mono dark:bg-white/10">.env</code>).
                </li>
                <li>
                  Configure <code className="rounded bg-black/10 px-1 py-0.5 font-mono dark:bg-white/10">DOWNLOAD_PROVIDER=real</code>.
                </li>
                <li>
                  Set <code className="rounded bg-black/10 px-1 py-0.5 font-mono dark:bg-white/10">DOWNLOAD_PROVIDER_API_KEY</code> with your Cobalt or RapidAPI key.
                </li>
                <li>
                  Verify your endpoint URL in <code className="rounded bg-black/10 px-1 py-0.5 font-mono dark:bg-white/10">DOWNLOAD_PROVIDER_API_URL</code>.
                </li>
              </ol>

              <div className="mt-3 flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenProviderModal}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500"
                >
                  View Setup Documentation
                </button>

                {error.details?.docsUrl && (
                  <a
                    href={error.details.docsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                  >
                    <span>Official Provider Docs</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Retry Button if actionable */}
          {onRetry && !isConfigRequired && (
            <div className="mt-3.5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-50 dark:border-red-800 dark:bg-neutral-900 dark:text-red-300 dark:hover:bg-neutral-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

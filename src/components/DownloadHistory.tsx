import React, { useState } from 'react';
import { History, Trash2, ArrowUpRight, Film, Music, Check, Clock, Search } from 'lucide-react';
import { DownloadHistoryItem } from '../types/index.ts';

interface DownloadHistoryProps {
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onSelectUrl: (url: string) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  onClearHistory,
  onSelectUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.quality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
              Download History
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Locally stored in your browser. No personal credentials or private data are ever retained.
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-3">
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-medium dark:text-red-400">Clear all?</span>
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-6">
            <div className="relative max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full rounded-xl border border-neutral-200 bg-white py-2 pr-4 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-200 p-10 text-center dark:border-neutral-800">
            <History className="mx-auto h-8 w-8 text-neutral-400" />
            <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              No recent downloads yet
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              When you download videos, their titles and dates will appear here for easy reference.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 p-8 text-center text-xs text-neutral-500 dark:border-neutral-800">
            No matching downloads found for "{searchTerm}".
          </div>
        ) : (
          <div className="mt-4 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
            {filteredHistory.map(item => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 p-4 transition hover:bg-neutral-50 sm:flex-row sm:items-center dark:hover:bg-neutral-800/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.platform}
                    </span>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.quality} ({item.extension.toUpperCase()})
                    </span>
                  </div>
                  <h4 className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onSelectUrl(item.url)}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <span>Analyze Again</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

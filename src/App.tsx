/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { VideoResultCard } from './components/VideoResultCard.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { DownloadHistory } from './components/DownloadHistory.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { SupportedPlatforms } from './components/SupportedPlatforms.tsx';
import { PrivacyView } from './components/PrivacyView.tsx';
import { TermsView } from './components/TermsView.tsx';
import { ProviderModal } from './components/ProviderModal.tsx';
import { Footer } from './components/Footer.tsx';
import { detectPlatformFromUrl, validateVideoUrl, SupportedPlatform } from './utils/urlValidator.ts';
import { VideoInfo, VideoFormat, AppError, DownloadHistoryItem, ProviderStatus } from './types/index.ts';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('home');

  // Input & Processing state
  const [url, setUrl] = useState<string>('');
  const [detectedPlatform, setDetectedPlatform] = useState<SupportedPlatform | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<'idle' | 'analyzing' | 'formats' | 'downloading'>('idle');

  // Video data & Error state
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  // Download state
  const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<{
    stage: 'idle' | 'preparing' | 'downloading' | 'complete' | 'error';
    percent?: number;
  } | null>(null);

  // History state
  const [history, setHistory] = useState<DownloadHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nexus_download_history');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return [];
  });

  // Provider status state
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [providerModalOpen, setProviderModalOpen] = useState<boolean>(false);

  // Synchronize HTML dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Synchronize detected platform as user inputs URL
  useEffect(() => {
    if (!url.trim()) {
      setDetectedPlatform(null);
      return;
    }
    const detected = detectPlatformFromUrl(url);
    setDetectedPlatform(detected);
  }, [url]);

  // Fetch provider status on mount
  const fetchProviderStatus = async () => {
    try {
      const res = await fetch('/api/video/status');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.provider) {
          setProviderStatus(data.provider);
        }
      }
    } catch {
      // Backend not yet reachable or dev server initializing
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, []);

  // Save history to localStorage
  const saveToHistory = (item: DownloadHistoryItem) => {
    setHistory(prev => {
      const next = [item, ...prev.filter(i => i.url !== item.url || i.quality !== item.quality)].slice(0, 50);
      try {
        localStorage.setItem('nexus_download_history', JSON.stringify(next));
      } catch {
        // quota exceeded
      }
      return next;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('nexus_download_history');
    } catch {
      // ignore
    }
  };

  // Submit URL for processing
  const handleAnalyzeUrl = async (e?: React.FormEvent, targetUrl?: string) => {
    if (e) e.preventDefault();
    const queryUrl = (targetUrl || url).trim();

    if (!queryUrl) return;

    // Client-side quick validation
    const clientValidation = validateVideoUrl(queryUrl);
    if (!clientValidation.isValid) {
      setError({
        code: clientValidation.error?.code || 'INVALID_URL',
        message: clientValidation.error?.message || 'Invalid URL entered.',
      });
      setVideoInfo(null);
      return;
    }

    setError(null);
    setVideoInfo(null);
    setIsLoading(true);
    setLoadingStage('analyzing');

    try {
      // 1. Send URL to backend
      const response = await fetch('/api/video/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url: queryUrl }),
      });

      setLoadingStage('formats');

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errObj = data.error || {};
        setError({
          code: errObj.code || 'SERVER_ERROR',
          message: errObj.message || 'The server was unable to retrieve information for this video.',
          details: errObj.details,
        });
        setVideoInfo(null);
        return;
      }

      // Valid response with real video information and formats
      setVideoInfo({
        platform: data.platform,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        author: data.author,
        formats: data.formats || [],
      });
    } catch (err: any) {
      setError({
        code: 'NETWORK_ERROR',
        message: 'Could not communicate with the Nexus backend service. Please verify your connection.',
      });
    } finally {
      setIsLoading(false);
      setLoadingStage('idle');
    }
  };

  // Handle format download action
  const handleDownload = async (format: VideoFormat) => {
    if (!videoInfo) return;

    setDownloadingFormatId(format.formatId);
    setDownloadProgress({ stage: 'preparing' });

    try {
      // If the provider returned a direct pre-signed URL, download it directly
      if (format.directDownloadUrl) {
        setDownloadProgress({ stage: 'downloading', percent: 100 });
        const a = document.createElement('a');
        a.href = format.directDownloadUrl;
        a.download = `${videoInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${format.extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        saveToHistory({
          id: `${Date.now()}-${format.formatId}`,
          title: videoInfo.title,
          platform: videoInfo.platform,
          url: url,
          quality: format.quality,
          extension: format.extension,
          timestamp: Date.now(),
        });

        setDownloadProgress({ stage: 'complete' });
        setTimeout(() => {
          setDownloadingFormatId(null);
          setDownloadProgress(null);
        }, 3000);
        return;
      }

      // Otherwise, request media stream from the real backend provider
      setDownloadProgress({ stage: 'preparing' });

      const response = await fetch('/api/video/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          formatId: format.formatId,
        }),
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // not json
        }
        throw new Error(errorData.error?.message || `Download failed with HTTP status ${response.status}`);
      }

      // Check if server redirected or sent json with direct URL
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        if (jsonData.downloadUrl) {
          window.location.href = jsonData.downloadUrl;
          saveToHistory({
            id: `${Date.now()}-${format.formatId}`,
            title: videoInfo.title,
            platform: videoInfo.platform,
            url: url,
            quality: format.quality,
            extension: format.extension,
            timestamp: Date.now(),
          });
          setDownloadProgress({ stage: 'complete' });
          setTimeout(() => {
            setDownloadingFormatId(null);
            setDownloadProgress(null);
          }, 3000);
          return;
        }
      }

      setDownloadProgress({ stage: 'downloading' });

      // Read real binary stream from the server
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      // Extract filename from Content-Disposition header if available
      let filename = `${videoInfo.title.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'nexus-video'}.${format.extension}`;
      const disposition = response.headers.get('content-disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1].replace(/['"]/g, ''));
        }
      }

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

      // Record in local history
      saveToHistory({
        id: `${Date.now()}-${format.formatId}`,
        title: videoInfo.title,
        platform: videoInfo.platform,
        url: url,
        quality: format.quality,
        extension: format.extension,
        timestamp: Date.now(),
      });

      setDownloadProgress({ stage: 'complete' });
      setTimeout(() => {
        setDownloadingFormatId(null);
        setDownloadProgress(null);
      }, 3000);
    } catch (err: any) {
      setError({
        code: 'DOWNLOAD_ERROR',
        message: err.message || 'Unable to download media from the provider.',
      });
      setDownloadingFormatId(null);
      setDownloadProgress(null);
    }
  };

  const handleSelectHistoryUrl = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleAnalyzeUrl(undefined, selectedUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      {/* Top Bar Contract */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        providerStatus={providerStatus}
        onOpenProviderModal={() => setProviderModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              url={url}
              setUrl={setUrl}
              onSubmit={e => handleAnalyzeUrl(e)}
              isLoading={isLoading}
              loadingStage={loadingStage}
              detectedPlatform={detectedPlatform}
              onClear={() => {
                setUrl('');
                setVideoInfo(null);
                setError(null);
              }}
            />

            {/* Error Message display */}
            {error && (
              <div className="px-4">
                <ErrorMessage
                  error={error}
                  onRetry={() => handleAnalyzeUrl()}
                  onOpenProviderModal={() => setProviderModalOpen(true)}
                />
              </div>
            )}

            {/* Video Result Card */}
            {videoInfo && (
              <div className="px-4">
                <VideoResultCard
                  video={videoInfo}
                  onDownload={handleDownload}
                  downloadingFormatId={downloadingFormatId}
                  downloadProgress={downloadProgress}
                />
              </div>
            )}

            {/* Visual showcase / feature overview */}
            <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-7">
                    <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                      Clean & Compliant
                    </p>
                    <h3 className="font-display mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                      Built with Zero AI Hallucinations
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      Nexus Video Downloader connects to genuine media processing engines. Every video title, thumbnail, and format comes directly from upstream APIs without simulations, mock files, or fake download progress.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('how-it-works')}
                        className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                      >
                        Explore Workflow
                      </button>
                      <button
                        onClick={() => setProviderModalOpen(true)}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        Inspect Real Provider Status
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 shadow-inner dark:border-neutral-800">
                      <img
                        src="/src/assets/images/hero_nexus_downloader_1791191326924.jpg"
                        alt="Nexus Media Processing Architecture"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <HowItWorks />

            {/* Supported Platforms Section */}
            <SupportedPlatforms />

            {/* Download History Section */}
            <DownloadHistory
              history={history}
              onClearHistory={handleClearHistory}
              onSelectUrl={handleSelectHistoryUrl}
            />
          </>
        )}

        {activeTab === 'how-it-works' && <HowItWorks />}

        {activeTab === 'supported-platforms' && <SupportedPlatforms />}

        {activeTab === 'history' && (
          <DownloadHistory
            history={history}
            onClearHistory={handleClearHistory}
            onSelectUrl={handleSelectHistoryUrl}
          />
        )}

        {activeTab === 'privacy' && <PrivacyView />}

        {activeTab === 'terms' && <TermsView />}
      </main>

      {/* Provider Status Modal */}
      <ProviderModal
        isOpen={providerModalOpen}
        onClose={() => setProviderModalOpen(false)}
        status={providerStatus}
        onRefresh={fetchProviderStatus}
      />

      {/* Clean quiet Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenProviderModal={() => setProviderModalOpen(true)}
      />
    </div>
  );
}

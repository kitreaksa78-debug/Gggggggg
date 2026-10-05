import React, { useState } from 'react';
import { Sun, Moon, ShieldCheck, Menu, X, Server, ExternalLink } from 'lucide-react';
import { ProviderStatus } from '../types/index.ts';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  providerStatus: ProviderStatus | null;
  onOpenProviderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  providerStatus,
  onOpenProviderModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'supported-platforms', label: 'Supported Platforms' },
    { id: 'history', label: 'History' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'terms', label: 'Terms' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2 text-left focus:outline-none"
        >
          <span className="font-display text-lg font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            Nexus Video Downloader
          </span>
        </button>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-white ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Provider status button */}
          <button
            onClick={onOpenProviderModal}
            title="Inspect Real Video Provider Status"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                providerStatus?.isConfigured
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
            />
            <span className="hidden sm:inline">Provider</span>
            <Server className="h-3.5 w-3.5 text-neutral-400" />
          </button>

          {/* Dark mode switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 md:hidden dark:border-neutral-800 dark:text-neutral-400"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 pt-3 pb-5 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col space-y-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-2 text-left text-base font-medium transition-colors ${
                  activeTab === link.id
                    ? 'text-indigo-600 font-semibold dark:text-indigo-400'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

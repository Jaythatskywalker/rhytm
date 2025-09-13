'use client';

import React, { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardNav } from './DashboardNav';

// Theme Toggle Component
function ThemeToggle({ theme, setTheme }: { theme: 'dark' | 'light', setTheme: (theme: 'dark' | 'light') => void }) {
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={(theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-[#1a1a17]/10 hover:bg-[#1a1a17]/20') + ' px-3 py-1.5 rounded-lg text-sm transition'}
    >
      {theme === 'dark' ? 'Dark • On' : 'Light • On'}
    </button>
  );
}

// Dashboard Backdrop Component
function DashboardBackdrop({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div className={
        theme === 'dark' 
          ? "bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.08)_95%)] absolute inset-0 bg-[size:20px_20px] opacity-40"
          : "bg-[linear-gradient(transparent_95%,rgba(26,26,23,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(26,26,23,0.08)_95%)] absolute inset-0 bg-[size:20px_20px] opacity-40"
      }></div>
      
      {/* Gradient overlay */}
      <div className={
        theme === 'dark'
          ? "bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(56,189,248,0.2),transparent_35%)] absolute -inset-[20%] blur-3xl opacity-70"
          : "bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.15),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(56,189,248,0.1),transparent_35%)] absolute -inset-[20%] blur-3xl opacity-50"
      }></div>
    </div>
  );
}

interface DashboardPageProps {
  children: ReactNode;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

export function DashboardPage({ children, theme = 'dark', onThemeChange }: DashboardPageProps) {
  const [currentTheme, setCurrentTheme] = React.useState<'dark' | 'light'>(theme);
  
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setCurrentTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const bgClass = currentTheme === 'dark' ? 'bg-[#0a0a0d]' : 'bg-[#f7f5f0]';
  const textClass = currentTheme === 'dark' ? 'text-white' : 'text-[#1a1a17]';

  return (
    <DashboardLayout>
      <div className={`min-h-full ${bgClass} ${textClass} relative flex flex-col`}>
        <DashboardBackdrop theme={currentTheme} />
        
        {/* Header */}
        <div className={`${currentTheme === 'dark' ? 'bg-white/5' : 'bg-white/30'} ${textClass} sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-opacity-60 relative border-b ${currentTheme === 'dark' ? 'border-white/10' : 'border-[#1a1a17]/10'}`}>
          <DashboardBackdrop theme={currentTheme} />
          <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img 
                  src={currentTheme === 'dark' ? '/rhytm-logo-dark.png' : '/rhytm-logo-light.png'}
                  alt="RHYTM Logo"
                  className="h-18 w-auto"
                />
              </div>
              
              {/* Navigation */}
              <div className="hidden md:block">
                <DashboardNav theme={currentTheme} />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className={`${currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow`}>
                Connect Beatport
              </button>
              <ThemeToggle theme={currentTheme} setTheme={handleThemeChange} />
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-opacity-10 px-4 py-2">
            <DashboardNav theme={currentTheme} />
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}

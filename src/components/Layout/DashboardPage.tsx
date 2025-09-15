'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { DashboardLayout } from './DashboardLayout';
import { DashboardNav } from './DashboardNav';
import { Menu, X } from 'lucide-react';

// Navigation items
const navItems = [
  { href: '/', label: 'Discover' },
  { href: '/library', label: 'Library' },
  { href: '/collections', label: 'Collections' },
  { href: '/export', label: 'Export' },
  { href: '/settings', label: 'Settings' }
];

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

// Mobile Navigation Component
function MobileNav({ theme, onItemClick }: { theme: 'dark' | 'light', onItemClick: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={clsx(
            'block w-full px-4 py-3 rounded-lg text-left font-medium transition-colors',
            pathname === item.href
              ? theme === 'dark' 
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                : 'bg-emerald-600 text-white'
              : theme === 'dark'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-[#1a1a17]/70 hover:text-[#1a1a17] hover:bg-[#1a1a17]/10'
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setCurrentTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
          <div className="mx-auto max-w-7xl px-4 py-0.5 flex items-center justify-between relative z-10" style={{ height: 'calc(7rem * 0.82)' }}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Link href="/" onClick={() => {
                  localStorage.setItem('rhytm-view-mode', 'landing');
                  window.location.href = '/';
                }}>
                  <img 
                    src={currentTheme === 'dark' ? '/rhytm-logo-dark.png' : '/rhytm-logo-light.png'}
                    alt="RHYTM Logo"
                    className="h-28 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <DashboardNav theme={currentTheme} />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className={`${currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow`}>
                Connect Beatport
              </button>
              <div className="hidden md:block">
                <ThemeToggle theme={currentTheme} setTheme={handleThemeChange} />
              </div>
              
              {/* Mobile Hamburger Button */}
              <button
                onClick={toggleMobileMenu}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  currentTheme === 'dark' 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-[#1a1a17] hover:bg-[#1a1a17]/10'
                }`}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
              currentTheme === 'dark' ? 'bg-[#0a0a0d]' : 'bg-[#f7f5f0]'
            } border-l ${currentTheme === 'dark' ? 'border-white/10' : 'border-[#1a1a17]/10'} shadow-xl`}>
              <DashboardBackdrop theme={currentTheme} />
              
              {/* Mobile Menu Header */}
              <div className="relative z-10 p-4 border-b border-opacity-10">
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => {
                    localStorage.setItem('rhytm-view-mode', 'landing');
                    window.location.href = '/';
                    closeMobileMenu();
                  }}>
                    <img 
                      src={currentTheme === 'dark' ? '/rhytm-logo-dark.png' : '/rhytm-logo-light.png'}
                      alt="RHYTM Logo"
                      className="h-16 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </Link>
                  <button
                    onClick={closeMobileMenu}
                    className={`p-2 rounded-lg transition-colors ${
                      currentTheme === 'dark' 
                        ? 'text-white hover:bg-white/10' 
                        : 'text-[#1a1a17] hover:bg-[#1a1a17]/10'
                    }`}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Mobile Menu Content */}
              <div className="relative z-10 p-4 space-y-6">
                {/* Navigation Links */}
                <nav className="space-y-2">
                  <MobileNav theme={currentTheme} onItemClick={closeMobileMenu} />
                </nav>

                {/* Mobile Actions */}
                <div className="space-y-4 pt-4 border-t border-opacity-10">
                  <button className={`w-full ${currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow`}>
                    Connect Beatport
                  </button>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                      Theme
                    </span>
                    <ThemeToggle theme={currentTheme} setTheme={handleThemeChange} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        <div className="relative flex-1">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}

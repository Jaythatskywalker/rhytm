'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import { DashboardPage } from '@/components/Layout/DashboardPage';
import DiscoverDashboard from '@/components/Dashboard/DiscoverDashboard';

export default function Page() {
  const [showLanding, setShowLanding] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Check localStorage on mount to see if user was previously in dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('rhytm-view-mode');
      if (savedMode === 'dashboard') {
        setShowLanding(false);
      }
    }
  }, []);

  const handleEnterDashboard = () => {
    setShowLanding(false);
    localStorage.setItem('rhytm-view-mode', 'dashboard');
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    localStorage.setItem('rhytm-view-mode', 'landing');
  };

  if (showLanding) {
    return (
      <div className="relative">
        {/* Toggle Button - Fixed position over landing page */}
        <button
          onClick={handleEnterDashboard}
          className="fixed top-4 right-4 z-[60] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          Enter Dashboard →
        </button>
        <LandingPage />
      </div>
    );
  }

  return (
    <DashboardPage theme={theme} onThemeChange={setTheme}>
      {/* Toggle Button - Fixed position over dashboard */}
      <button
        onClick={handleBackToLanding}
        className="fixed top-4 right-4 z-[60] bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
      >
        ← Back to Landing
      </button>
      <DiscoverDashboard theme={theme} />
    </DashboardPage>
  );
}

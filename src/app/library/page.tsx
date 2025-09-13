'use client';

import React, { useMemo } from 'react';
import { FilterBar } from '@/components/Discover/FilterBar';
import { TracksTable } from '@/components/Discover/TracksTable';
import { useFiltersStore } from '@/lib/stores/useFiltersStore';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';
import { filterTracks, sortTracks } from '@/lib/sampleData';
import { DashboardPage } from '@/components/Layout/DashboardPage';

export default function LibraryPage() {
  const { filters, sort } = useFiltersStore();
  const { tracks } = useLibraryStore();
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const filteredAndSortedTracks = useMemo(() => {
    const filtered = filterTracks(tracks, filters);
    return sortTracks(filtered, sort);
  }, [tracks, filters, sort]);

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  return (
    <DashboardPage theme={theme} onThemeChange={setTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">
            Library
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
            Your saved tracks ({tracks.length} total)
          </p>
        </div>

        {/* Filter section */}
        <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md mb-6`}>
          <FilterBar theme={theme} />
        </div>
        
        {/* Tracks section */}
        <div className={`${cardClass} rounded-2xl border transition hover:shadow-md mb-8 overflow-hidden`}>
          <TracksTable tracks={filteredAndSortedTracks} theme={theme} />
        </div>
        
        {tracks.length === 0 && (
          <div className={`${cardClass} rounded-2xl p-12 border transition hover:shadow-md text-center`}>
            <div className="text-6xl mb-4">🎵</div>
            <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              Your library is empty
            </h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              Start adding tracks from the Discover page to build your collection.
            </p>
          </div>
        )}
      </div>
    </DashboardPage>
  );
}

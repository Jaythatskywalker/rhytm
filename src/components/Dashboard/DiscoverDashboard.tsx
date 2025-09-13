'use client';

import React, { useMemo } from 'react';
import { FilterBar } from '@/components/Discover/FilterBar';
import { TracksTable } from '@/components/Discover/TracksTable';
import { DashboardNav } from '@/components/Layout/DashboardNav';
import { useFiltersStore } from '@/lib/stores/useFiltersStore';
import { sampleTracks, filterTracks, sortTracks } from '@/lib/sampleData';
import { useClientInit } from '@/hooks/useClientInit';


interface DiscoverDashboardProps {
  theme?: 'dark' | 'light';
}

export default function DiscoverDashboard({ theme = 'dark' }: DiscoverDashboardProps) {
  const { filters, sort } = useFiltersStore();
  
  // Initialize client-side data
  useClientInit();

  const filteredAndSortedTracks = useMemo(() => {
    const filtered = filterTracks(sampleTracks, filters);
    return sortTracks(filtered, sort);
  }, [filters, sort]);

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Discover
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
            Find new tracks and build your perfect collection with AI-powered curation
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
        
        {/* AI Recommendation section */}
        <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${theme === 'dark' ? 'from-emerald-500/30 to-blue-500/30 border-emerald-400/40' : 'from-emerald-500/20 to-blue-500/20 border-emerald-400/30'} h-10 w-10 rounded-xl bg-gradient-to-br grid place-items-center text-sm border shadow-sm`}>
              🤖
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                AI Recommendations
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                Personalized track suggestions based on your style
              </p>
            </div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/40 border-[#1a1a17]/10'} rounded-xl p-4 border`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></div>
              <span className="text-sm font-medium">Learning your preferences...</span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              AI-powered recommendations will appear here based on your listening history, likes, and collection patterns. 
              The more you interact with tracks, the better our suggestions become.
            </p>
            
            <div className="mt-4 flex gap-2">
              <button className={`${theme === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} px-4 py-2 rounded-lg border text-sm font-medium transition shadow hover:shadow-md`}>
                Enable AI Suggestions
              </button>
              <button className={`${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-[#1a1a17]/5 hover:bg-[#1a1a17]/10 text-[#1a1a17]'} px-4 py-2 rounded-lg text-sm font-medium transition hover:shadow`}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

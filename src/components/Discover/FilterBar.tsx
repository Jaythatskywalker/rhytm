'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useFiltersStore } from '@/lib/stores/useFiltersStore';
import { GENRES, KEYS, MOODS, ENERGY_LEVELS, VOCAL_AMOUNTS } from '@/types';

export function FilterBar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const { filters, setFilter, clearFilters } = useFiltersStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  const inputClass = theme === 'dark' 
    ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-emerald-500 focus:border-emerald-500'
    : 'bg-white/80 border-[#1a1a17]/20 text-[#1a1a17] placeholder-[#1a1a17]/50 focus:ring-emerald-500 focus:border-emerald-500';

  const selectClass = theme === 'dark'
    ? 'bg-white/10 border-white/20 text-white focus:ring-emerald-500 focus:border-emerald-500'
    : 'bg-white/80 border-[#1a1a17]/20 text-[#1a1a17] focus:ring-emerald-500 focus:border-emerald-500';

  const buttonClass = theme === 'dark'
    ? 'text-emerald-400 hover:text-emerald-300'
    : 'text-emerald-600 hover:text-emerald-700';

  const clearButtonClass = theme === 'dark'
    ? 'text-white/70 hover:text-white'
    : 'text-[#1a1a17]/70 hover:text-[#1a1a17]';

  return (
    <div className="space-y-4">
      {/* Search and basic filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-white/40' : 'text-[#1a1a17]/40'}`} size={16} />
            <input
              type="text"
              placeholder="Search tracks, artists, labels..."
              value={filters.query || ''}
              onChange={(e) => setFilter('query', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg transition ${inputClass}`}
            />
          </div>
        </div>

        <select
          value={filters.genre || ''}
          onChange={(e) => setFilter('genre', e.target.value || undefined)}
          className={`px-3 py-2 border rounded-lg transition ${selectClass}`}
        >
          <option value="">All Genres</option>
          {GENRES.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select
          value={filters.key || ''}
          onChange={(e) => setFilter('key', e.target.value || undefined)}
          className={`px-3 py-2 border rounded-lg transition ${selectClass}`}
        >
          <option value="">All Keys</option>
          {KEYS.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2 text-sm font-medium transition ${buttonClass}`}
        >
          {showAdvanced ? 'Less Filters' : 'More Filters'}
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className={`flex items-center space-x-1 px-3 py-2 text-sm transition ${clearButtonClass}`}
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className={`space-y-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#1a1a17]/10'}`}>
          {/* First row: BPM */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>BPM:</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.bpmMin || ''}
                onChange={(e) => setFilter('bpmMin', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-20 px-2 py-1 border rounded text-sm transition ${inputClass}`}
                min="60"
                max="200"
              />
              <span className={theme === 'dark' ? 'text-white/50' : 'text-[#1a1a17]/50'}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.bpmMax || ''}
                onChange={(e) => setFilter('bpmMax', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-20 px-2 py-1 border rounded text-sm transition ${inputClass}`}
                min="60"
                max="200"
              />
            </div>
          </div>

          {/* Second row: Mood, Energy, Vocals */}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filters.mood || ''}
              onChange={(e) => setFilter('mood', e.target.value || undefined)}
              className={`px-3 py-2 border rounded-lg transition ${selectClass}`}
            >
              <option value="">All Moods</option>
              {MOODS.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>

            <select
              value={filters.energyLevel || ''}
              onChange={(e) => setFilter('energyLevel', e.target.value || undefined)}
              className={`px-3 py-2 border rounded-lg transition ${selectClass}`}
            >
              <option value="">All Energy Levels</option>
              {ENERGY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <div className="flex items-center space-x-3">
              <label className={`flex items-center space-x-2 text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                <input
                  type="checkbox"
                  checked={filters.hasVocals === true}
                  onChange={(e) => setFilter('hasVocals', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Has Vocals</span>
              </label>
            </div>

            {filters.hasVocals && (
              <select
                value={filters.vocalAmount || ''}
                onChange={(e) => setFilter('vocalAmount', e.target.value || undefined)}
                className={`px-3 py-2 border rounded-lg transition ${selectClass}`}
              >
                <option value="">Any Amount</option>
                {VOCAL_AMOUNTS.map(amount => (
                  <option key={amount} value={amount}>{amount}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

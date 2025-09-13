'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, Send, Bot, Mic, MicOff } from 'lucide-react';
import { useFiltersStore } from '@/lib/stores/useFiltersStore';
import { GENRES, KEYS, MOODS, ENERGY_LEVELS, VOCAL_AMOUNTS, Track } from '@/types';
import { BeatportURLService, processAIQueryWithBeatport } from '@/lib/sampleData';

interface AIResponse {
  text: string;
  appliedFilters?: any;
  suggestions?: string[];
}

export function FilterBar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const { filters, setFilter, clearFilters } = useFiltersStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const processAIQuery = async (query: string, onTrackResults?: (tracks: Track[]) => void): Promise<AIResponse> => {
    setIsProcessing(true);
    const beatportURLs = BeatportURLService.extractBeatportURLs(query);

    if (beatportURLs.length > 0) {
      try {
        const result = await processAIQueryWithBeatport(query, onTrackResults);
        return { text: result.text, appliedFilters: result.appliedFilters, suggestions: result.suggestions };
      } catch (error) {
        return { text: 'Error processing Beatport URLs.', suggestions: ['Check URL format'] };
      } finally {
        setIsProcessing(false);
      }
    }

    // Simulate AI processing for non-URL queries
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerQuery = query.toLowerCase();
    let appliedFilters: any = {};
    let responseText = '';
    let suggestions: string[] = [];

    // Genre detection
    const foundGenre = GENRES.find(genre => lowerQuery.includes(genre.toLowerCase()));
    if (foundGenre) {
      appliedFilters.genre = foundGenre;
      setFilter('genre', foundGenre);
      responseText += `🎵 Set genre to ${foundGenre}. `;
    }

    // Mood detection
    const foundMood = MOODS.find(mood => lowerQuery.includes(mood.toLowerCase()));
    if (foundMood) {
      appliedFilters.mood = foundMood;
      setFilter('mood', foundMood);
      responseText += `😊 Set mood to ${foundMood}. `;
    }

    // Energy detection
    const foundEnergy = ENERGY_LEVELS.find(energy => lowerQuery.includes(energy.toLowerCase()));
    if (foundEnergy) {
      appliedFilters.energyLevel = foundEnergy;
      setFilter('energyLevel', foundEnergy);
      responseText += `⚡ Set energy level to ${foundEnergy}. `;
    }

    // BPM detection
    const bpmMatch = lowerQuery.match(/(\d+)\s*bpm/);
    if (bpmMatch) {
      const bpm = parseInt(bpmMatch[1]);
      appliedFilters.bpmMin = Math.max(bpm - 5, 60);
      appliedFilters.bpmMax = Math.min(bpm + 5, 200);
      setFilter('bpmMin', appliedFilters.bpmMin);
      setFilter('bpmMax', appliedFilters.bpmMax);
      responseText += `🥁 Set BPM range to ${appliedFilters.bpmMin}-${appliedFilters.bpmMax}. `;
    }

    // Vocals detection
    if (lowerQuery.includes('vocal') || lowerQuery.includes('singing')) {
      appliedFilters.hasVocals = true;
      setFilter('hasVocals', true);
      responseText += `🎤 Filtering for tracks with vocals. `;
    }

    if (!responseText) {
      responseText = `🔍 Searching for "${query}". Try being more specific with genres, moods, or BPM!`;
      suggestions = [
        'Try "dark techno 128 BPM"',
        'Search "melodic house with vocals"',
        'Find "high energy trance"',
        'Look for "minimal deep house"'
      ];
    } else {
      suggestions = [
        'Refine with BPM range',
        'Add mood filter',
        'Specify vocal preference',
        'Try different genre'
      ];
    }

    setIsProcessing(false);
    return { text: responseText, appliedFilters, suggestions };
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = filters.query || '';
    if (!query.trim() || isProcessing) return;

    setSearchHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 5));
    const response = await processAIQuery(query);
    setAiResponse(response);
    setAiMode(true);
  };

  return (
    <div className="space-y-4">
      {/* AI Response Section */}
      {aiMode && aiResponse && (
        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-purple-500/10 border-purple-400/30' : 'bg-purple-50 border-purple-200'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bot className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} size={16} />
              <span className={`font-medium text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                AI Assistant
              </span>
            </div>
            <button
              onClick={() => setAiMode(false)}
              className={`text-xs ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-[#1a1a17]/70 hover:text-[#1a1a17]'}`}
            >
              ✕ Close
            </button>
          </div>
          <div className={`text-sm mb-3 ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
            {aiResponse.text}
          </div>
          {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aiResponse.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFilter('query', suggestion);
                    setAiMode(false);
                  }}
                  className={`px-2 py-1 text-xs rounded transition ${
                    theme === 'dark' 
                      ? 'bg-white/10 hover:bg-white/20 text-white/80' 
                      : 'bg-white/70 hover:bg-white/90 text-purple-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search and basic filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <form onSubmit={handleAISearch} className="relative">
            <div className="flex">
              <div className="relative flex-1">
                <Sparkles className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} size={16} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask AI: 'Find dark techno for peak time' or search normally..."
                  value={filters.query || ''}
                  onChange={(e) => setFilter('query', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-l-lg transition ${inputClass}`}
                  disabled={isProcessing}
                />
                {isProcessing && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!filters.query?.trim() || isProcessing}
                className={`px-4 py-3 rounded-r-lg border-l-0 border transition ${
                  filters.query?.trim() && !isProcessing
                    ? theme === 'dark'
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/40 text-purple-200'
                      : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                    : 'opacity-50 cursor-not-allowed border-gray-300'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
          
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              <span className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-[#1a1a17]/50'}`}>
                Recent:
              </span>
              {searchHistory.slice(0, 3).map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => setFilter('query', query)}
                  className={`text-xs px-2 py-1 rounded transition ${
                    theme === 'dark' 
                      ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                      : 'bg-[#1a1a17]/5 hover:bg-[#1a1a17]/10 text-[#1a1a17]/70'
                  }`}
                >
                  {query.length > 20 ? query.substring(0, 20) + '...' : query}
                </button>
              ))}
            </div>
          )}
          
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-[#1a1a17]/60'}`}>
            💡 Try: "Find groovy house tracks" • "128 BPM minimal techno" • "Dark progressive for peak time"
          </p>
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

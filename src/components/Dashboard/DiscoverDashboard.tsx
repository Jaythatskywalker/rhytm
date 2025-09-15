'use client';

import React, { useMemo, useState } from 'react';
import { FilterBar } from '@/components/Discover/FilterBar';
import { TracksTable } from '@/components/Discover/TracksTable';
// import { DashboardNav } from '@/components/Layout/DashboardNav'; // Unused
import { useFiltersStore } from '@/lib/stores/useFiltersStore';
import { sampleTracks, filterTracks, sortTracks, BeatportURLService, processAIQueryWithBeatport } from '@/lib/sampleData';
import { useClientInit } from '@/hooks/useClientInit';
import { Music, Clock, Key, BarChart3, Zap, Music2, ArrowRight } from 'lucide-react';
import { Track } from '@/types';


// Beatport Test Interface Component
interface BeatportTestInterfaceProps {
  theme: 'dark' | 'light';
}

function BeatportTestInterface({ theme }: BeatportTestInterfaceProps) {
  const [testInput, setTestInput] = useState('');
  const [extractedURLs, setExtractedURLs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedTracks, setProcessedTracks] = useState<Track[]>([]);
  const [testResults, setTestResults] = useState<{
    text: string;
    suggestions?: string[];
  } | null>(null);
  const [showTestInterface, setShowTestInterface] = useState(false);

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  const handleTestExtraction = () => {
    const urls = BeatportURLService.extractBeatportURLs(testInput);
    setExtractedURLs(urls);
    console.log('Extracted URLs:', urls);
  };

  const handleTestProcessing = async () => {
    setIsProcessing(true);
    setProcessedTracks([]);
    setTestResults(null);

    try {
      const result = await processAIQueryWithBeatport(testInput, (tracks) => {
        setProcessedTracks(tracks);
      });
      
      setTestResults(result);
    } catch (error) {
      setTestResults({
        text: 'Error processing URLs: ' + (error as Error).message,
        suggestions: ['Check URL format', 'Try again']
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleURLs = [
    'https://www.beatport.com/track/midnight-express/123456',
    'beatport.com/track/dark-energy/789012',
    'https://beatport.com/track/cosmic-journey/345678'
  ];

  const handleUseSampleURLs = () => {
    setTestInput(sampleURLs.join('\n'));
  };

  if (!showTestInterface) {
    return (
      <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              🧪 Beatport Integration Test
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              Test the Beatport URL processing and track metadata fetching
            </p>
          </div>
          <button
            onClick={() => setShowTestInterface(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              theme === 'dark' 
                ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/40 text-purple-200 border' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Open Test Interface
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
          🧪 Beatport Integration Test Interface
        </h3>
        <button
          onClick={() => setShowTestInterface(false)}
          className={`px-3 py-1 rounded text-sm ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-[#1a1a17]/70 hover:text-[#1a1a17]'}`}
        >
          ✕ Close
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
            Paste Beatport URLs (one per line):
          </label>
          <textarea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="https://www.beatport.com/track/example/123456&#10;beatport.com/track/another/789012"
            className={`w-full h-32 px-3 py-2 border rounded-lg transition resize-none ${
              theme === 'dark'
                ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                : 'bg-white/80 border-[#1a1a17]/20 text-[#1a1a17] placeholder-[#1a1a17]/50'
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleUseSampleURLs}
            className={`px-3 py-1 rounded text-sm transition ${
              theme === 'dark' 
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            Use Sample URLs
          </button>
          <button
            onClick={handleTestExtraction}
            disabled={!testInput.trim()}
            className={`px-3 py-1 rounded text-sm transition ${
              testInput.trim()
                ? theme === 'dark' 
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Extract URLs
          </button>
          <button
            onClick={handleTestProcessing}
            disabled={!testInput.trim() || isProcessing}
            className={`px-3 py-1 rounded text-sm transition ${
              testInput.trim() && !isProcessing
                ? theme === 'dark' 
                  ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300' 
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Process URLs'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* URL Extraction Results */}
        {extractedURLs.length > 0 && (
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-green-500/10 border-green-400/30' : 'bg-green-50 border-green-200'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
              ✅ Extracted {extractedURLs.length} URL{extractedURLs.length !== 1 ? 's' : ''}:
            </h4>
            <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>
              {extractedURLs.map((url, idx) => (
                <li key={idx} className="font-mono break-all">• {url}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-500/10 border-blue-400/30' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                Processing Beatport URLs... This may take a few seconds.
              </span>
            </div>
          </div>
        )}

        {/* AI Response */}
        {testResults && (
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-purple-500/10 border-purple-400/30' : 'bg-purple-50 border-purple-200'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
              🤖 AI Response:
            </h4>
            <div className={`text-sm whitespace-pre-line mb-3 ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
              {testResults.text}
            </div>
            {testResults.suggestions && (
              <div className="flex flex-wrap gap-2">
                {testResults.suggestions.map((suggestion, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs rounded ${
                      theme === 'dark' 
                        ? 'bg-white/10 text-white/80' 
                        : 'bg-white/70 text-purple-700'
                    }`}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Track Results */}
        {processedTracks.length > 0 && (
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-emerald-50 border-emerald-200'}`}>
            <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'}`}>
              🎵 Processed {processedTracks.length} Track{processedTracks.length !== 1 ? 's' : ''}:
            </h4>
            <div className="space-y-3">
              {processedTracks.map((track) => (
                <div key={track.id} className={`p-3 rounded border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-emerald-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
                        {track.title}
                      </h5>
                      <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                        by {track.artists.join(', ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                      ID: {track.beatportId}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Music size={12} />
                      <span>{track.genre}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{track.bpm} BPM</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Key size={12} />
                      <span>{track.key}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📅 {track.releaseDate}</span>
                    </div>
                  </div>
                  
                  {track.label && (
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white/50' : 'text-[#1a1a17]/50'}`}>
                      Label: {track.label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics for processed tracks */}
        {processedTracks.length > 0 && (
          <TrackAnalytics tracks={processedTracks} theme={theme} />
        )}
      </div>
    </div>
  );
}

// Track Analytics Component
interface TrackAnalyticsProps {
  tracks: Track[];
  theme: 'dark' | 'light';
}

function TrackAnalytics({ tracks, theme }: TrackAnalyticsProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState<'keys' | 'bpm' | 'energy'>('keys');

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  if (tracks.length === 0) {
    return null;
  }

  if (!showAnalytics) {
    return (
      <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              📊 Track Analytics
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              Analyze {tracks.length} tracks for harmonic mixing and BPM compatibility
            </p>
          </div>
          <button
            onClick={() => setShowAnalytics(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              theme === 'dark' 
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200 border' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            Analyze Tracks
          </button>
        </div>
      </div>
    );
  }

  const keyAnalysis = BeatportURLService.analyzeKeyCompatibility(tracks);
  const bpmAnalysis = BeatportURLService.analyzeBPMCompatibility(tracks);

  // Camelot Wheel positions for visualization (commented out - unused)
  // const camelotPositions = {
  //   '1A': { x: 50, y: 5, color: '#ef4444' },   '1B': { x: 65, y: 10, color: '#f97316' },
  //   '2A': { x: 75, y: 20, color: '#f59e0b' },  '2B': { x: 80, y: 35, color: '#eab308' },
  //   '3A': { x: 80, y: 50, color: '#84cc16' },  '3B': { x: 75, y: 65, color: '#22c55e' },
  //   '4A': { x: 65, y: 75, color: '#10b981' },  '4B': { x: 50, y: 80, color: '#14b8a6' },
  //   '5A': { x: 35, y: 75, color: '#06b6d4' },  '5B': { x: 25, y: 65, color: '#0ea5e9' },
  //   '6A': { x: 20, y: 50, color: '#3b82f6' },  '6B': { x: 25, y: 35, color: '#6366f1' },
  //   '7A': { x: 35, y: 25, color: '#8b5cf6' },  '7B': { x: 50, y: 20, color: '#a855f7' },
  //   '8A': { x: 65, y: 25, color: '#c084fc' },  '8B': { x: 75, y: 35, color: '#d946ef' },
  //   '9A': { x: 75, y: 50, color: '#ec4899' },  '9B': { x: 65, y: 65, color: '#f43f5e' },
  //   '10A': { x: 50, y: 70, color: '#ef4444' }, '10B': { x: 35, y: 65, color: '#f97316' },
  //   '11A': { x: 25, y: 50, color: '#f59e0b' }, '11B': { x: 35, y: 35, color: '#eab308' },
  //   '12A': { x: 50, y: 30, color: '#84cc16' }, '12B': { x: 65, y: 35, color: '#22c55e' }
  // };

  // Get unique keys from tracks (commented out - unused)
  // const trackKeys = tracks.map(t => t.key);
  // const uniqueKeys = [...new Set(trackKeys)]; // Unused

  // BPM distribution
  const bpms = tracks.map(t => t.bpm).sort((a, b) => a - b);
  const minBpm = Math.min(...bpms);
  const maxBpm = Math.max(...bpms);
  const bpmRange = maxBpm - minBpm;

  // Energy analysis
  const energyLevels = tracks.map(t => ({
    title: t.title,
    energy: t.features?.energy || 0.5,
    bpm: t.bpm
  })).sort((a, b) => a.energy - b.energy);

  return (
    <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
          📊 Track Analytics Dashboard
        </h3>
        <button
          onClick={() => setShowAnalytics(false)}
          className={`px-3 py-1 rounded text-sm ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-[#1a1a17]/70 hover:text-[#1a1a17]'}`}
        >
          ✕ Close
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'keys', label: 'Key Analysis', icon: Music2 },
          { id: 'bpm', label: 'BPM Analysis', icon: BarChart3 },
          { id: 'energy', label: 'Energy Flow', icon: Zap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'discover' | 'test')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? theme === 'dark'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : 'bg-emerald-600 text-white'
                : theme === 'dark'
                  ? 'text-white/70 hover:bg-white/10'
                  : 'text-[#1a1a17]/70 hover:bg-[#1a1a17]/5'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Key Analysis Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-500/10 border-blue-400/30' : 'bg-blue-50 border-blue-200'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              🎹 Harmonic Mixing Analysis
            </h4>
            <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
              {keyAnalysis.analysis}
            </p>
          </div>

          {/* Key Compatibility Matrix */}
          <div>
            <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              Compatibility Matrix
            </h4>
            {keyAnalysis.compatible.length > 0 ? (
              <div className="space-y-2">
                {keyAnalysis.compatible.map((pair, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                          {pair.track1.key}
                        </span>
                        <ArrowRight size={12} />
                        <span className={`px-2 py-1 rounded text-xs font-mono ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                          {pair.track2.key}
                        </span>
                      </div>
                      <span className={`text-xs ${
                        pair.compatibility === 'Perfect Match' 
                          ? theme === 'dark' ? 'text-green-300' : 'text-green-600'
                          : pair.compatibility === 'Energy Change'
                          ? theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                          : theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        {pair.compatibility}
                      </span>
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                      {pair.track1.title} → {pair.track2.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                No compatible key pairs found. Try tracks in related keys for harmonic mixing.
              </p>
            )}
          </div>
        </div>
      )}

      {/* BPM Analysis Tab */}
      {activeTab === 'bpm' && (
        <div className="space-y-6">
          {/* BPM Summary */}
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-orange-500/10 border-orange-400/30' : 'bg-orange-50 border-orange-200'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}>
              🥁 BPM Compatibility Analysis
            </h4>
            <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-orange-200' : 'text-orange-700'}`}>
              {bpmAnalysis.analysis}
            </p>
            {bpmAnalysis.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {bpmAnalysis.suggestions.map((suggestion, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-white/10 text-white/80' : 'bg-white/70 text-orange-700'}`}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* BPM Distribution Chart */}
          <div>
            <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              BPM Distribution
            </h4>
            <div className="space-y-2">
              {tracks.map((track, idx) => {
                const percentage = bpmRange > 0 ? ((track.bpm - minBpm) / bpmRange) * 100 : 50;
                return (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className={`w-24 text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                      {track.bpm} BPM
                    </div>
                    <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${Math.max(percentage, 10)}%` }}
                      />
                    </div>
                    <div className={`w-32 text-xs truncate ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                      {track.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BPM Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded border text-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'}`}>
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
                {minBpm}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                Min BPM
              </div>
            </div>
            <div className={`p-3 rounded border text-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'}`}>
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                {Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length)}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                Avg BPM
              </div>
            </div>
            <div className={`p-3 rounded border text-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'}`}>
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                {maxBpm}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                Max BPM
              </div>
            </div>
            <div className={`p-3 rounded border text-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'}`}>
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                {bpmRange}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                Range
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Analysis Tab */}
      {activeTab === 'energy' && (
        <div className="space-y-6">
          {/* Energy Flow Visualization */}
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-purple-500/10 border-purple-400/30' : 'bg-purple-50 border-purple-200'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
              ⚡ Energy Progression
            </h4>
            <p className={`text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
              Track energy levels from lowest to highest - perfect for planning your set progression
            </p>
          </div>

          {/* Energy Progression Chart */}
          <div>
            <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              Recommended Set Order
            </h4>
            <div className="space-y-3">
              {energyLevels.map((track, idx) => {
                const energyPercentage = track.energy * 100;
                const energyColor = track.energy < 0.3 ? '#3b82f6' : 
                                  track.energy < 0.6 ? '#f59e0b' : 
                                  track.energy < 0.8 ? '#f97316' : '#ef4444';
                
                return (
                  <div key={idx} className={`p-3 rounded border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
                          {idx + 1}. {track.title}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                          {track.bpm} BPM
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                          Energy:
                        </span>
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                          <div
                            className="h-full transition-all duration-1000"
                            style={{ 
                              width: `${energyPercentage}%`,
                              backgroundColor: energyColor
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono">
                          {Math.round(energyPercentage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
        
        {/* Beatport Integration Test Interface */}
        <div className="mb-8">
          <BeatportTestInterface theme={theme} />
        </div>
        
        {/* Track Analytics for filtered tracks */}
        {filteredAndSortedTracks.length > 0 && (
          <div className="mb-8">
            <TrackAnalytics tracks={filteredAndSortedTracks} theme={theme} />
          </div>
        )}
      </div>
  );
}

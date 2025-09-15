'use client';

import React, { useState } from 'react';
import { Download, FileText, Music, Code } from 'lucide-react';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';
import { generateLocalCSV, generateLocalM3U, generateLocalJSON, downloadFile } from '@/lib/exportUtils';
import { DashboardPage } from '@/components/Layout/DashboardPage';
import toast from 'react-hot-toast';

export default function ExportPage() {
  const { collections, getCollectionTracks } = useLibraryStore();
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'm3u' | 'json'>('csv');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const handleExport = async () => {
    if (!selectedCollection) {
      toast.error('Please select a collection to export');
      return;
    }

    const collection = collections.find(c => c.id === selectedCollection);
    if (!collection) {
      toast.error('Collection not found');
      return;
    }

    const tracks = getCollectionTracks(selectedCollection);
    if (tracks.length === 0) {
      toast.error('Collection is empty');
      return;
    }

    setIsExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      const safeCollectionName = collection.name.replace(/[^a-zA-Z0-9]/g, '_');

      switch (selectedFormat) {
        case 'csv':
          content = generateLocalCSV(tracks, collection.name);
          filename = `${safeCollectionName}.csv`;
          mimeType = 'text/csv';
          break;
        case 'm3u':
          content = generateLocalM3U(tracks, collection.name);
          filename = `${safeCollectionName}.m3u`;
          mimeType = 'audio/x-mpegurl';
          break;
        case 'json':
          content = generateLocalJSON(tracks, collection);
          filename = `${safeCollectionName}.json`;
          mimeType = 'application/json';
          break;
      }

      downloadFile(content, filename, mimeType);
      toast.success(`Exported ${tracks.length} tracks as ${selectedFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcons = {
    csv: <FileText size={20} />,
    m3u: <Music size={20} />,
    json: <Code size={20} />
  };

  const formatDescriptions = {
    csv: 'Comma-separated values file compatible with Excel and other spreadsheet applications',
    m3u: 'Standard playlist format compatible with most DJ software and media players',
    json: 'Structured data format for developers and advanced integrations'
  };

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  return (
    <DashboardPage theme={theme} onThemeChange={setTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">
            Export & Sync
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
            Export your collections or sync with Beatport DJ
          </p>
        </div>

        {/* Beatport Sync Section */}
        <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Beatport DJ Sync</h2>
              <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Automatically sync your collections to Beatport DJ</p>
            </div>
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
        </div>
        
          <div className={`border rounded-md p-4 mb-4 ${theme === 'dark' ? 'bg-red-500/10 border-red-400/30' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
              <strong>Not connected:</strong> Connect your Beatport account to enable automatic sync
            </p>
          </div>
          
          <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/40 text-blue-200 border' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            Connect Beatport Account
          </button>
      </div>

          {/* Manual Export Section */}
          <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manual Export</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              Export your collections in various formats for backup or use with other applications
            </p>

        <div className="space-y-6">
          {/* Collection Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Collection
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a collection...</option>
              {collections.map(collection => {
                const trackCount = getCollectionTracks(collection.id).length;
                return (
                  <option key={collection.id} value={collection.id}>
                    {collection.name} ({trackCount} track{trackCount !== 1 ? 's' : ''})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['csv', 'm3u', 'json'] as const).map(format => (
                <label
                  key={format}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    selectedFormat === format
                      ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={selectedFormat === format}
                    onChange={(e) => setSelectedFormat(e.target.value as 'csv' | 'm3u' | 'json')}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="text-blue-600 mr-3">
                      {formatIcons[format]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 uppercase">
                        {format}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDescriptions[format]}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include extended metadata (BPM, key, genre, etc.)</span>
            </label>
          </div>

          {/* Export Button */}
          <div className="pt-4">
            <button
              onClick={handleExport}
              disabled={!selectedCollection || isExporting}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <Download size={16} />
              <span>{isExporting ? 'Exporting...' : 'Export Collection'}</span>
            </button>
          </div>
        </div>
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No collections to export
          </h3>
          <p className="text-gray-600 mb-4">
            Create some collections first to use the export functionality.
          </p>
        </div>
        )}
      </div>
    </DashboardPage>
  );
}

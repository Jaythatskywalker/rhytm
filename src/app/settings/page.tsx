'use client';

import React, { useState } from 'react';
import { ExternalLink, Trash2, RefreshCw, Shield, User, Music } from 'lucide-react';
import { DashboardPage } from '@/components/Layout/DashboardPage';

export default function SettingsPage() {
  const [manualMode, setManualMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const handleResetProfile = () => {
    // TODO: Implement profile reset
    console.log('Resetting DJ profile...');
    setShowResetConfirm(false);
  };

  const handleClearCache = () => {
    // TODO: Implement cache clearing
    console.log('Clearing local cache...');
  };

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  return (
    <DashboardPage theme={theme} onThemeChange={setTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
            Manage your account, preferences, and data
          </p>
        </div>

        <div className="space-y-8">
          {/* Beatport Connection */}
          <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
            <div className="flex items-center space-x-3 mb-4">
              <Music className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={24} />
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Beatport Connection</h2>
            </div>
          
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg border ${theme === 'dark' ? 'bg-red-500/10 border-red-400/30' : 'bg-red-50 border-red-200'}`}>
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>Not Connected</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Connect your Beatport account to enable automatic sync</p>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/40 text-blue-200 border' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  Connect
                </button>
              </div>
            
              <div className="flex items-center justify-between">
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Manual Mode</label>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                    Operate only on user-provided URLs/IDs (ToS compliant)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualMode}
                    onChange={(e) => setManualMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme === 'dark' ? 'bg-gray-600 peer-focus:ring-blue-400 after:border-gray-500 peer-checked:bg-blue-500' : 'bg-gray-200 peer-focus:ring-blue-300 after:border-gray-300 peer-checked:bg-blue-600'} peer-focus:outline-none peer-focus:ring-4`}></div>
                </label>
              </div>
          </div>
        </div>

          {/* DJ Profile */}
          <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
            <div className="flex items-center space-x-3 mb-4">
              <User className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} size={24} />
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>DJ Profile</h2>
            </div>
          
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-500/10 border-blue-400/30' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>AI Personalization Active</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Your profile learns from your listening habits and preferences</p>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                  <span>Edit Preferences</span>
                  <ExternalLink size={16} />
                </button>
                
                <button className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                  <span>View Learning Data</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className={`flex items-center space-x-2 transition-colors ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                >
                  <Trash2 size={16} />
                  <span>Reset DJ Profile</span>
                </button>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                  This will clear all learned preferences and start fresh
                </p>
              </div>
          </div>
        </div>

          {/* Data & Privacy */}
          <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={24} />
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Data & Privacy</h2>
            </div>
          
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-green-500/10 border-green-400/30' : 'bg-green-50 border-green-200'}`}>
                <p className={`font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Privacy Protected</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Your profile data is stored locally and never shared</p>
              </div>
            
            <div className="space-y-3">
              <button
                onClick={handleClearCache}
                className="flex items-center space-x-2 p-3 w-full text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
                <div>
                  <div className="font-medium">Clear Local Cache</div>
                  <div className="text-sm text-gray-500">Remove cached tracks and search results</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-2 p-3 w-full text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <ExternalLink size={16} />
                <div>
                  <div className="font-medium">Export My Data</div>
                  <div className="text-sm text-gray-500">Download all your data in JSON format</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Terms of Service Compliance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Service Compliance</h2>
          
          <div className="prose prose-sm text-gray-600">
            <p>
              Beatport Curator operates in full compliance with Beatport's Terms of Service:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>No scraping or automated browsing of Beatport pages</li>
              <li>Only uses official Beatport endpoints when available</li>
              <li>Operates on user-provided URLs/IDs and local metadata otherwise</li>
              <li>Respects rate limits and implements proper backoff strategies</li>
            </ul>
            <p className="mt-4">
              Manual Mode ensures complete ToS compliance by only working with data you explicitly provide.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Profile Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reset DJ Profile
            </h3>
            <p className="text-gray-600 mb-4">
              This will permanently delete all your learned preferences, liked tracks, and AI personalization data. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetProfile}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardPage>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CollectionCard } from '@/components/Collections/CollectionCard';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';
import { DashboardPage } from '@/components/Layout/DashboardPage';
import toast from 'react-hot-toast';

export default function CollectionsPage() {
  const { collections, createCollection } = useLibraryStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionTags, setNewCollectionTags] = useState('');
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCollectionName.trim()) {
      toast.error('Collection name is required');
      return;
    }

    const tags = newCollectionTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    createCollection(newCollectionName.trim(), tags);
    toast.success(`Created collection "${newCollectionName}"`);
    
    setNewCollectionName('');
    setNewCollectionTags('');
    setShowCreateForm(false);
  };

  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#1a1a17]/10';

  return (
    <DashboardPage theme={theme} onThemeChange={setTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">
              Collections
            </h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              Organize your tracks into curated playlists ({collections.length} collection{collections.length !== 1 ? 's' : ''})
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow hover:shadow-md ${theme === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200 border' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            <Plus size={16} />
            <span>New Collection</span>
          </button>
        </div>

        {/* Collections grid */}
        {collections.length > 0 ? (
          <div className={`${cardClass} rounded-2xl p-6 border transition hover:shadow-md`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        ) : (
          <div className={`${cardClass} rounded-2xl p-12 border transition hover:shadow-md text-center`}>
            <div className="text-6xl mb-4">📁</div>
            <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
              No collections yet
            </h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              Create your first collection to start organizing your tracks.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow hover:shadow-md ${theme === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200 border' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              <Plus size={16} />
              <span>Create Collection</span>
            </button>
          </div>
        )}

        {/* Create collection modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-lg p-6 max-w-md mx-4 w-full ${theme === 'dark' ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Create New Collection
              </h3>
            
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>
                    Collection Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., Peak Time Techno"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-gray-300 text-gray-900'}`}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="tags" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>
                    Tags (optional)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={newCollectionTags}
                    onChange={(e) => setNewCollectionTags(e.target.value)}
                    placeholder="e.g., techno, peak-time, dark (comma-separated)"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className={`flex-1 px-4 py-2 border rounded-md transition-colors ${theme === 'dark' ? 'text-white/70 border-white/20 hover:bg-white/10' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200 border' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardPage>
  );
}

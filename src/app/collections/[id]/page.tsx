'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Download } from 'lucide-react';
import { TracksTable } from '@/components/Discover/TracksTable';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  
  const { collections, getCollectionTracks } = useLibraryStore();
  
  const collection = useMemo(() => 
    collections.find(c => c.id === collectionId), 
    [collections, collectionId]
  );
  
  const tracks = useMemo(() => 
    getCollectionTracks(collectionId), 
    [getCollectionTracks, collectionId]
  );

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Collection not found
          </h2>
          <p className="text-gray-600 mb-4">
            The collection you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/collections')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/collections')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Collections</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {collection.name}
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span>{tracks.length} track{tracks.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Updated {formatDate(collection.updatedAt)}</span>
              {collection.syncedAt && (
                <>
                  <span>•</span>
                  <span>Synced {formatDate(collection.syncedAt)}</span>
                </>
              )}
            </div>
            
            {collection.tags && collection.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {collection.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {collection.beatportPlaylistId && (
              <a
                href={`https://www.beatport.com/playlist/${collection.beatportPlaylistId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={16} />
                <span>View on Beatport</span>
              </a>
            )}
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              collection.syncedAt 
                ? 'bg-green-400' 
                : collection.beatportPlaylistId 
                  ? 'bg-yellow-400' 
                  : 'bg-gray-300'
            }`} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {collection.syncedAt 
                  ? 'Synced with Beatport DJ'
                  : collection.beatportPlaylistId 
                    ? 'Sync pending'
                    : 'Not synced'
                }
              </p>
              <p className="text-xs text-gray-600">
                {collection.syncedAt 
                  ? `Last synced: ${formatDate(collection.syncedAt)}`
                  : 'Connect Beatport to enable automatic sync'
                }
              </p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
            {collection.syncedAt ? 'Sync Now' : 'Sync to Beatport DJ'}
          </button>
        </div>
      </div>

      {/* Tracks Table */}
      <div className="bg-white rounded-lg shadow">
        <TracksTable tracks={tracks} />
      </div>
      
      {tracks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tracks in this collection
          </h3>
          <p className="text-gray-600 mb-4">
            Add tracks from your library or the discover page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Browse Tracks →
          </button>
        </div>
      )}
    </div>
  );
}

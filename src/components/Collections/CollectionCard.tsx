'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Music, Calendar, MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Collection } from '@/types';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { getCollectionTracks, deleteCollection } = useLibraryStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const tracks = getCollectionTracks(collection.id);
  const trackCount = tracks.length;
  
  const handleDelete = () => {
    deleteCollection(collection.id);
    toast.success(`Deleted collection "${collection.name}"`);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link 
              href={`/collections/${collection.id}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {collection.name}
              </h3>
            </Link>
            
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Music size={14} />
                <span>{trackCount} track{trackCount !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Updated {formatDate(collection.updatedAt)}</span>
              </div>
            </div>

            {collection.tags && collection.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {collection.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <Link
                    href={`/collections/${collection.id}/edit`}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </Link>
                  
                  {collection.beatportPlaylistId && (
                    <a
                      href={`https://www.beatport.com/playlist/${collection.beatportPlaylistId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      <ExternalLink size={14} />
                      <span>View on Beatport</span>
                    </a>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sync status */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={clsx(
                'w-2 h-2 rounded-full',
                collection.syncedAt 
                  ? 'bg-green-400' 
                  : collection.beatportPlaylistId 
                    ? 'bg-yellow-400' 
                    : 'bg-gray-300'
              )} />
              <span className="text-xs text-gray-500">
                {collection.syncedAt 
                  ? `Synced ${formatDate(collection.syncedAt)}`
                  : collection.beatportPlaylistId 
                    ? 'Sync pending'
                    : 'Not synced'
                }
              </span>
            </div>
            
            <Link
              href={`/collections/${collection.id}`}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View →
            </Link>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Collection
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{collection.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

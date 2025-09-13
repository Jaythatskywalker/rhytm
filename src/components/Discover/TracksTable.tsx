'use client';

import { useState } from 'react';
import { 
  Play, 
  Heart, 
  Plus, 
  ChevronUp, 
  ChevronDown,
  MoreHorizontal 
} from 'lucide-react';
import { Track } from '@/types';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';
import { useFiltersStore } from '@/lib/stores/useFiltersStore';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface TracksTableProps {
  tracks: Track[];
  loading?: boolean;
  theme?: 'dark' | 'light';
}

export function TracksTable({ tracks, loading, theme = 'dark' }: TracksTableProps) {
  const { setCurrentTrack, currentTrack } = usePlayerStore();
  const { 
    addTrackToLibrary, 
    toggleTrackLike, 
    isTrackInLibrary,
    collections,
    addTrackToCollection 
  } = useLibraryStore();
  const { sort, setSort } = useFiltersStore();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const handlePlay = (track: Track) => {
    if (!track.previewUrl) {
      toast.error('No preview available for this track');
      return;
    }
    setCurrentTrack(track);
  };

  const handleAddToLibrary = (track: Track) => {
    addTrackToLibrary(track);
    toast.success(`Added "${track.title}" to library`);
  };

  const handleToggleLike = (track: Track) => {
    toggleTrackLike(track.id);
    toast.success(track.liked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCollection = (track: Track, collectionId: string) => {
    addTrackToCollection(collectionId, track.id);
    const collection = collections.find(c => c.id === collectionId);
    toast.success(`Added to "${collection?.name}"`);
    setSelectedTrack(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const SortableHeader = ({ field, children }: { field: any, children: React.ReactNode }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none transition ${
        theme === 'dark' 
          ? 'text-white/70 hover:bg-white/5' 
          : 'text-[#1a1a17]/70 hover:bg-[#1a1a17]/5'
      }`}
      onClick={() => setSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sort.field === field && (
          sort.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className={`shadow overflow-hidden sm:rounded-md ${theme === 'dark' ? 'bg-white/5' : 'bg-white/60'}`}>
        <div className="animate-pulse">
          <div className={`h-12 ${theme === 'dark' ? 'bg-white/10' : 'bg-[#1a1a17]/10'}`}></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`h-16 border-t ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/40 border-[#1a1a17]/10'}`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className={`min-w-full ${theme === 'dark' ? 'divide-white/10' : 'divide-[#1a1a17]/10'} divide-y`}>
        <thead className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/40'} backdrop-blur`}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-12 ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              #
            </th>
            <th className="px-2 py-3 w-12"></th>
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="artists">Artists</SortableHeader>
            <SortableHeader field="genre">Genre</SortableHeader>
            <SortableHeader field="bpm">BPM</SortableHeader>
            <SortableHeader field="key">Key</SortableHeader>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`${theme === 'dark' ? 'divide-white/10' : 'divide-[#1a1a17]/10'} divide-y`}>
          {tracks.map((track, index) => (
            <tr 
              key={track.id}
              className={clsx(
                'transition-colors',
                theme === 'dark' 
                  ? 'hover:bg-white/5' 
                  : 'hover:bg-[#1a1a17]/5',
                currentTrack?.id === track.id && (theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-500/10')
              )}
            >
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-white/50' : 'text-[#1a1a17]/50'}`}>
                {index + 1}
              </td>
              
              <td className="px-2 py-4 whitespace-nowrap">
                <button
                  onClick={() => handlePlay(track)}
                  className={clsx(
                    'p-2 rounded-full transition-colors',
                    track.previewUrl 
                      ? 'hover:bg-blue-100 text-blue-600' 
                      : 'text-gray-300 cursor-not-allowed'
                  )}
                  disabled={!track.previewUrl}
                >
                  <Play size={16} />
                </button>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
                  {track.title}
                </div>
                {track.label && (
                  <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                    {track.label}
                  </div>
                )}
              </td>
              
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-white' : 'text-[#1a1a17]'}`}>
                {track.artists.join(', ')}
              </td>
              
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                {track.genre}
              </td>
              
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                {track.bpm}
              </td>
              
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#1a1a17]/70'}`}>
                {track.key}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {!isTrackInLibrary(track.id) && (
                    <button
                      onClick={() => handleAddToLibrary(track)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Add to Library"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleToggleLike(track)}
                    className={clsx(
                      'transition-colors',
                      track.liked 
                        ? 'text-red-500 hover:text-red-700' 
                        : 'text-gray-400 hover:text-red-500'
                    )}
                    title={track.liked ? 'Unlike' : 'Like'}
                  >
                    <Heart size={16} fill={track.liked ? 'currentColor' : 'none'} />
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setSelectedTrack(selectedTrack === track.id ? null : track.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {selectedTrack === track.id && collections.length > 0 && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                        <div className="py-1">
                          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Add to Collection
                          </div>
                          {collections.map(collection => (
                            <button
                              key={collection.id}
                              onClick={() => handleAddToCollection(track, collection.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {collection.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {tracks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tracks found</p>
        </div>
      )}
    </div>
  );
}

import { create } from 'zustand';
import { Track, Collection, CollectionTrack } from '@/types';
import { dbManager, initializeIndexedDB } from '@/lib/db/indexedDB';

interface LibraryStore {
  // State
  tracks: Track[];
  collections: Collection[];
  collectionTracks: CollectionTrack[];
  isLoading: boolean;
  isOnline: boolean;
  
  // Actions
  addTrackToLibrary: (track: Track) => Promise<void>;
  removeTrackFromLibrary: (trackId: string) => Promise<void>;
  toggleTrackLike: (trackId: string) => Promise<void>;
  
  // Collection actions
  createCollection: (name: string, tags?: string[]) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addTrackToCollection: (collectionId: string, trackId: string) => Promise<void>;
  removeTrackFromCollection: (collectionId: string, trackId: string) => Promise<void>;
  reorderCollectionTracks: (collectionId: string, trackIds: string[]) => Promise<void>;
  
  // Data loading
  loadFromStorage: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  
  // Getters
  getCollectionTracks: (collectionId: string) => Track[];
  isTrackInLibrary: (trackId: string) => boolean;
  isTrackInCollection: (collectionId: string, trackId: string) => boolean;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  // State
  tracks: [],
  collections: [],
  collectionTracks: [],
  isLoading: false,
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,

  // Track actions
  addTrackToLibrary: async (track) => {
    const { tracks } = get();
    const exists = tracks.find(t => t.id === track.id);
    if (exists) return;
    
    // Update state immediately (optimistic update)
    set(state => ({
      tracks: [...state.tracks, track]
    }));
    
    // Only use IndexedDB in browser
    if (typeof window !== 'undefined') {
      try {
        await initializeIndexedDB();
        
        // Save to IndexedDB
        await dbManager.saveTracks([track]);
        
        // Queue for server sync if offline
        if (!dbManager.isOnline()) {
          await dbManager.addToSyncQueue({
            type: 'track',
            action: 'create',
            data: track
          });
        }
      } catch (error) {
        console.error('Failed to save track:', error);
        // Revert optimistic update
        set(state => ({
          tracks: state.tracks.filter(t => t.id !== track.id)
        }));
      }
    }
  },

  removeTrackFromLibrary: (trackId) => {
    set(state => ({
      tracks: state.tracks.filter(t => t.id !== trackId),
      // Also remove from all collections
      collectionTracks: state.collectionTracks.filter(ct => ct.trackId !== trackId)
    }));
  },

  toggleTrackLike: (trackId) => {
    set(state => ({
      tracks: state.tracks.map(track => 
        track.id === trackId 
          ? { ...track, liked: !track.liked }
          : track
      )
    }));
  },

  // Collection actions
  createCollection: (name, tags = []) => {
    const collection: Collection = {
      id: crypto.randomUUID(),
      userId: 'current-user', // TODO: Get from auth
      name,
      tags,
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      collections: [...state.collections, collection]
    }));
    
    return collection;
  },

  updateCollection: (id, updates) => {
    set(state => ({
      collections: state.collections.map(collection =>
        collection.id === id
          ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
          : collection
      )
    }));
  },

  deleteCollection: (id) => {
    set(state => ({
      collections: state.collections.filter(c => c.id !== id),
      collectionTracks: state.collectionTracks.filter(ct => ct.collectionId !== id)
    }));
  },

  addTrackToCollection: (collectionId, trackId) => {
    set(state => {
      const exists = state.collectionTracks.find(
        ct => ct.collectionId === collectionId && ct.trackId === trackId
      );
      
      if (exists) return state;
      
      const maxPosition = Math.max(
        0,
        ...state.collectionTracks
          .filter(ct => ct.collectionId === collectionId)
          .map(ct => ct.position)
      );
      
      const collectionTrack: CollectionTrack = {
        collectionId,
        trackId,
        position: maxPosition + 1
      };
      
      return {
        collectionTracks: [...state.collectionTracks, collectionTrack],
        collections: state.collections.map(collection =>
          collection.id === collectionId
            ? { ...collection, updatedAt: new Date().toISOString() }
            : collection
        )
      };
    });
  },

  removeTrackFromCollection: (collectionId, trackId) => {
    set(state => ({
      collectionTracks: state.collectionTracks.filter(
        ct => !(ct.collectionId === collectionId && ct.trackId === trackId)
      ),
      collections: state.collections.map(collection =>
        collection.id === collectionId
          ? { ...collection, updatedAt: new Date().toISOString() }
          : collection
      )
    }));
  },

  reorderCollectionTracks: (collectionId, trackIds) => {
    set(state => ({
      collectionTracks: state.collectionTracks.map(ct => {
        if (ct.collectionId !== collectionId) return ct;
        
        const newPosition = trackIds.indexOf(ct.trackId);
        return newPosition >= 0 ? { ...ct, position: newPosition } : ct;
      }),
      collections: state.collections.map(collection =>
        collection.id === collectionId
          ? { ...collection, updatedAt: new Date().toISOString() }
          : collection
      )
    }));
  },

  // Data loading
  loadFromStorage: async () => {
    // Only load in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    set({ isLoading: true });
    
    try {
      // Initialize IndexedDB first
      await initializeIndexedDB();
      
      const [tracks, collections, collectionTracks] = await Promise.all([
        dbManager.getAllTracks(),
        dbManager.getAllCollections(),
        // Get all collection tracks - we'll need to aggregate them
        Promise.resolve([]) as Promise<CollectionTrack[]>
      ]);
      
      set({
        tracks,
        collections,
        collectionTracks,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load from storage:', error);
      set({ isLoading: false });
    }
  },

  syncWithServer: async () => {
    if (!dbManager.isOnline()) return;
    
    try {
      const syncQueue = await dbManager.getSyncQueue();
      
      for (const item of syncQueue) {
        // Process sync queue items
        // This would make actual API calls to sync with server
        console.log('Syncing:', item);
        
        // Remove from queue after successful sync
        await dbManager.removeSyncQueueItem(item.id);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  },

  // Getters
  getCollectionTracks: (collectionId) => {
    const { tracks, collectionTracks } = get();
    
    return collectionTracks
      .filter(ct => ct.collectionId === collectionId)
      .sort((a, b) => a.position - b.position)
      .map(ct => tracks.find(t => t.id === ct.trackId))
      .filter(Boolean) as Track[];
  },

  isTrackInLibrary: (trackId) => {
    const { tracks } = get();
    return tracks.some(t => t.id === trackId);
  },

  isTrackInCollection: (collectionId, trackId) => {
    const { collectionTracks } = get();
    return collectionTracks.some(
      ct => ct.collectionId === collectionId && ct.trackId === trackId
    );
  }
}));

// Set up online/offline event listeners (only in browser)
if (typeof window !== 'undefined') {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    useLibraryStore.setState({ isOnline: true });
    useLibraryStore.getState().syncWithServer();
  });
  
  window.addEventListener('offline', () => {
    useLibraryStore.setState({ isOnline: false });
  });
}

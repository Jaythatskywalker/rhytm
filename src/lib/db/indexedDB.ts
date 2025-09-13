import { Track, Collection, CollectionTrack, FeedbackEvent } from '@/types';

const DB_NAME = 'BeatportCurator';
const DB_VERSION = 1;

// Store names
const TRACKS_STORE = 'tracks';
const COLLECTIONS_STORE = 'collections';
const COLLECTION_TRACKS_STORE = 'collectionTracks';
const FEEDBACK_STORE = 'feedback';
const SYNC_QUEUE_STORE = 'syncQueue';

interface SyncQueueItem {
  id: string;
  type: 'track' | 'collection' | 'feedback';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Tracks store
        if (!db.objectStoreNames.contains(TRACKS_STORE)) {
          const tracksStore = db.createObjectStore(TRACKS_STORE, { keyPath: 'id' });
          tracksStore.createIndex('genre', 'genre', { unique: false });
          tracksStore.createIndex('bpm', 'bpm', { unique: false });
          tracksStore.createIndex('key', 'key', { unique: false });
          tracksStore.createIndex('liked', 'liked', { unique: false });
        }

        // Collections store
        if (!db.objectStoreNames.contains(COLLECTIONS_STORE)) {
          const collectionsStore = db.createObjectStore(COLLECTIONS_STORE, { keyPath: 'id' });
          collectionsStore.createIndex('userId', 'userId', { unique: false });
          collectionsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Collection tracks store
        if (!db.objectStoreNames.contains(COLLECTION_TRACKS_STORE)) {
          const collectionTracksStore = db.createObjectStore(COLLECTION_TRACKS_STORE, { 
            keyPath: ['collectionId', 'trackId'] 
          });
          collectionTracksStore.createIndex('collectionId', 'collectionId', { unique: false });
          collectionTracksStore.createIndex('trackId', 'trackId', { unique: false });
        }

        // Feedback store
        if (!db.objectStoreNames.contains(FEEDBACK_STORE)) {
          const feedbackStore = db.createObjectStore(FEEDBACK_STORE, { 
            keyPath: 'id',
            autoIncrement: true 
          });
          feedbackStore.createIndex('userId', 'userId', { unique: false });
          feedbackStore.createIndex('trackId', 'trackId', { unique: false });
          feedbackStore.createIndex('type', 'type', { unique: false });
          feedbackStore.createIndex('ts', 'ts', { unique: false });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
          const syncQueueStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
          syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Tracks operations
  async saveTracks(tracks: Track[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([TRACKS_STORE], 'readwrite');
    const store = transaction.objectStore(TRACKS_STORE);

    for (const track of tracks) {
      await this.promisifyRequest(store.put(track));
    }
  }

  async getTrack(id: string): Promise<Track | undefined> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([TRACKS_STORE], 'readonly');
    const store = transaction.objectStore(TRACKS_STORE);
    const result = await this.promisifyRequest(store.get(id));
    return result;
  }

  async getAllTracks(): Promise<Track[]> {
    if (typeof window === 'undefined') return [];
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([TRACKS_STORE], 'readonly');
    const store = transaction.objectStore(TRACKS_STORE);
    const result = await this.promisifyRequest(store.getAll());
    return result || [];
  }

  async deleteTrack(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([TRACKS_STORE], 'readwrite');
    const store = transaction.objectStore(TRACKS_STORE);
    await this.promisifyRequest(store.delete(id));
  }

  // Collections operations
  async saveCollection(collection: Collection): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([COLLECTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(COLLECTIONS_STORE);
    await this.promisifyRequest(store.put(collection));
  }

  async getAllCollections(): Promise<Collection[]> {
    if (typeof window === 'undefined') return [];
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([COLLECTIONS_STORE], 'readonly');
    const store = transaction.objectStore(COLLECTIONS_STORE);
    const result = await this.promisifyRequest(store.getAll());
    return result || [];
  }

  async deleteCollection(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([COLLECTIONS_STORE, COLLECTION_TRACKS_STORE], 'readwrite');
    
    // Delete collection
    const collectionsStore = transaction.objectStore(COLLECTIONS_STORE);
    await this.promisifyRequest(collectionsStore.delete(id));
    
    // Delete all collection tracks
    const collectionTracksStore = transaction.objectStore(COLLECTION_TRACKS_STORE);
    const index = collectionTracksStore.index('collectionId');
    const cursor = await this.promisifyRequest(index.openCursor(id));
    
    while (cursor) {
      await this.promisifyRequest(cursor.delete());
      cursor.continue();
    }
  }

  // Collection tracks operations
  async saveCollectionTrack(collectionTrack: CollectionTrack): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([COLLECTION_TRACKS_STORE], 'readwrite');
    const store = transaction.objectStore(COLLECTION_TRACKS_STORE);
    await this.promisifyRequest(store.put(collectionTrack));
  }

  async getCollectionTracks(collectionId: string): Promise<CollectionTrack[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([COLLECTION_TRACKS_STORE], 'readonly');
    const store = transaction.objectStore(COLLECTION_TRACKS_STORE);
    const index = store.index('collectionId');
    const result = await this.promisifyRequest(index.getAll(collectionId));
    return result || [];
  }

  async deleteCollectionTrack(collectionId: string, trackId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([COLLECTION_TRACKS_STORE], 'readwrite');
    const store = transaction.objectStore(COLLECTION_TRACKS_STORE);
    await this.promisifyRequest(store.delete([collectionId, trackId]));
  }

  // Feedback operations
  async saveFeedback(feedback: FeedbackEvent): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([FEEDBACK_STORE], 'readwrite');
    const store = transaction.objectStore(FEEDBACK_STORE);
    await this.promisifyRequest(store.add(feedback));
  }

  async getFeedback(userId: string): Promise<FeedbackEvent[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([FEEDBACK_STORE], 'readonly');
    const store = transaction.objectStore(FEEDBACK_STORE);
    const index = store.index('userId');
    const result = await this.promisifyRequest(index.getAll(userId));
    return result || [];
  }

  // Sync queue operations
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queueItem: SyncQueueItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    const transaction = this.db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    await this.promisifyRequest(store.add(queueItem));
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([SYNC_QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const result = await this.promisifyRequest(store.getAll());
    return result || [];
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    await this.promisifyRequest(store.clear());
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    await this.promisifyRequest(store.delete(id));
  }

  // Utility method to promisify IDB requests
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Check if online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Clear all data
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const storeNames = [
      TRACKS_STORE,
      COLLECTIONS_STORE,
      COLLECTION_TRACKS_STORE,
      FEEDBACK_STORE,
      SYNC_QUEUE_STORE
    ];

    const transaction = this.db.transaction(storeNames, 'readwrite');
    
    for (const storeName of storeNames) {
      const store = transaction.objectStore(storeName);
      await this.promisifyRequest(store.clear());
    }
  }
}

// Singleton instance
export const dbManager = new IndexedDBManager();

// Initialize only when needed and in browser
export const initializeIndexedDB = async () => {
  if (typeof window !== 'undefined' && !dbManager.db) {
    try {
      await dbManager.init();
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }
};

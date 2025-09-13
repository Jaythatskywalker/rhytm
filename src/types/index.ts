// Core Types for Beatport Curator

export type Track = {
  id: string;
  beatportId?: number;
  title: string;
  artists: string[];
  genre: string;
  bpm: number;
  key: string;        // e.g. 8A, 9B
  label?: string;
  releaseDate?: string;  // ISO
  liked: boolean;
  previewUrl?: string;   // if provided by API
  features?: { 
    energy?: number; 
    valence?: number; 
    embed?: number[] 
  }; // optional AI features
};

export type Collection = {
  id: string;
  userId: string;
  name: string;
  tags?: string[];
  updatedAt: string;     // ISO
  syncedAt?: string;     // ISO
  beatportPlaylistId?: string; // if synced
};

export type CollectionTrack = {
  collectionId: string;
  trackId: string;
  position: number;
  notes?: string;
};

// Auth
export type AuthConfig = {
  provider: 'beatport';
  accessToken?: string;
  refreshToken?: string;
  scopes?: string[];
  expiresAt?: string; // ISO
  manualMode: boolean; // true when operating only on user-provided URLs/IDs
};

// AI Profile
export type DjProfile = {
  userId: string;
  seedGenres: string[];
  bpmRange: [number, number];
  preferredKeys: string[];    // e.g. ['8A','9A']
  negativeGenres?: string[];
  artistsLike?: string[];     // e.g. ['Tale of Us','ARTBAT']
  vibeNotes?: string;         // free text, prompts
  preferenceVector?: number[]; // learned embedding
  weights: {
    recency: number;
    novelty: number;
    genreMatch: number;
    bpmMatch: number;
    keyMatch: number;
    artistSimilarity: number;
  };
  updatedAt: string; // ISO
};

// Telemetry (for learning)
export type FeedbackEvent = {
  userId: string;
  trackId: string;
  type: 'like' | 'skip' | 'add_to_library' | 'add_to_collection' | 'play' | 'complete';
  context?: 'discover' | 'collection' | 'search';
  ts: string; // ISO
};

// UI State Types
export type FilterState = {
  genre?: string;
  bpmMin?: number;
  bpmMax?: number;
  key?: string;
  query?: string;
  mood?: string;
  energyLevel?: string;
  hasVocals?: boolean;
  vocalAmount?: string;
};

export type SortState = {
  field: 'title' | 'artists' | 'genre' | 'bpm' | 'key' | 'releaseDate';
  direction: 'asc' | 'desc';
};

export type MiniPlayerState = {
  currentTrack?: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
};

// API Response Types
export type SearchResponse = {
  tracks: Track[];
  total: number;
  page: number;
  hasMore: boolean;
};

export type RecommendationsResponse = {
  tracks: Track[];
  reason?: string;
  explanations?: Record<string, string>; // trackId -> explanation
};

export type SyncStatus = {
  lastSyncAt?: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
  error?: string;
};

// Export Types
export type ExportFormat = 'csv' | 'm3u' | 'json';

export type ExportRequest = {
  collectionId: string;
  format: ExportFormat;
  includeMetadata?: boolean;
};

// Common Enums
export const GENRES = [
  'Techno', 'House', 'Progressive House', 'Tech House', 'Deep House',
  'Melodic Techno', 'Minimal', 'Trance', 'Progressive Trance', 'Psytrance',
  'Drum & Bass', 'Dubstep', 'Breakbeat', 'Electro', 'Ambient'
] as const;

export const KEYS = [
  '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A',
  '1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B'
] as const;

export const MOODS = [
  'Uplifting', 'Dark', 'Melodic', 'Aggressive', 'Chill', 'Euphoric', 
  'Mysterious', 'Groovy', 'Emotional', 'Hypnotic', 'Dreamy', 'Intense'
] as const;

export const ENERGY_LEVELS = [
  'Low', 'Medium-Low', 'Medium', 'Medium-High', 'High', 'Peak Time'
] as const;

export const VOCAL_AMOUNTS = [
  'None', 'Minimal', 'Some', 'Moderate', 'Heavy', 'Vocal-Heavy'
] as const;

export type Genre = typeof GENRES[number];
export type Key = typeof KEYS[number];
export type Mood = typeof MOODS[number];
export type EnergyLevel = typeof ENERGY_LEVELS[number];
export type VocalAmount = typeof VOCAL_AMOUNTS[number];

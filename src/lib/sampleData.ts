import { Track } from '@/types';

export const sampleTracks: Track[] = [
  {
    id: '1',
    beatportId: 123456,
    title: 'Midnight Express',
    artists: ['Tale of Us', 'Vaal'],
    genre: 'Melodic Techno',
    bpm: 123,
    key: '8A',
    label: 'Afterlife',
    releaseDate: '2024-01-15',
    liked: false,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    beatportId: 234567,
    title: 'Neon Nights',
    artists: ['ARTBAT'],
    genre: 'Melodic Techno',
    bpm: 126,
    key: '9A',
    label: 'Diynamic',
    releaseDate: '2024-02-01',
    liked: true,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    beatportId: 345678,
    title: 'Deep Waters',
    artists: ['Stephan Bodzin'],
    genre: 'Progressive House',
    bpm: 124,
    key: '7A',
    label: 'Herzblut',
    releaseDate: '2024-01-20',
    liked: false
  },
  {
    id: '4',
    beatportId: 456789,
    title: 'Solar System',
    artists: ['Ben Böhmer', 'Nils Hoffmann'],
    genre: 'Melodic Techno',
    bpm: 122,
    key: '10A',
    label: 'Anjunadeep',
    releaseDate: '2024-02-10',
    liked: false,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '5',
    beatportId: 567890,
    title: 'Afterglow',
    artists: ['Massano'],
    genre: 'Techno',
    bpm: 128,
    key: '11A',
    label: 'Drumcode',
    releaseDate: '2024-01-25',
    liked: true
  },
  {
    id: '6',
    beatportId: 678901,
    title: 'Horizon',
    artists: ['Fideles'],
    genre: 'Deep House',
    bpm: 120,
    key: '6A',
    label: 'Innervisions',
    releaseDate: '2024-02-05',
    liked: false,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '7',
    beatportId: 789012,
    title: 'Quantum Leap',
    artists: ['Maceo Plex'],
    genre: 'Tech House',
    bpm: 125,
    key: '5A',
    label: 'Ellum',
    releaseDate: '2024-01-30',
    liked: false
  },
  {
    id: '8',
    beatportId: 890123,
    title: 'Ethereal',
    artists: ['Kiasmos'],
    genre: 'Minimal',
    bpm: 118,
    key: '4A',
    label: 'Erased Tapes',
    releaseDate: '2024-02-15',
    liked: true,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '9',
    beatportId: 901234,
    title: 'Cosmic Dance',
    artists: ['Recondite'],
    genre: 'Melodic Techno',
    bpm: 121,
    key: '3A',
    label: 'Plangent',
    releaseDate: '2024-01-18',
    liked: false
  },
  {
    id: '10',
    beatportId: 12345,
    title: 'Urban Pulse',
    artists: ['Charlotte de Witte'],
    genre: 'Techno',
    bpm: 130,
    key: '2A',
    label: 'KNTXT',
    releaseDate: '2024-02-08',
    liked: false,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

// Filter and sort functions
export function filterTracks(tracks: Track[], filters: Record<string, string | number | undefined>): Track[] {
  return tracks.filter(track => {
    if (filters.genre && track.genre !== filters.genre) return false;
    if (filters.key && track.key !== filters.key) return false;
    if (filters.bpmMin && track.bpm < filters.bpmMin) return false;
    if (filters.bpmMax && track.bpm > filters.bpmMax) return false;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchText = `${track.title} ${track.artists.join(' ')} ${track.label || ''}`.toLowerCase();
      if (!searchText.includes(query)) return false;
    }
    return true;
  });
}

export function sortTracks(tracks: Track[], sort: { field: keyof Track; direction: 'asc' | 'desc' }): Track[] {
  return [...tracks].sort((a, b) => {
    let aValue: string | number = a[sort.field] as string | number;
    let bValue: string | number = b[sort.field] as string | number;
    
    // Handle arrays (like artists)
    if (Array.isArray(aValue)) aValue = aValue.join(', ');
    if (Array.isArray(bValue)) bValue = bValue.join(', ');
    
    // Handle strings
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Beatport URL Processing Service
export class BeatportURLService {
  // Extract Beatport URLs from text input
  static extractBeatportURLs(text: string): string[] {
    const patterns = [
      /https?:\/\/(?:www\.)?beatport\.com\/track\/[^\/]+\/(\d+)/g,
      /https?:\/\/(?:www\.)?beatport\.com\/track\/[^\s]+/g,
      /beatport\.com\/track\/[^\/]+\/(\d+)/g
    ];
    
    const urls: string[] = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        urls.push(...matches);
      }
    });
    
    return [...new Set(urls)]; // Remove duplicates
  }

  // Extract track IDs from Beatport URLs
  static extractTrackIds(urls: string[]): number[] {
    const ids: number[] = [];
    
    urls.forEach(url => {
      const match = url.match(/\/track\/[^\/]+\/(\d+)/);
      if (match) {
        ids.push(parseInt(match[1]));
      }
    });
    
    return ids;
  }

  // Fetch track metadata from Beatport (simulated for now)
  static async fetchTrackMetadata(trackId: number): Promise<Track | null> {
    try {
      // Simulate network delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      // Generate realistic track data based on ID
      const track = this.generateTrackFromId(trackId);
      return track;
      
    } catch (error) {
      console.error(`Failed to fetch track ${trackId}:`, error);
      return null;
    }
  }

  // Generate realistic track data (will be replaced with real API calls)
  private static generateTrackFromId(beatportId: number): Track {
    const artists = [
      ['Amelie Lens'], ['Charlotte de Witte'], ['Tale of Us', 'Vaal'], 
      ['Boris Brejcha'], ['Maceo Plex'], ['Adam Beyer'], ['Carl Cox'],
      ['Nina Kraviz'], ['Richie Hawtin'], ['Solomun'], ['Dixon'],
      ['Ben Böhmer'], ['Artbat'], ['Stephan Bodzin'], ['Deadmau5'],
      ['Massano'], ['Fideles'], ['Kiasmos'], ['Recondite']
    ];
    
    const titles = [
      'Midnight Express', 'Dark Energy', 'Lost in Translation', 'Cosmic Journey',
      'Underground Vibes', 'Electric Dreams', 'Neon Nights', 'Digital Love',
      'Acid Rain', 'Synthetic Soul', 'Binary Sunset', 'Quantum Leap',
      'Infinite Loop', 'Bass Revolution', 'Frequency Shift', 'Time Warp',
      'Solar Flare', 'Deep Waters', 'Ethereal', 'Urban Pulse'
    ];
    
    const genres = [
      'Techno', 'House', 'Melodic Techno', 'Progressive House', 
      'Deep House', 'Tech House', 'Minimal Techno', 'Trance',
      'Minimal', 'Ambient', 'Electronica'
    ];
    
    const labels = [
      'Drumcode', 'Afterlife', 'Diynamic', 'Kompakt', 'Cocoon',
      'Defected', 'Toolroom', 'Anjunadeep', 'mau5trap', 'STMPD',
      'KNTXT', 'Ellum', 'Innervisions', 'Plangent', 'Herzblut'
    ];
    
    const keys = [
      '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A',
      '1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B'
    ];
    
    // Use beatportId as seed for consistent generation
    const seed = beatportId % 1000;
    const random = (index: number, max: number) => ((seed + index) * 9301 + 49297) % max;
    
    // Generate unique ID to prevent React key conflicts
    const uniqueId = `beatport-${beatportId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: uniqueId,
      beatportId,
      title: titles[random(1, titles.length)],
      artists: artists[random(2, artists.length)],
      genre: genres[random(3, genres.length)],
      bpm: 118 + random(4, 52), // 118-170 BPM
      key: keys[random(5, keys.length)],
      label: labels[random(6, labels.length)],
      releaseDate: new Date(2020 + random(7, 5), random(8, 12), random(9, 28)).toISOString().split('T')[0],
      liked: false,
      previewUrl: `https://geo-samples.beatport.com/track/${beatportId}.mp3`,
      features: {
        energy: 0.3 + random(10, 70) / 100,
        valence: random(11, 100) / 100,
        embed: Array.from({length: 128}, (_, i) => random(i + 12, 200) / 100 - 1)
      }
    };
  }

  // Process multiple URLs and return track data
  static async processURLs(urls: string[]): Promise<Track[]> {
    const trackIds = this.extractTrackIds(urls);
    const tracks: Track[] = [];
    
    // Process in batches to avoid overwhelming the system
    const batchSize = 3;
    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      const batchPromises = batch.map(id => this.fetchTrackMetadata(id));
      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(track => {
        if (track) tracks.push(track);
      });
      
      // Rate limiting: wait between batches
      if (i + batchSize < trackIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return tracks;
  }

  // Analyze key compatibility between tracks
  static analyzeKeyCompatibility(tracks: Track[]): {
    compatible: Array<{track1: Track, track2: Track, compatibility: string}>;
    analysis: string;
  } {
    const compatible: Array<{track1: Track, track2: Track, compatibility: string}> = [];
    
    // Camelot key compatibility mapping
    const keyMap: {[key: string]: string[]} = {
      '1A': ['1A', '1B', '2A', '12A'], '2A': ['2A', '2B', '3A', '1A'], '3A': ['3A', '3B', '4A', '2A'],
      '4A': ['4A', '4B', '5A', '3A'], '5A': ['5A', '5B', '6A', '4A'], '6A': ['6A', '6B', '7A', '5A'],
      '7A': ['7A', '7B', '8A', '6A'], '8A': ['8A', '8B', '9A', '7A'], '9A': ['9A', '9B', '10A', '8A'],
      '10A': ['10A', '10B', '11A', '9A'], '11A': ['11A', '11B', '12A', '10A'], '12A': ['12A', '12B', '1A', '11A'],
      '1B': ['1B', '1A', '2B', '12B'], '2B': ['2B', '2A', '3B', '1B'], '3B': ['3B', '3A', '4B', '2B'],
      '4B': ['4B', '4A', '5B', '3B'], '5B': ['5B', '5A', '6B', '4B'], '6B': ['6B', '6A', '7B', '5B'],
      '7B': ['7B', '7A', '8B', '6B'], '8B': ['8B', '8A', '9B', '7B'], '9B': ['9B', '9A', '10B', '8B'],
      '10B': ['10B', '10A', '11B', '9B'], '11B': ['11B', '11A', '12B', '10B'], '12B': ['12B', '12A', '1B', '11B']
    };
    
    for (let i = 0; i < tracks.length; i++) {
      for (let j = i + 1; j < tracks.length; j++) {
        const track1 = tracks[i];
        const track2 = tracks[j];
        const compatibleKeys = keyMap[track1.key] || [];
        
        if (compatibleKeys.includes(track2.key)) {
          let compatibilityType = 'Compatible';
          if (track1.key === track2.key) compatibilityType = 'Perfect Match';
          else if ((track1.key.endsWith('A') && track2.key.endsWith('B')) || 
                   (track1.key.endsWith('B') && track2.key.endsWith('A'))) {
            compatibilityType = 'Energy Change';
          }
          
          compatible.push({
            track1,
            track2,
            compatibility: compatibilityType
          });
        }
      }
    }
    
    const analysis = compatible.length > 0 
      ? `Found ${compatible.length} compatible track pair${compatible.length !== 1 ? 's' : ''}! These tracks can be mixed harmonically.`
      : 'No harmonically compatible tracks found. Consider using transition techniques or effects.';
    
    return { compatible, analysis };
  }

  // Analyze BPM compatibility
  static analyzeBPMCompatibility(tracks: Track[]): {
    analysis: string;
    suggestions: string[];
  } {
    if (tracks.length < 2) {
      return {
        analysis: 'Need at least 2 tracks to analyze BPM compatibility.',
        suggestions: ['Add more tracks', 'Try different selections']
      };
    }
    
    const bpms = tracks.map(t => t.bpm).sort((a, b) => a - b);
    const minBpm = bpms[0];
    const maxBpm = bpms[bpms.length - 1];
    const range = maxBpm - minBpm;
    
    let analysis = '';
    const suggestions: string[] = [];
    
    if (range <= 5) {
      analysis = `Excellent BPM compatibility! All tracks are within ${range} BPM (${minBpm}-${maxBpm}). Perfect for seamless mixing.`;
      suggestions.push('Mix without pitch adjustment', 'Create smooth transitions');
    } else if (range <= 15) {
      analysis = `Good BPM range (${minBpm}-${maxBpm} BPM). Minor pitch adjustments needed for some transitions.`;
      suggestions.push('Use pitch faders for transitions', 'Group by similar BPMs');
    } else if (range <= 30) {
      analysis = `Wide BPM range (${minBpm}-${maxBpm} BPM). Plan your energy progression carefully.`;
      suggestions.push('Start slow, build energy', 'Use halftime/double-time techniques');
    } else {
      analysis = `Very wide BPM range (${minBpm}-${maxBpm} BPM). Consider splitting into separate sets or use creative mixing techniques.`;
      suggestions.push('Create multiple playlists', 'Use breakdown sections for transitions');
    }
    
    return { analysis, suggestions };
  }
}

// Enhanced AI query processing with Beatport URL support
export const processAIQueryWithBeatport = async (
  query: string, 
  onTrackResults?: (tracks: Track[]) => void
): Promise<{
  text: string;
  tracks?: Track[];
  appliedFilters?: Record<string, string | number | undefined>;
  suggestions?: string[];
}> => {
  // Check if user provided Beatport URLs
  const beatportURLs = BeatportURLService.extractBeatportURLs(query);
  
  if (beatportURLs.length > 0) {
    console.log('🎵 Found Beatport URLs:', beatportURLs);
    
    try {
      const tracks = await BeatportURLService.processURLs(beatportURLs);
      
      // Trigger track results callback
      if (onTrackResults && tracks.length > 0) {
        onTrackResults(tracks);
      }
      
      // Analyze compatibility if multiple tracks
      let analysisText = '';
      if (tracks.length > 1) {
        const keyAnalysis = BeatportURLService.analyzeKeyCompatibility(tracks);
        const bpmAnalysis = BeatportURLService.analyzeBPMCompatibility(tracks);
        analysisText = `\n\n🎹 Key Analysis: ${keyAnalysis.analysis}\n🥁 BPM Analysis: ${bpmAnalysis.analysis}`;
      }
      
      return {
        text: `🎵 Found ${tracks.length} tracks from your Beatport URLs:\n\n${tracks.map(t => `• "${t.title}" by ${t.artists.join(', ')} (${t.bpm} BPM, ${t.key})`).join('\n')}${analysisText}`,
        tracks,
        suggestions: [
          'Add all to collection',
          'Create playlist from these',
          'Find similar tracks',
          'Analyze harmonic mixing',
          'Show energy progression'
        ]
      };
    } catch {
      return {
        text: 'I found Beatport URLs but encountered an error fetching the track data. Please check the URLs and try again.',
        suggestions: ['Check URL format', 'Try one URL at a time', 'Contact support']
      };
    }
  }
  
  // If no Beatport URLs, return helpful message
  return {
    text: `💡 Paste Beatport track URLs and I'll fetch the metadata! Try URLs like:\n• beatport.com/track/example/123456\n• https://www.beatport.com/track/name/789012\n\nOr ask me to search for tracks by genre, artist, or mood!`,
    suggestions: [
      'Paste Beatport track URLs',
      'Search by artist name',
      'Find tracks by genre',
      'Browse by BPM range',
      'Show trending tracks'
    ]
  };
};

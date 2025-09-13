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
export function filterTracks(tracks: Track[], filters: any): Track[] {
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

export function sortTracks(tracks: Track[], sort: any): Track[] {
  return [...tracks].sort((a, b) => {
    let aValue: any = a[sort.field as keyof Track];
    let bValue: any = b[sort.field as keyof Track];
    
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

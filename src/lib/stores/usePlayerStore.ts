import { create } from 'zustand';
import { Track, MiniPlayerState } from '@/types';

interface PlayerStore extends MiniPlayerState {
  // Actions
  setCurrentTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  togglePlayPause: () => void;
  
  // Audio element ref
  audioRef: HTMLAudioElement | null;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // State
  currentTrack: undefined,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  audioRef: null,

  // Actions
  setCurrentTrack: (track) => {
    const { audioRef, pause } = get();
    
    // Pause current track if playing
    if (audioRef && !audioRef.paused) {
      pause();
    }
    
    set({ 
      currentTrack: track, 
      currentTime: 0,
      duration: 0
    });
    
    // Load new track if preview URL exists
    if (audioRef && track.previewUrl) {
      audioRef.src = track.previewUrl;
      audioRef.load();
    }
  },

  play: () => {
    const { audioRef, currentTrack } = get();
    
    if (!audioRef || !currentTrack?.previewUrl) {
      return;
    }
    
    audioRef.play().catch(console.error);
    set({ isPlaying: true });
  },

  pause: () => {
    const { audioRef } = get();
    
    if (audioRef) {
      audioRef.pause();
    }
    
    set({ isPlaying: false });
  },

  stop: () => {
    const { audioRef } = get();
    
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    
    set({ 
      isPlaying: false, 
      currentTime: 0 
    });
  },

  togglePlayPause: () => {
    const { isPlaying, play, pause } = get();
    
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => {
    const { audioRef } = get();
    
    if (audioRef) {
      audioRef.volume = volume;
    }
    
    set({ volume });
  },

  setAudioRef: (ref) => {
    const { volume } = get();
    
    if (ref) {
      ref.volume = volume;
      
      // Set up event listeners
      ref.addEventListener('loadedmetadata', () => {
        set({ duration: ref.duration });
      });
      
      ref.addEventListener('timeupdate', () => {
        set({ currentTime: ref.currentTime });
      });
      
      ref.addEventListener('ended', () => {
        set({ 
          isPlaying: false, 
          currentTime: 0 
        });
      });
      
      ref.addEventListener('loadstart', () => {
        set({ currentTime: 0, duration: 0 });
      });
      
      ref.addEventListener('canplay', () => {
        // Audio is ready to play
      });
      
      ref.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        set({ isPlaying: false });
      });
      
      ref.addEventListener('waiting', () => {
        // Audio is buffering
      });
      
      ref.addEventListener('playing', () => {
        set({ isPlaying: true });
      });
      
      ref.addEventListener('pause', () => {
        set({ isPlaying: false });
      });
    }
    
    set({ audioRef: ref });
  }
}));

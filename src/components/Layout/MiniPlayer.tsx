'use client';

import { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Square } from 'lucide-react';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';

export function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    stop,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    setAudioRef
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <>
      <audio ref={audioRef} />
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 py-3">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentTrack.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {currentTrack.artists.join(', ')}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                disabled={!currentTrack.previewUrl}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                onClick={stop}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Square size={20} />
              </button>
              
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Progress and Volume */}
            <div className="flex items-center space-x-4 flex-1 min-w-0 justify-end">
              <div className="flex items-center space-x-2 min-w-0 flex-1 max-w-xs">
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={!currentTrack.previewUrl}
                />
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">🔊</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

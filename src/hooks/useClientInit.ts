import { useEffect } from 'react';
import { useLibraryStore } from '@/lib/stores/useLibraryStore';

export function useClientInit() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Initialize the library store
      useLibraryStore.getState().loadFromStorage();
    }
  }, []);
}

import { create } from 'zustand';
import { FilterState, SortState } from '@/types';

interface FiltersStore {
  filters: FilterState;
  sort: SortState;
  
  // Actions
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  setSort: (field: SortState['field']) => void;
  setSortDirection: (direction: SortState['direction']) => void;
}

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  // State
  filters: {},
  sort: {
    field: 'title',
    direction: 'asc'
  },

  // Actions
  setFilter: (key, value) => {
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setSort: (field) => {
    const { sort } = get();
    
    // Toggle direction if same field, otherwise default to asc
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    
    set({
      sort: { field, direction }
    });
  },

  setSortDirection: (direction) => {
    set(state => ({
      sort: {
        ...state.sort,
        direction
      }
    }));
  }
}));

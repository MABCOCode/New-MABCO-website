const COMPARE_STORAGE_KEY = 'mabco_compare_items';

export const compareStorage = {
  // Save compare items to localStorage
  saveItems: (items: number[]): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save compare items:', error);
      }
    }
  },

  // Load compare items from localStorage
  loadItems: (): number[] => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Failed to load compare items:', error);
        return [];
      }
    }
    return [];
  },

  // Clear compare items from localStorage
  clearItems: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COMPARE_STORAGE_KEY);
    }
  },
};
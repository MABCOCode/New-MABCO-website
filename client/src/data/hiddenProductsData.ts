// Hidden products management
// This file manages which products are hidden from the public website
// Only admins with proper privileges can hide/show products

export interface HiddenProductsData {
  hiddenProductIds: Set<string>;
  lastUpdated: string;
}

// In-memory storage for hidden products (in production, this would be in a database)
let hiddenProductIds = new Set<string>();

export const hiddenProductsManager = {
  // Get all hidden product IDs
  getHiddenProducts: (): string[] => {
    return Array.from(hiddenProductIds);
  },

  // Check if a product is hidden
  isProductHidden: (productId: string): boolean => {
    return hiddenProductIds.has(String(productId));
  },

  // Hide a product
  hideProduct: (productId: string): void => {
    hiddenProductIds.add(String(productId));
  },

  // Show a product (unhide)
  showProduct: (productId: string): void => {
    hiddenProductIds.delete(String(productId));
  },

  // Toggle product visibility
  toggleProductVisibility: (productId: string): boolean => {
    const key = String(productId);
    if (hiddenProductIds.has(key)) {
      hiddenProductIds.delete(key);
      return false; // Now visible
    } else {
      hiddenProductIds.add(key);
      return true; // Now hidden
    }
  },

  // Get hidden products count
  getHiddenCount: (): number => {
    return hiddenProductIds.size;
  },

  // Clear all hidden products (admin function)
  clearAllHidden: (): void => {
    hiddenProductIds.clear();
  },

  // Load hidden products from storage (for persistence)
  loadFromStorage: (): void => {
    try {
      const stored = localStorage.getItem('hiddenProducts');
      if (stored) {
        const ids = JSON.parse(stored);
        hiddenProductIds = new Set(ids);
      }
    } catch (error) {
      console.error('Error loading hidden products:', error);
    }
  },

  // Save hidden products to storage
  saveToStorage: (): void => {
    try {
      const ids = Array.from(hiddenProductIds);
      localStorage.setItem('hiddenProducts', JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving hidden products:', error);
    }
  },
};

// Initialize from storage on module load
if (typeof window !== 'undefined') {
  hiddenProductsManager.loadFromStorage();
}

export default hiddenProductsManager;

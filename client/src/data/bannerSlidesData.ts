export interface BannerSlide {
  id: number;
  image: string;
  url?: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  buttonTextEn: string;
  buttonTextAr: string;
  order: number;
  isActive: boolean;
}

// Default banner slides data
let bannerSlides: BannerSlide[] = [
  
];

// Manager functions
class BannerSlidesManager {
  private storageKey = "mabco_banner_slides";

  // Get all active slides sorted by order
  getActiveSlides(): BannerSlide[] {
    this.loadFromStorage();
    return bannerSlides
      .filter(slide => slide.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // Get all slides (including inactive)
  getAllSlides(): BannerSlide[] {
    this.loadFromStorage();
    return [...bannerSlides].sort((a, b) => a.order - b.order);
  }

  // Get slide by ID
  getSlideById(id: number): BannerSlide | undefined {
    this.loadFromStorage();
    return bannerSlides.find(slide => slide.id === id);
  }

  // Add new slide
  addSlide(slide: Omit<BannerSlide, "id">): BannerSlide {
    this.loadFromStorage();
    const newId = Math.max(0, ...bannerSlides.map(s => s.id)) + 1;
    const newSlide: BannerSlide = {
      ...slide,
      id: newId,
    };
    bannerSlides.push(newSlide);
    this.saveToStorage();
    return newSlide;
  }

  // Update slide
  updateSlide(id: number, updates: Partial<BannerSlide>): boolean {
    this.loadFromStorage();
    const index = bannerSlides.findIndex(slide => slide.id === id);
    if (index === -1) return false;

    bannerSlides[index] = {
      ...bannerSlides[index],
      ...updates,
      id: bannerSlides[index].id, // Preserve ID
    };
    this.saveToStorage();
    return true;
  }

  // Delete slide
  deleteSlide(id: number): boolean {
    this.loadFromStorage();
    const index = bannerSlides.findIndex(slide => slide.id === id);
    if (index === -1) return false;

    bannerSlides.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Reorder slides
  reorderSlides(slideIds: number[]): void {
    this.loadFromStorage();
    slideIds.forEach((id, index) => {
      const slide = bannerSlides.find(s => s.id === id);
      if (slide) {
        slide.order = index + 1;
      }
    });
    this.saveToStorage();
  }

  // Toggle slide active status
  toggleSlideActive(id: number): boolean {
    this.loadFromStorage();
    const slide = bannerSlides.find(s => s.id === id);
    if (!slide) return false;

    slide.isActive = !slide.isActive;
    this.saveToStorage();
    return slide.isActive;
  }

  // Private: Load from localStorage
  private loadFromStorage(): void {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        bannerSlides = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse banner slides from storage", e);
      }
    }
  }

  // Private: Save to localStorage
  private saveToStorage(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(bannerSlides));
    } catch (e) {
      console.error("Failed to save banner slides to storage", e);
    }
  }
}

// Export singleton instance
const bannerSlidesManager = new BannerSlidesManager();
export default bannerSlidesManager;

// Export the data array for backward compatibility
export { bannerSlides };


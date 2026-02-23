// Saved specification titles for autocomplete
// This helps prevent duplicate spec titles and maintains consistency

export interface SavedSpecTitle {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  usageCount: number;
  category?: string;
}

// In-memory storage for saved spec titles (in production, this would be in a database)
let savedSpecTitles: SavedSpecTitle[] = [
  // Pre-populated common specs
  { id: "processor", nameEn: "Processor", nameAr: "المعالج", icon: "Cpu", usageCount: 50, category: "performance" },
  { id: "ram", nameEn: "RAM", nameAr: "الذاكرة العشوائية", icon: "MemoryStick", usageCount: 48, category: "performance" },
  { id: "storage", nameEn: "Storage", nameAr: "التخزين", icon: "HardDrive", usageCount: 47, category: "storage" },
  { id: "display", nameEn: "Display", nameAr: "الشاشة", icon: "Monitor", usageCount: 45, category: "display" },
  { id: "camera", nameEn: "Camera", nameAr: "الكاميرا", icon: "Camera", usageCount: 42, category: "camera" },
  { id: "battery", nameEn: "Battery", nameAr: "البطارية", icon: "Battery", usageCount: 40, category: "battery" },
  { id: "charging", nameEn: "Charging", nameAr: "الشحن", icon: "Zap", usageCount: 38, category: "charging" },
  { id: "connectivity", nameEn: "Connectivity", nameAr: "الاتصال", icon: "Wifi", usageCount: 35, category: "connectivity" },
  { id: "audio", nameEn: "Audio", nameAr: "الصوت", icon: "Speaker", usageCount: 30, category: "audio" },
  { id: "protection", nameEn: "Protection", nameAr: "الحماية", icon: "Shield", usageCount: 28, category: "protection" },
  { id: "os", nameEn: "Operating System", nameAr: "نظام التشغيل", icon: "Smartphone", usageCount: 25, category: "software" },
  { id: "weight", nameEn: "Weight", nameAr: "الوزن", icon: "Package", usageCount: 22, category: "physical" },
  { id: "dimensions", nameEn: "Dimensions", nameAr: "الأبعاد", icon: "Package", usageCount: 20, category: "physical" },
  { id: "gpu", nameEn: "Graphics", nameAr: "معالج الرسوميات", icon: "Monitor", usageCount: 18, category: "performance" },
  { id: "refresh-rate", nameEn: "Refresh Rate", nameAr: "معدل التحديث", icon: "Monitor", usageCount: 15, category: "display" },
];

export const savedSpecTitlesManager = {
  // Get all saved spec titles
  getAllTitles: (): SavedSpecTitle[] => {
    return [...savedSpecTitles].sort((a, b) => b.usageCount - a.usageCount);
  },

  // Search spec titles by query
  searchTitles: (query: string, language: "ar" | "en"): SavedSpecTitle[] => {
    const lowerQuery = query.toLowerCase();
    return savedSpecTitles
      .filter(spec => {
        const searchIn = language === "ar" 
          ? spec.nameAr.toLowerCase() 
          : spec.nameEn.toLowerCase();
        return searchIn.includes(lowerQuery);
      })
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10); // Return top 10 matches
  },

  // Add or update a spec title
  addOrUpdateTitle: (nameEn: string, nameAr: string, icon: string, category?: string): SavedSpecTitle => {
    // Check if exists
    const existing = savedSpecTitles.find(
      spec => spec.nameEn.toLowerCase() === nameEn.toLowerCase()
    );

    if (existing) {
      // Increment usage count
      existing.usageCount++;
      savedSpecTitlesManager.saveToStorage();
      return existing;
    }

    // Create new
    const newSpec: SavedSpecTitle = {
      id: `spec-${Date.now()}`,
      nameEn,
      nameAr,
      icon,
      usageCount: 1,
      category,
    };

    savedSpecTitles.push(newSpec);
    savedSpecTitlesManager.saveToStorage();
    return newSpec;
  },

  // Get spec by ID
  getTitleById: (id: string): SavedSpecTitle | undefined => {
    return savedSpecTitles.find(spec => spec.id === id);
  },

  // Increment usage count
  incrementUsage: (id: string): void => {
    const spec = savedSpecTitles.find(s => s.id === id);
    if (spec) {
      spec.usageCount++;
      savedSpecTitlesManager.saveToStorage();
    }
  },

  // Delete a spec title (admin only)
  deleteTitle: (id: string): boolean => {
    const index = savedSpecTitles.findIndex(spec => spec.id === id);
    if (index !== -1) {
      savedSpecTitles.splice(index, 1);
      savedSpecTitlesManager.saveToStorage();
      return true;
    }
    return false;
  },

  // Get most used titles
  getMostUsed: (limit: number = 5): SavedSpecTitle[] => {
    return [...savedSpecTitles]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  },

  // Load from storage
  loadFromStorage: (): void => {
    try {
      const stored = localStorage.getItem('savedSpecTitles');
      if (stored) {
        savedSpecTitles = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading saved spec titles:', error);
    }
  },

  // Save to storage
  saveToStorage: (): void => {
    try {
      localStorage.setItem('savedSpecTitles', JSON.stringify(savedSpecTitles));
    } catch (error) {
      console.error('Error saving spec titles:', error);
    }
  },
};

// Initialize from storage on module load
if (typeof window !== 'undefined') {
  savedSpecTitlesManager.loadFromStorage();
}

export default savedSpecTitlesManager;

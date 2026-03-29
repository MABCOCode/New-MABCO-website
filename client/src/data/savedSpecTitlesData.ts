export interface SavedSpecTitle {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  iconImage?: string;
  usageCount: number;
  category?: string;
  status?: {
    isActive?: boolean;
  };
  audit?: {
    createdAt?: string;
    updatedAt?: string;
  };
}

const RAW_API_BASE = (import.meta as any).env?.VITE_API_BASE_URL;
const NORMALIZED_BASE =
  RAW_API_BASE &&
  String(RAW_API_BASE).trim() &&
  String(RAW_API_BASE).trim() !== "undefined"
    ? String(RAW_API_BASE).trim()
    : "";
const API_BASE = NORMALIZED_BASE || "http://localhost:5000/api";
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

const buildApiUrl = (path: string) => {
  if (API_BASE.startsWith("/")) return `${API_BASE}${path}`;
  if (API_BASE.endsWith("/api")) return `${API_BASE}${path}`;
  if (API_BASE.endsWith("/api/")) return `${API_BASE}${path.replace(/^\/+/, "")}`;
  return `${API_BASE.replace(/\/+$/, "")}/api${path}`;
};

const DEFAULT_SAVED_SPEC_TITLES: SavedSpecTitle[] = [
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

let savedSpecTitles: SavedSpecTitle[] = [...DEFAULT_SAVED_SPEC_TITLES];
let hasLoadedFromApi = false;
let loadingPromise: Promise<SavedSpecTitle[]> | null = null;
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Error notifying saved spec title listener:", error);
    }
  });
};

const sortTitles = (titles: SavedSpecTitle[]) =>
  [...titles].sort((a, b) => {
    const usageDelta = Number(b.usageCount || 0) - Number(a.usageCount || 0);
    if (usageDelta !== 0) return usageDelta;
    return String(a.nameEn || "").localeCompare(String(b.nameEn || ""));
  });

const normalizeSpecTitle = (raw: any): SavedSpecTitle => ({
  id: String(raw?.id || raw?._id || raw?.nameEnNormalized || `spec-${Date.now()}`),
  nameEn: String(raw?.nameEn || raw?.name?.en || ""),
  nameAr: String(raw?.nameAr || raw?.name?.ar || ""),
  icon: String(raw?.icon || ""),
  iconImage: String(raw?.iconImage || "").trim() || undefined,
  usageCount: Number(raw?.usageCount || 0),
  category: raw?.category ? String(raw.category) : undefined,
  status: raw?.status,
  audit: raw?.audit,
});

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (ADMIN_API_KEY) {
    headers.set("x-admin-key", ADMIN_API_KEY);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(buildApiUrl(path), {
    ...options,
    headers,
  });

  if (!res.ok) {
    const rawText = await res.text().catch(() => "");
    throw new Error(rawText || `Request failed with status ${res.status}`);
  }

  const json = await res.json();
  return (json?.data ?? []) as T;
}

export const savedSpecTitlesManager = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async initialize(force = false): Promise<SavedSpecTitle[]> {
    if (hasLoadedFromApi && !force) {
      return sortTitles(savedSpecTitles);
    }
    if (loadingPromise && !force) {
      return loadingPromise;
    }

    loadingPromise = requestJson<any[]>("/admin/saved-spec-titles")
      .then((items) => {
        const normalized = Array.isArray(items)
          ? items.map(normalizeSpecTitle).filter((item) => item.nameEn || item.iconImage)
          : [];
        savedSpecTitles = normalized.length > 0 ? normalized : [...DEFAULT_SAVED_SPEC_TITLES];
        hasLoadedFromApi = true;
        notifyListeners();
        return sortTitles(savedSpecTitles);
      })
      .catch((error) => {
        console.error("Error loading saved spec titles:", error);
        hasLoadedFromApi = true;
        notifyListeners();
        return sortTitles(savedSpecTitles);
      })
      .finally(() => {
        loadingPromise = null;
      });

    return loadingPromise;
  },

  getAllTitles(): SavedSpecTitle[] {
    return sortTitles(savedSpecTitles);
  },

  searchTitles(query: string, language: "ar" | "en"): SavedSpecTitle[] {
    const lowerQuery = String(query || "").toLowerCase().trim();
    if (!lowerQuery) return sortTitles(savedSpecTitles).slice(0, 10);
    return sortTitles(savedSpecTitles)
      .filter((spec) => {
        const searchIn = language === "ar"
          ? String(spec.nameAr || "").toLowerCase()
          : String(spec.nameEn || "").toLowerCase();
        return searchIn.includes(lowerQuery);
      })
      .slice(0, 10);
  },

  async addOrUpdateTitle(
    nameEn: string,
    nameAr: string,
    icon: string,
    iconImage?: string,
    category?: string,
  ): Promise<SavedSpecTitle | null> {
    const normalizedNameEn = String(nameEn || "").trim();
    const normalizedNameAr = String(nameAr || "").trim();
    const normalizedIconImage = String(iconImage || "").trim();

    if (!normalizedNameEn || !normalizedNameAr) {
      return null;
    }

    const item = await requestJson<any>("/admin/saved-spec-titles", {
      method: "POST",
      body: JSON.stringify({
        nameEn: normalizedNameEn,
        nameAr: normalizedNameAr,
        icon: String(icon || "").trim(),
        iconImage: normalizedIconImage,
        category: category ? String(category).trim() : undefined,
      }),
    });

    const normalized = normalizeSpecTitle(item);
    const existingIndex = savedSpecTitles.findIndex((spec) => spec.id === normalized.id);
    if (existingIndex >= 0) {
      savedSpecTitles[existingIndex] = normalized;
    } else {
      savedSpecTitles.push(normalized);
    }
    notifyListeners();
    return normalized;
  },

  getTitleById(id: string): SavedSpecTitle | undefined {
    return savedSpecTitles.find((spec) => spec.id === id);
  },

  async incrementUsage(id: string): Promise<void> {
    if (!id) return;
    try {
      const item = await requestJson<any>(`/admin/saved-spec-titles/${encodeURIComponent(id)}/usage`, {
        method: "POST",
      });
      const normalized = normalizeSpecTitle(item);
      const existingIndex = savedSpecTitles.findIndex((spec) => spec.id === normalized.id);
      if (existingIndex >= 0) {
        savedSpecTitles[existingIndex] = normalized;
      } else {
        savedSpecTitles.push(normalized);
      }
      notifyListeners();
    } catch (error) {
      console.error("Error incrementing saved spec title usage:", error);
    }
  },

  async deleteTitle(id: string): Promise<boolean> {
    if (!id) return false;
    try {
      await requestJson<any>(`/admin/saved-spec-titles/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      savedSpecTitles = savedSpecTitles.filter((spec) => spec.id !== id);
      notifyListeners();
      return true;
    } catch (error) {
      console.error("Error deleting saved spec title:", error);
      return false;
    }
  },

  getMostUsed(limit = 5): SavedSpecTitle[] {
    return sortTitles(savedSpecTitles).slice(0, limit);
  },

  getCustomIcons(): SavedSpecTitle[] {
    return sortTitles(savedSpecTitles).filter((spec) => Boolean(String(spec.iconImage || "").trim()));
  },

  async addCustomIcon(iconImage: string): Promise<SavedSpecTitle | null> {
    const normalized = String(iconImage || "").trim();
    if (!normalized) return null;

    const item = await requestJson<any>("/admin/saved-spec-titles/custom-icon", {
      method: "POST",
      body: JSON.stringify({ iconImage: normalized }),
    });

    const normalizedItem = normalizeSpecTitle(item);
    const existingIndex = savedSpecTitles.findIndex((spec) => spec.id === normalizedItem.id);
    if (existingIndex >= 0) {
      savedSpecTitles[existingIndex] = normalizedItem;
    } else {
      savedSpecTitles.push(normalizedItem);
    }
    notifyListeners();
    return normalizedItem;
  },
};

export default savedSpecTitlesManager;

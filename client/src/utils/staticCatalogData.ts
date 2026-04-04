type StaticCatalogData = {
  categories: any[];
  brands: any[];
};

let staticCatalogCache: StaticCatalogData | null = null;
let staticCatalogPromise: Promise<StaticCatalogData> | null = null;

const normalizeArray = (value: unknown) => (Array.isArray(value) ? value : []);

export const getCachedStaticCatalogData = (): StaticCatalogData | null => staticCatalogCache;

export const loadStaticCatalogData = async (): Promise<StaticCatalogData> => {
  if (staticCatalogCache) return staticCatalogCache;
  if (staticCatalogPromise) return staticCatalogPromise;

  staticCatalogPromise = (async () => {
    const [categoriesRes, brandsRes] = await Promise.all([
      fetch("/static/categories.json"),
      fetch("/static/brands.json"),
    ]);

    const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : [];
    const brandsJson = brandsRes.ok ? await brandsRes.json() : [];

    const next = {
      categories: normalizeArray(categoriesJson),
      brands: normalizeArray(brandsJson),
    };

    staticCatalogCache = next;
    return next;
  })();

  try {
    return await staticCatalogPromise;
  } finally {
    staticCatalogPromise = null;
  }
};

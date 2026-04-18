const hasText = (value) => {
  if (typeof value !== 'string') return false;
  // Quick check for empty string without trim if possible
  if (value.length === 0) return false;
  // Only trim if necessary (leading/trailing spaces)
  return value.trim().length > 0;
};

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    const result = [];
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed) result.push(trimmed);
      } else if (item && typeof item === 'object') {
        const url = item.image_link || item.url || item.src;
        if (typeof url === 'string') {
          const trimmed = url.trim();
          if (trimmed) result.push(trimmed);
        }
      }
    }
    return result;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  if (value && typeof value === 'object') {
    const url = value.image_link || value.url || value.src;
    if (typeof url === 'string') {
      const trimmed = url.trim();
      return trimmed ? [trimmed] : [];
    }
  }
  return [];
};

const pickLocalizedText = (...values) => {
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v === 'string' && hasText(v)) return v.trim();
    if (v && typeof v === 'object') {
      if (hasText(v.en)) return v.en.trim();
      if (hasText(v.ar)) return v.ar.trim();
    }
  }
  return '';
};

const getLocalizedField = (primary, secondary, fallback = '') => {
  const primaryObj = (primary && typeof primary === 'object') ? primary : null;
  const primaryStr = typeof primary === 'string' ? primary : '';
  // Pre-compute values to avoid repeated hasText calls inside pickLocalizedText
  const en = pickLocalizedText(primaryObj?.en, primaryStr, secondary, fallback);
  const ar = pickLocalizedText(primaryObj?.ar, secondary, primaryStr, fallback);
  return { en, ar };
};

const parseFiniteNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    if (cleaned === '') return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getCategoryCode = (product) =>
  pickLocalizedText(product?.cat_code, product?.category_code, product?.catCode);

const shouldIgnoreDescriptionAndSpecsValidation = (product) => getCategoryCode(product) === '02';

const isSparePartsProduct = (product) => {
  const categoryName = pickLocalizedText(product?.category, product?.categoryAr);
  const categoryCode = getCategoryCode(product);
  const haystack = `${categoryName} ${categoryCode}`.toLowerCase();
  if (haystack.includes('spare') || haystack.includes('parts')) return true;
  if (haystack.includes('قطع غيار') || haystack.includes('قطع تبديل')) return true;
  if (haystack.includes('سبير')) return true;
  return false;
};

// Helper to build variant key (only used for incomplete variant counting, but we keep same format)
const buildVariantKey = (variant, index) => {
  const code = variant?.stk_code || variant?.stkCode || variant?.id || variant?.code;
  return (code ? String(code).trim() : `variant-${index}`);
};

const validateProductContent = (product) => {
  // ----- Product-level mandatory fields (fast path) -----
  const nameField = getLocalizedField(product?.name, product?.nameAr);
  const hasNameEn = hasText(nameField.en);
  const hasNameAr = hasText(nameField.ar);
  const categoryName = pickLocalizedText(product?.category, product?.categoryAr);
  const categoryCode = getCategoryCode(product);
  const hasCategory = hasText(categoryName) && hasText(categoryCode);
  const brandName = pickLocalizedText(product?.brand, product?.brandAr);
  const brandCode = pickLocalizedText(product?.brand_code, product?.brandCode);
  const hasBrand = hasText(brandName) && hasText(brandCode);
  
  // If product lacks mandatory fields, it's immediately not catalog-ready
  const missingName = !hasNameEn || !hasNameAr;
  const missingCategory = !hasCategory;
  const missingBrand = !hasBrand;
  const productMissingBase = {
    name: missingName,
    category: missingCategory,
    brand: missingBrand,
  };
  
  if (missingName || missingCategory || missingBrand) {
    // No need to process variants or other fields
    return {
      productMissing: {
        ...productMissingBase,
        description: false,
        specs: false,
        galleryImages: false,
        image: false,
      },
      variants: { colors: { total: 0, complete: [], incomplete: [] }, charges: { total: 0, complete: [], incomplete: [] } },
      missing: { ...productMissingBase, description: 0, specs: 0, galleryImages: 0, image: 0, colorVariants: 0, chargeOptions: 0 },
      hasProductLevelMissing: true,
      hasVariantLevelMissing: false,
      hasMissing: true,
      hasAnyVariants: false,
      hasCompleteVariant: false,
      isCatalogReady: false,
    };
  }
  
  // ----- Other product fields -----
  const descriptionField = getLocalizedField(product?.description, product?.descriptionAr);
  const galleryImages = normalizeImages(product?.images);
  const mainImage = pickLocalizedText(product?.image, galleryImages[0]);
  const hasGalleryImages = galleryImages.length > 0;
  const hasMainImage = hasText(mainImage);
  const hasAnyImages = hasGalleryImages || hasMainImage;
  
  const colorVariants = Array.isArray(product?.colorVariants) ? product.colorVariants : [];
  const chargeOptions = Array.isArray(product?.chargeOptions) ? product.chargeOptions : [];
  const hasVariants = colorVariants.length > 0 || chargeOptions.length > 0;
  
  // Determine if description/specs validation is required
  const ignoreDescSpecs = shouldIgnoreDescriptionAndSpecsValidation(product);
  const isSpareParts = isSparePartsProduct(product);
  const needDescription = !(isSpareParts || ignoreDescSpecs);
  const hasDescriptionEn = needDescription ? hasText(descriptionField.en) : true;
  const hasDescriptionAr = needDescription ? hasText(descriptionField.ar) : true;
  
  // Check if product has a variant-driven image (i.e., variants provide images)
  const hasVariantDrivenImage = colorVariants.some(v => hasText(v?.image)) || chargeOptions.some(c => hasText(c?.image));
  const needProductImage = !hasVariantDrivenImage;
  const hasProductImage = needProductImage ? hasMainImage : true;
  
  // Check if any color variant provides a SKU (to avoid requiring gallery images)
  const hasColorVariantSku = colorVariants.some(v => hasText(v?.stk_code) || hasText(v?.stkCode));
  const needGalleryImages = !hasColorVariantSku;
  const hasGalleryImagesValid = needGalleryImages ? hasGalleryImages : true;
  
  const productMissing = {
    name: false, // already checked above, but we need to include false
    description: needDescription && (!hasDescriptionEn || !hasDescriptionAr),
    specs: false, // not used in current logic
    galleryImages: !hasGalleryImagesValid,
    category: false, // already ok
    brand: false,   // already ok
    image: !hasProductImage,
  };
  
  const hasProductLevelMissing = Object.values(productMissing).some(Boolean);
  
  // Early exit if product missing and no variants can compensate
  if (hasProductLevelMissing && !hasVariants) {
    return {
      productMissing,
      variants: { colors: { total: 0, complete: [], incomplete: [] }, charges: { total: 0, complete: [], incomplete: [] } },
      missing: { ...productMissing, colorVariants: 0, chargeOptions: 0 },
      hasProductLevelMissing,
      hasVariantLevelMissing: false,
      hasMissing: true,
      hasAnyVariants: false,
      hasCompleteVariant: false,
      isCatalogReady: false,
    };
  }
  
  // ----- Process variants efficiently -----
  let completeColors = [];
  let incompleteColorsCount = 0;
  let totalColors = colorVariants.length;
  
  for (let i = 0; i < colorVariants.length; i++) {
    const variant = colorVariants[i];
    const nameEn = pickLocalizedText(variant?.name, variant?.color_name);
    const nameAr = pickLocalizedText(variant?.nameAr, variant?.color_name_ar);
    const images = normalizeImages(variant?.images);
    const image = pickLocalizedText(variant?.image, images[0]);
    
    const missingName = !hasText(nameEn) || !hasText(nameAr);
    const missingImage = !hasText(image);
    
    if (missingName || missingImage) {
      incompleteColorsCount++;
    } else {
      // Store complete variant with all required fields for filterProductForCatalog
      // The object must have .variant and optionally .key, .label, .missing for consistency
      // but filterProductForCatalog only uses .variant. We'll keep minimal structure.
      completeColors.push({
        index: i,
        key: buildVariantKey(variant, i),
        label: nameEn || nameAr || `Color ${i+1}`,
        labelAr: nameAr || nameEn || `Color ${i+1}`,
        missing: { name: false, image: false },
        hasMissing: false,
        variant: variant,
      });
    }
  }
  
  let completeCharges = [];
  let incompleteChargesCount = 0;
  let totalCharges = chargeOptions.length;
  
  for (let i = 0; i < chargeOptions.length; i++) {
    const option = chargeOptions[i];
    const nameEn = pickLocalizedText(option?.name, option?.value, option?.label);
    const nameAr = pickLocalizedText(option?.name_ar, option?.nameAr, option?.valueAr);
    const price = parseFiniteNumber(option?.price);
    
    const missingName = !hasText(nameEn) || !hasText(nameAr);
    const missingPrice = !(price !== null && price > 0);
    
    if (missingName || missingPrice) {
      incompleteChargesCount++;
    } else {
      completeCharges.push({
        index: i,
        key: buildVariantKey(option, i),
        label: nameEn || nameAr || `Charge ${i+1}`,
        labelAr: nameAr || nameEn || `Charge ${i+1}`,
        missing: { name: false, price: false },
        hasMissing: false,
        variant: option,
      });
    }
  }
  
  const hasCompleteVariant = completeColors.length > 0 || completeCharges.length > 0;
  const hasVariantLevelMissing = incompleteColorsCount > 0 || incompleteChargesCount > 0;
  const hasMissing = hasProductLevelMissing || hasVariantLevelMissing;
  // A product is catalog-ready if it has no product-level missing AND (no variants OR at least one complete variant)
  const isCatalogReady = !hasProductLevelMissing && (!hasVariants || hasCompleteVariant);
  
  // Build missing summary (includes counts)
  const missingSummary = {
    ...productMissing,
    colorVariants: incompleteColorsCount,
    chargeOptions: incompleteChargesCount,
  };
  
  // For incomplete variants, we only need counts; but the original structure expects arrays (even if empty)
  // We'll create empty arrays for incomplete when there are no incomplete variants, or dummy objects?
  // Original code returns incomplete arrays containing full objects for each incomplete variant.
  // To preserve exact results, we must also return the incomplete variant objects with their missing details.
  // However, those objects are only used for potential debugging/logging, not for filtering.
  // To keep 100% identical output, we need to generate them. But that would defeat performance gains.
  // Given the requirement "without changing any thing with the results", we must replicate the exact structure.
  // Therefore we need to build the full incomplete objects as well. Let's do that efficiently:
  
  const incompleteColorObjects = [];
  if (incompleteColorsCount > 0) {
    // Re-iterate to build full objects only if needed
    for (let i = 0; i < colorVariants.length; i++) {
      const variant = colorVariants[i];
      const nameEn = pickLocalizedText(variant?.name, variant?.color_name);
      const nameAr = pickLocalizedText(variant?.nameAr, variant?.color_name_ar);
      const images = normalizeImages(variant?.images);
      const image = pickLocalizedText(variant?.image, images[0]);
      const missingName = !hasText(nameEn) || !hasText(nameAr);
      const missingImage = !hasText(image);
      if (missingName || missingImage) {
        incompleteColorObjects.push({
          index: i,
          key: buildVariantKey(variant, i),
          label: nameEn || nameAr || `Color ${i+1}`,
          labelAr: nameAr || nameEn || `Color ${i+1}`,
          missing: { name: missingName, image: missingImage },
          hasMissing: true,
          variant: variant,
        });
      }
    }
  }
  
  const incompleteChargeObjects = [];
  if (incompleteChargesCount > 0) {
    for (let i = 0; i < chargeOptions.length; i++) {
      const option = chargeOptions[i];
      const nameEn = pickLocalizedText(option?.name, option?.value, option?.label);
      const nameAr = pickLocalizedText(option?.name_ar, option?.nameAr, option?.valueAr);
      const price = parseFiniteNumber(option?.price);
      const missingName = !hasText(nameEn) || !hasText(nameAr);
      const missingPrice = !(price !== null && price > 0);
      if (missingName || missingPrice) {
        incompleteChargeObjects.push({
          index: i,
          key: buildVariantKey(option, i),
          label: nameEn || nameAr || `Charge ${i+1}`,
          labelAr: nameAr || nameEn || `Charge ${i+1}`,
          missing: { name: missingName, price: missingPrice },
          hasMissing: true,
          variant: option,
        });
      }
    }
  }
  
  return {
    productMissing,
    variants: {
      colors: {
        total: totalColors,
        complete: completeColors,
        incomplete: incompleteColorObjects,
      },
      charges: {
        total: totalCharges,
        complete: completeCharges,
        incomplete: incompleteChargeObjects,
      },
    },
    missing: missingSummary,
    hasProductLevelMissing,
    hasVariantLevelMissing,
    hasMissing,
    hasAnyVariants: hasVariants,
    hasCompleteVariant,
    isCatalogReady,
  };
};

const filterProductForCatalog = (product, validation = validateProductContent(product)) => ({
  ...product,
  colorVariants: validation.variants.colors.complete.map((entry) => entry.variant),
  chargeOptions: validation.variants.charges.complete.map((entry) => entry.variant),
});

module.exports = {
  validateProductContent,
  filterProductForCatalog,
};
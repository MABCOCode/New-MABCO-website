const hasText = (value) => String(value ?? '').trim().length > 0;

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (!item || typeof item !== 'object') return '';
        return String(item.image_link || item.url || item.src || '').trim();
      })
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  if (value && typeof value === 'object') {
    const entry = String(value.image_link || value.url || value.src || '').trim();
    return entry ? [entry] : [];
  }
  return [];
};

const pickLocalizedText = (...values) => {
  for (const value of values) {
    if (typeof value === 'string' && hasText(value)) return String(value).trim();
    if (value && typeof value === 'object') {
      if (hasText(value.en)) return String(value.en).trim();
      if (hasText(value.ar)) return String(value.ar).trim();
    }
  }
  return '';
};

const getLocalizedField = (primary, secondary, fallback = '') => {
  const primaryValue = primary && typeof primary === 'object' ? primary : null;
  const primaryText = typeof primary === 'string' ? primary : '';
  return {
    en: pickLocalizedText(primaryValue?.en, primaryText, secondary, fallback),
    ar: pickLocalizedText(primaryValue?.ar, secondary, primaryText, fallback),
  };
};

const parseFiniteNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(String(value).replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildVariantKey = (variant, index) =>
  String(
    variant?.stk_code ||
      variant?.stkCode ||
      variant?.id ||
      variant?.code ||
      `variant-${index}`,
  ).trim();

const validateColorVariant = (variant, index) => {
  const nameEn = pickLocalizedText(variant?.name, variant?.color_name);
  const nameAr = pickLocalizedText(variant?.nameAr, variant?.color_name_ar);
  const images = normalizeImages(variant?.images);
  const image = pickLocalizedText(variant?.image, images[0]);

  const missing = {
    name: !hasText(nameEn) || !hasText(nameAr),
    image: !hasText(image),
  };

  const hasMissing = Object.values(missing).some(Boolean);

  return {
    index,
    key: buildVariantKey(variant, index),
    label: nameEn || nameAr || `Color ${index + 1}`,
    labelAr: nameAr || nameEn || `Color ${index + 1}`,
    missing,
    hasMissing,
    variant,
  };
};

const validateChargeOption = (option, index) => {
  const nameEn = pickLocalizedText(option?.name, option?.value, option?.label);
  const nameAr = pickLocalizedText(option?.name_ar, option?.nameAr, option?.valueAr);
  const price = parseFiniteNumber(option?.price);

  const missing = {
    name: !hasText(nameEn) || !hasText(nameAr),
    price: !(price !== null && price > 0),
  };

  const hasMissing = Object.values(missing).some(Boolean);

  return {
    index,
    key: buildVariantKey(option, index),
    label: nameEn || nameAr || `Charge ${index + 1}`,
    labelAr: nameAr || nameEn || `Charge ${index + 1}`,
    missing,
    hasMissing,
    variant: option,
  };
};

const validateProductContent = (product) => {
  const name = getLocalizedField(product?.name, product?.nameAr);
  const description = getLocalizedField(product?.description, product?.descriptionAr);
  const specs = Array.isArray(product?.specs)
    ? product.specs
    : Array.isArray(product?.specifications)
      ? product.specifications
      : [];
  const galleryImages = normalizeImages(product?.images);
  const colorVariants = Array.isArray(product?.colorVariants) ? product.colorVariants : [];
  const chargeOptions = Array.isArray(product?.chargeOptions) ? product.chargeOptions : [];
  const hasVariantDrivenImage = colorVariants.length > 0 || chargeOptions.length > 0;
  const hasColorVariantSku = colorVariants.some((variant) => hasText(variant?.stk_code || variant?.stkCode));
  const mainImage = pickLocalizedText(product?.image, galleryImages[0]);
  const categoryName = pickLocalizedText(product?.category, product?.categoryAr);
  const categoryCode = pickLocalizedText(product?.cat_code, product?.category_code, product?.catCode);
  const brandName = pickLocalizedText(product?.brand, product?.brandAr);
  const brandCode = pickLocalizedText(product?.brand_code, product?.brandCode);

  const specsRequired = categoryCode !== '02';
  const productMissing = {
    name: !hasText(name.en) || !hasText(name.ar),
    description: !hasText(description.en) || !hasText(description.ar),
    specs: specsRequired && specs.length === 0,
    galleryImages: !hasColorVariantSku && galleryImages.length === 0,
    category: !hasText(categoryName) || !hasText(categoryCode),
    brand: !hasText(brandName) || !hasText(brandCode),
    image: !hasVariantDrivenImage && !hasText(mainImage),
  };

  const validatedColors = colorVariants.map(validateColorVariant);
  const validatedCharges = chargeOptions.map(validateChargeOption);
  const completeColors = validatedColors.filter((variant) => !variant.hasMissing);
  const incompleteColors = validatedColors.filter((variant) => variant.hasMissing);
  const completeCharges = validatedCharges.filter((option) => !option.hasMissing);
  const incompleteCharges = validatedCharges.filter((option) => option.hasMissing);
  const hasAnyVariants = colorVariants.length > 0 || chargeOptions.length > 0;
  const hasCompleteVariant = completeColors.length > 0 || completeCharges.length > 0;
  const hasProductLevelMissing = Object.values(productMissing).some(Boolean);
  const hasVariantLevelMissing = incompleteColors.length > 0 || incompleteCharges.length > 0;
  const hasMissing = hasProductLevelMissing || hasVariantLevelMissing;
  const isCatalogReady = !hasProductLevelMissing && (!hasAnyVariants || hasCompleteVariant);

  return {
    productMissing,
    variants: {
      colors: {
        total: validatedColors.length,
        complete: completeColors,
        incomplete: incompleteColors,
      },
      charges: {
        total: validatedCharges.length,
        complete: completeCharges,
        incomplete: incompleteCharges,
      },
    },
    missing: {
      ...productMissing,
      colorVariants: incompleteColors.length,
      chargeOptions: incompleteCharges.length,
    },
    hasProductLevelMissing,
    hasVariantLevelMissing,
    hasMissing,
    hasAnyVariants,
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

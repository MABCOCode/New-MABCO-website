const OFFER_TYPES = ['direct_discount', 'coupon', 'free_product', 'bundle_discount'];

const normalizeOffers = (offers) => {
  if (!Array.isArray(offers)) return [];
  return offers
    .map((offer) => {
      if (offer && typeof offer === 'object' && 'offer_type' in offer) {
        if (!offer.is_active) return null;
        return {
          offer_no: offer.offer_no,
          type: offer.offer_type,
          discountType: offer.discount_type === 'p' ? 'percentage' : 'value',
          discountValue: Number(offer.discount ?? 0),
          couponValue: Number(offer.discount ?? 0),
          discountPercentage: Number(offer.discount ?? 0),
          freeProductId: Array.isArray(offer.products) ? Number(offer.products[0]) : 0,
          titleEn: offer.title || '',
          titleAr: offer.title_ar || offer.title || '',
          descriptionEn: offer.description || '',
          descriptionAr: offer.description_ar || offer.description || '',
        };
      }
      return offer;
    })
    .filter(Boolean);
};

const hasOfferType = (offers, offerType) =>
  normalizeOffers(offers).some((offer) => offer.type === offerType);

const buildOfferQuery = (path, offerType) => ({
  $or: [
    { [`${path}.offer_type`]: offerType },
    { [`${path}.type`]: offerType },
  ],
});

const projection = {
  _id: 1,
  stk_code: 1,
  id: 1,
  slug: 1,
  name: 1,
  nameAr: 1,
  price: 1,
  image: 1,
  category: 1,
  categoryAr: 1,
  cat_code: 1,
  brand: 1,
  brand_code: 1,
  badge: 1,
  isMostSold: 1,
  isNew: 1,
  isHot: 1,
  offers: 1,
  availability: 1,
  colorVariants: 1,
  chargeOptions: 1,
  status: 1,
  updatedAt: 1,
};

const getProductKey = (product) =>
  String(product?.id || product?.stk_code || product?._id || product?.slug || '');

async function rebuildOffersRead(db, { logger = console } = {}) {
  const now = new Date();
  const payloadByType = new Map();
  OFFER_TYPES.forEach((type) => payloadByType.set(type, []));

  let processed = 0;

  for (const offerType of OFFER_TYPES) {
    logger.log('[rebuildOffersRead] building offer type:', offerType);
    const productMap = new Map();

    const ingest = (product) => {
      const key = getProductKey(product);
      if (!key) return;
      productMap.set(key, product);
    };

    const queries = [
      buildOfferQuery('offers', offerType),
      buildOfferQuery('colorVariants.offers', offerType),
      buildOfferQuery('chargeOptions.offers', offerType),
    ];

    for (const query of queries) {
      const cursor = db.collection('products').find(query, { projection }).batchSize(500);
      for await (const product of cursor) {
        ingest(product);
        processed += 1;
        if (processed % 1000 === 0) {
          logger.log('[rebuildOffersRead] processed', processed);
        }
      }
    }

    const products = Array.from(productMap.values()).map((product) => {
      const productHasOffer = hasOfferType(product.offers, offerType);
      const colorVariants = Array.isArray(product.colorVariants) ? product.colorVariants : [];
      const chargeOptions = Array.isArray(product.chargeOptions) ? product.chargeOptions : [];

      const matchingColors = colorVariants.filter((variant) => hasOfferType(variant?.offers, offerType));
      const matchingCharges = chargeOptions.filter((opt) => hasOfferType(opt?.offers, offerType));

      const resolvedColors =
        matchingColors.length > 0 ? matchingColors : productHasOffer ? colorVariants : [];
      const resolvedCharges =
        matchingCharges.length > 0 ? matchingCharges : productHasOffer ? chargeOptions : [];

      return {
        ...product,
        colorVariants: resolvedColors,
        chargeOptions: resolvedCharges,
      };
    });

    payloadByType.set(offerType, products);
    logger.log('[rebuildOffersRead] offer type ready:', offerType, 'count:', products.length);
  }

  const collection = db.collection('offers_read');
  const counts = {};
  for (const offerType of OFFER_TYPES) {
    const payload = {
      offerType,
      products: payloadByType.get(offerType),
      updatedAt: now,
    };
    counts[offerType] = payload.products.length;
    logger.log('[rebuildOffersRead] saving', offerType, 'count:', counts[offerType]);
    await collection.replaceOne(
      { offerType, locale: 'default' },
      { offerType, locale: 'default', payload },
      { upsert: true },
    );
  }

  return { counts, processed, updatedAt: now };
}

module.exports = { rebuildOffersRead };

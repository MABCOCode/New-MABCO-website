const { connectMongo, getDb, closeMongo } = require('../src/config/db');

const SITE_URL = (process.env.SITE_URL || 'https://mabcoonline.com').replace(/\/$/, '');
const OLD_BASES = [
  'http://localhost:5000',
  'https://localhost:5000',
  'http://127.0.0.1:5000',
  'https://127.0.0.1:5000',
];

const replaceUrl = (value) => {
  if (typeof value !== 'string') return value;
  for (const base of OLD_BASES) {
    const prefix = `${base}/images/`;
    if (value.startsWith(prefix)) {
      return `${SITE_URL}/images/${value.slice(prefix.length)}`;
    }
  }
  return value;
};

const replaceInArray = (arr) => {
  if (!Array.isArray(arr)) return arr;
  let changed = false;
  const next = arr.map((item) => {
    if (typeof item === 'string') {
      const updated = replaceUrl(item);
      if (updated !== item) changed = true;
      return updated;
    }
    if (item && typeof item === 'object') {
      const updated = { ...item };
      ['image_link', 'url', 'src', 'image'].forEach((key) => {
        if (typeof updated[key] === 'string') {
          const replaced = replaceUrl(updated[key]);
          if (replaced !== updated[key]) {
            updated[key] = replaced;
            changed = true;
          }
        }
      });
      return updated;
    }
    return item;
  });
  return { next, changed };
};

const replaceSpecIcons = (specs) => {
  if (!Array.isArray(specs)) return { next: specs, changed: false };
  let changed = false;
  const next = specs.map((spec) => {
    if (!spec || typeof spec !== 'object') return spec;
    const updated = { ...spec };
    if (typeof updated.iconImage === 'string') {
      const replaced = replaceUrl(updated.iconImage);
      if (replaced !== updated.iconImage) {
        updated.iconImage = replaced;
        changed = true;
      }
    }
    if (updated.icon && typeof updated.icon === 'object' && typeof updated.icon.url === 'string') {
      const replaced = replaceUrl(updated.icon.url);
      if (replaced !== updated.icon.url) {
        updated.icon = { ...updated.icon, url: replaced };
        changed = true;
      }
    }
    return updated;
  });
  return { next, changed };
};

const replaceVariantImages = (variants) => {
  if (!Array.isArray(variants)) return { next: variants, changed: false };
  let changed = false;
  const next = variants.map((variant) => {
    if (!variant || typeof variant !== 'object') return variant;
    const updated = { ...variant };
    const imagesResult = replaceInArray(updated.images);
    if (imagesResult && imagesResult.changed) {
      updated.images = imagesResult.next;
      changed = true;
    }
    if (typeof updated.image === 'string') {
      const replaced = replaceUrl(updated.image);
      if (replaced !== updated.image) {
        updated.image = replaced;
        changed = true;
      }
    }
    return updated;
  });
  return { next, changed };
};

async function updateProducts(db) {
  const collection = db.collection('products');
  const query = {
    $or: [
      { image: { $regex: 'localhost:5000/images' } },
      { image: { $regex: '127.0.0.1:5000/images' } },
      { images: { $elemMatch: { $regex: 'localhost:5000/images' } } },
      { images: { $elemMatch: { $regex: '127.0.0.1:5000/images' } } },
      { 'colorVariants.images': { $elemMatch: { $regex: 'localhost:5000/images' } } },
      { 'colorVariants.images': { $elemMatch: { $regex: '127.0.0.1:5000/images' } } },
      { 'colorVariants.image': { $regex: 'localhost:5000/images' } },
      { 'colorVariants.image': { $regex: '127.0.0.1:5000/images' } },
      { 'specs.iconImage': { $regex: 'localhost:5000/images' } },
      { 'specs.iconImage': { $regex: '127.0.0.1:5000/images' } },
      { 'specs.icon.url': { $regex: 'localhost:5000/images' } },
      { 'specs.icon.url': { $regex: '127.0.0.1:5000/images' } },
    ],
  };

  const cursor = collection.find(query, {
    projection: {
      image: 1,
      images: 1,
      colorVariants: 1,
      specs: 1,
    },
  });

  let updatedCount = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) continue;
    const update = {};
    let changed = false;

    if (typeof doc.image === 'string') {
      const replaced = replaceUrl(doc.image);
      if (replaced !== doc.image) {
        update.image = replaced;
        changed = true;
      }
    }

    const imagesResult = replaceInArray(doc.images);
    if (imagesResult && imagesResult.changed) {
      update.images = imagesResult.next;
      changed = true;
    }

    const variantsResult = replaceVariantImages(doc.colorVariants);
    if (variantsResult && variantsResult.changed) {
      update.colorVariants = variantsResult.next;
      changed = true;
    }

    const specsResult = replaceSpecIcons(doc.specs);
    if (specsResult && specsResult.changed) {
      update.specs = specsResult.next;
      changed = true;
    }

    if (changed) {
      await collection.updateOne({ _id: doc._id }, { $set: update });
      updatedCount += 1;
    }
  }

  return updatedCount;
}

async function updateBannerSlides(db) {
  const collection = db.collection('banner_slides');
  const query = {
    image: { $regex: 'localhost:5000/images|127.0.0.1:5000/images' },
  };
  const cursor = collection.find(query, { projection: { image: 1 } });
  let updatedCount = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) continue;
    const replaced = replaceUrl(doc.image);
    if (replaced !== doc.image) {
      await collection.updateOne({ _id: doc._id }, { $set: { image: replaced } });
      updatedCount += 1;
    }
  }
  return updatedCount;
}

async function updateSavedSpecTitles(db) {
  const collection = db.collection('saved_spec_titles');
  const query = {
    iconImage: { $regex: 'localhost:5000/images|127.0.0.1:5000/images' },
  };
  const cursor = collection.find(query, { projection: { iconImage: 1 } });
  let updatedCount = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) continue;
    const replaced = replaceUrl(doc.iconImage);
    if (replaced !== doc.iconImage) {
      await collection.updateOne({ _id: doc._id }, { $set: { iconImage: replaced } });
      updatedCount += 1;
    }
  }
  return updatedCount;
}

async function run() {
  await connectMongo();
  const db = getDb();

  const [products, banners, specTitles] = await Promise.all([
    updateProducts(db),
    updateBannerSlides(db),
    updateSavedSpecTitles(db),
  ]);

  // eslint-disable-next-line no-console
  console.log('Updated documents:', {
    products,
    banner_slides: banners,
    saved_spec_titles: specTitles,
  });
}

run()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongo();
  });

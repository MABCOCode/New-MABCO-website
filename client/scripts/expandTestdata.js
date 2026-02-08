const fs = require('fs');
const path = require('path');

const testdataDir = path.join(__dirname, '..', 'src', 'testdata');
const categoriesPath = path.join(testdataDir, 'categories.json');
const productsPath = path.join(testdataDir, 'products.json');
const outPath = path.join(testdataDir, 'products.expanded.json');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const categories = readJSON(categoriesPath);
const products = readJSON(productsPath);

// Flatten original products arrays into baseProducts
const baseProducts = Object.values(products).flat().filter(Boolean);

let nextId = Math.max(0, ...baseProducts.map(p => Number(p.id) || 0)) + 1;

const expanded = [];

categories.forEach((cat, catIdx) => {
  const catName = cat.nameEn || cat.name || '';
  const brands = Array.isArray(cat.brands) ? cat.brands : [];
  brands.forEach((brand, bIdx) => {
    // For each base product, create one copy per brand-category
    baseProducts.forEach((bp) => {
      const copy = JSON.parse(JSON.stringify(bp));
      copy.id = nextId++;
      copy.brand = String(brand);
      copy.category = catName;
      // tweak name so it's clear in test UI
      copy.name = `${copy.name} — ${brand} / ${catName}`;
      expanded.push(copy);
    });
  });
});

// Create output object preserving original keys and adding 'all'
const out = Object.assign({}, products, { all: expanded });

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Expanded testdata written to', outPath, 'with', expanded.length, 'items');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '../../');
const CLIENT_DIR = path.join(ROOT, 'client');
const OUTPUT_FILE = path.join(ROOT, 'server/docs/mongodb/assets-non-products.json');
const PRODUCT_DATA_FILE = path.join(CLIENT_DIR, 'src/data/products.ts');

const SKIP_DIRS = new Set(['node_modules', 'build', '.git']);
const TEXT_FILE_EXTENSIONS = new Set(['.json', '.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.md']);
const IMAGE_FILE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif', '.bmp', '.ico']);

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function isImageUrlLike(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  const v = value.trim();
  const lower = v.toLowerCase();

  if (/^https?:\/\//i.test(v)) {
    if (/\.(png|jpe?g|webp|svg|gif|avif|bmp|ico)(\?|$)/i.test(v)) return true;
    if (lower.includes('/images/')) return true;
    if (lower.includes('unsplash.com')) return true;
    if (lower.includes('img.icons8.com')) return true;
    if (lower.includes('upload.wikimedia.org')) return true;
    return false;
  }

  if (/^\/uploads\//i.test(v) || /^uploads\//i.test(v) || /^\.\/uploads\//i.test(v)) return true;
  if (/^\/static\//i.test(v) || /^\/images\//i.test(v) || /^\/assets\//i.test(v)) return true;
  if (/^mabcoonline\.com\/images\//i.test(v) || /^www\./i.test(v)) return true;
  if (/\.(png|jpe?g|webp|svg|gif|avif|bmp|ico)(\?|$)/i.test(v)) return true;

  return false;
}

function normalizeUrl(value) {
  const v = value.trim();
  if (v.startsWith('//')) return `https:${v}`;
  if (/^mabcoonline\.com\//i.test(v)) return `https://${v}`;
  if (/^www\./i.test(v)) return `https://${v}`;
  if (/^\.\//.test(v)) return v.slice(1);
  if (/^uploads\//.test(v)) return `/${v}`;
  return v;
}

function detectMimeType(urlOrPath) {
  const ext = path.extname(urlOrPath.split('?')[0]).replace('.', '').toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'avif') return 'image/avif';
  if (ext === 'bmp') return 'image/bmp';
  if (ext === 'ico') return 'image/x-icon';
  return 'application/octet-stream';
}

function extractStringsFromText(text) {
  const results = [];
  const regex = /["'`](.*?)["'`]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const candidate = match[1];
    if (isImageUrlLike(candidate)) results.push(normalizeUrl(candidate));
  }
  return results;
}

function walkFiles(dirPath, out = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    if (SKIP_DIRS.has(entry.name)) return;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, out);
      return;
    }
    out.push(fullPath);
  });
  return out;
}

function getProductImageSet() {
  if (!fs.existsSync(PRODUCT_DATA_FILE)) return new Set();
  const text = fs.readFileSync(PRODUCT_DATA_FILE, 'utf8');
  return new Set(extractStringsFromText(text));
}

function buildAssetDoc(url, nowIso) {
  const digest = crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
  const fileName = path.basename(url.split('?')[0]) || `${digest}.bin`;
  const isLocalUpload = url.startsWith('/uploads/');
  return {
    storageKey: isLocalUpload ? `uploads/${fileName}` : `seed/assets/${digest}-${fileName}`,
    cdnUrl: url,
    sourceType: isLocalUpload ? 'local_upload' : 'external',
    local: isLocalUpload
      ? {
          publicUrl: url,
          diskPath: toPosix(path.join('server', 'uploads', fileName)),
          fileName,
        }
      : undefined,
    variants: {},
    mimeType: detectMimeType(url),
    size: 0,
    width: 0,
    height: 0,
    alt: { en: '', ar: '' },
    audit: { createdAt: nowIso, updatedAt: nowIso },
  };
}

function main() {
  const productImages = getProductImageSet();
  const allFiles = walkFiles(CLIENT_DIR);
  const candidates = new Set();

  allFiles.forEach((filePath) => {
    const rel = toPosix(path.relative(CLIENT_DIR, filePath));
    const ext = path.extname(filePath).toLowerCase();

    if (rel === 'src/data/products.ts') return;

    if (IMAGE_FILE_EXTENSIONS.has(ext)) {
      if (rel.startsWith('public/')) {
        candidates.add(`/${toPosix(path.relative(path.join(CLIENT_DIR, 'public'), filePath))}`);
      } else {
        candidates.add(`/${rel}`);
      }
      return;
    }

    if (!TEXT_FILE_EXTENSIONS.has(ext)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    extractStringsFromText(content).forEach((value) => candidates.add(value));
  });

  const filtered = Array.from(candidates)
    .filter((url) => !productImages.has(url))
    .filter((url) => isImageUrlLike(url));

  const nowIso = new Date().toISOString();
  const docs = filtered.sort().map((url) => buildAssetDoc(url, nowIso));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(docs, null, 2)}\n`, 'utf8');

  console.log(`Exported ${docs.length} non-product assets to ${OUTPUT_FILE}`);
}

main();

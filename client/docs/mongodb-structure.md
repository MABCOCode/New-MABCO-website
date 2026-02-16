# MongoDB Schema & Read-Model Structure for MABCO Website

This document describes the recommended MongoDB collections, field shapes, indexes, read-models, change flows, and sample documents to support all pages and functions of the MABCO website (products, product detail, listings, offers, orders, showrooms, users/customers, notifications, translations, assets, analytics, admin audit). Use this as both an implementation guide and a migration checklist.

---

## Goals
- Provide canonical master collections for authoritative writes and denormalized read models (or static JSON) for ultra-fast reads.
- Cover per-page payloads so front-end pages do not need to do heavy joins or recalculations.
- Support bilingual content (English/Arabic) and product variants (colors, charge options, images per color).
- Include non-functional pieces: notifications, search sync, caching, CDN invalidation, observability.

---

## High-level Strategy
- Master collections store authoritative data: `products`, `categories`, `brands`, `offers`, `users`, `orders`, `showrooms`, etc.
- Read-model collections or precomputed JSON files store denormalized payloads used by pages: `products_read`, `category_pages`, `home_page`, `showrooms.{locale}.json`.
- Background worker(s) listen to change events (change stream or write to `events` queue) to regenerate read models and invalidate CDN caches.
- Use a search engine (Meili/Algolia/Elastic) for full-text search; sync from product master.

---

## Collections (detailed)

### 1) `products` (master)
Purpose: canonical product data (admin writes / external sync source).
Fields (recommended):
- `_id: ObjectId`
- `sku: string` (unique)
- `slug: string` (unique)
- `nameEn: string`, `nameAr: string`
- `descriptionEn: string`, `descriptionAr: string`
- `basePrice: number`, `oldPrice?: number`, `currency?: string`
- `categories: ObjectId[]`
- `brandId?: ObjectId`
- `tags?: string[]`
- `images?: string[]` (global fallback gallery)
- `colorVariants?: [{ id:string, name:string, hexCode?:string, image?:string, images?:string[], inStock?: boolean, stock?: number, sku?: string }]`
- `specs?: [{ nameEn, nameAr, valueEn, valueAr, icon }]`
- `inTheBox?: [{ en: string, ar: string }]`  // bilingual box contents
- `keyFeatures?: string[]`
- `chargeOptions?: [{ id, value, valueAr?, price }]
- `offersApplied?: ObjectId[]` (refs)
- `availability?: { globalStock:number, perStore?: { [showroomId:string]: number } }`
- `seo?: { titleEn, titleAr, descEn, descAr, keywords?: string[] }
- `meta?: { popularity?: number, rating?: number, reviewsCount?: number }
- `syncedFrom?: { source?:string, externalId?:string }`
- `createdAt`, `updatedAt`

Indexes:
- `{ slug: 1 } unique`
- `{ sku: 1 } unique`
- `{ categories: 1 }` (multikey)
- Text index for search fields (if using Mongo search): `{$**: 'text'}` or specific: `{ nameEn: 'text', nameAr: 'text', descriptionEn: 'text', descriptionAr: 'text' }`
- `{ updatedAt: 1 }` for change-stream filtering

Read usage: admin pages, product sync, source for read-model generation.

Sample document (truncated):
```json
{
  "_id": "ObjectId(...)",
  "sku": "ABC-123",
  "slug": "phone-model-x",
  "nameEn": "Phone Model X",
  "nameAr": "هاتف X",
  "descriptionEn": "...",
  "basePrice": 199.99,
  "oldPrice": 249.99,
  "categories": ["ObjectId(...)"],
  "colorVariants": [{ "id":"black","name":"Black","images":["https://cdn/.../b1.jpg"] }],
  "specs": [{ "nameEn":"Display","nameAr":"الشاشة","valueEn":"6.1 OLED","valueAr":"6.1 OLED" }],
  "inTheBox": [{"en":"User Manual","ar":"دليل المستخدم"}],
  "createdAt":"2026-02-15T...Z"
}
```

---

### 2) `products_read` (read-model)
Purpose: Denormalized product payload optimized for ProductDetail page (one doc per slug+locale, optionally per variant). These documents are the ones cached on CDN or Redis for instant responses.

Key fields:
- `_id: string` (format: `${slug}|${locale}`)
- `productId: ObjectId`
- `locale: 'en'|'ar'`
- `slug, title, descriptionHtml`
- `priceDisplay: string`, `numericPrice: number`, `oldPrice?: number`, `discountPercentage?: number`
- `primaryImage: string`, `gallery: [{url,width,height}]`
- `colorVariants: [{ id,name,hexCode,images, sku, inStock }]`
- `specsTop4: [...]` (for summary)
- `specsAll: [...]` (full list)
- `keyFeatures: []`
- `inTheBox: [{en,ar}]`
- `offersSnapshot: [{ offerId, title, discount, validUntil }]
- `seo: {...}`
- `precomputedPurchaseOptions` (charge options + display strings)
- `updatedAt`

Indexes:
- `{ _id:1 }` (slug|locale)
- `{ productId:1 }`

Generation: background worker builds this from `products`, `offers`, `categories`, and `assets` whenever product or related offer/category changes.

Sample:
```json
{
  "_id": "phone-model-x|en",
  "productId": "ObjectId(...)",
  "locale":"en",
  "title":"Phone Model X",
  "descriptionHtml":"<p>...</p>",
  "priceDisplay":"$199.99",
  "primaryImage":"https://cdn/.../hero.jpg",
  "gallery":["..."],
  "inTheBox":[{"en":"User Manual","ar":"دليل المستخدم"}],
  "offersSnapshot":[{"offerId":"ObjectId(...)","title":"Summer Sale","discount":20}],
  "updatedAt":"2026-02-15T...Z"
}
```

Read usage: Product detail page reads this doc and renders immediately. No joins required.

---

### 3) `categories`
Fields: `_id, slug, nameEn, nameAr, parentId?, descriptionEn?, descriptionAr?, featuredProductIds?: [productId], seo?, sortOrder?`
Indexes: `{ slug:1 }`
Usage: categories page, breadcrumbs, filters, category listing precomputed pages.

---

### 4) `brands`
Fields: `_id, nameEn, nameAr, slug, logoAssetId, featuredProductIds[]`
Indexes: `{ slug:1 }`
Usage: brand page, filters.

---

### 5) `offers`
Purpose: store promotion rules and metadata.
Fields:
- `_id, code, titleEn, titleAr, descriptionEn, descriptionAr`
- `type: 'percentage'|'fixed'|'bundle'|'buyXgetY'`
- `value: number`
- `appliesTo: { products?: [ObjectId], categories?: [ObjectId], brands?: [ObjectId], all?: boolean }`
- `startAt, endAt, active: boolean, combinable: boolean`
- `conditions: { minQuantity?, customerGroups? }`
- `createdAt, updatedAt`

Indexes:
- `{ code:1 } unique`
- TTL or range queries support: `{ active:1, startAt:1, endAt:1 }`

Usage:
- Worker computes `offersSnapshot` for `products_read`.
- Checkout calculates valid offers for `orders` (re-evaluate at checkout for correctness).

Sample:
```json
{ "_id":"ObjectId(...)","code":"SUMMER23","titleEn":"Summer Sale","type":"percentage","value":15,"appliesTo":{"categories":["ObjectId(...)"]},"startAt":"2026-06-01T...Z","endAt":"2026-06-30T...Z","active":true }
```

---

### 6) `orders`
Purpose: store transactions, immutable snapshots for accounting/audit.
Fields:
- `_id, orderNumber (string unique), userId?, customer: { name,email,phone }, items: [{ productId, sku, nameEn, nameAr, unitPrice, qty, totalPrice, color, variantImage }], subtotal, shippingAmount, taxAmount, totalAmount, currency, appliedOffers:[{offerId,code,amountDiscount}], orderStatus, payment:{method, provider, transactionId, status}, shippingAddress, billingAddress, fulfillment:{type, showroomId?}, events:[], createdAt, updatedAt`

Indexes:
- `{ orderNumber:1 } unique`, `{ userId:1, createdAt:-1 }`.

Usage:
- Checkout writes this; post-order workers handle stock decrement, notifications, fulfillment.

Notes on connection to cart and applied offers:
- `carts` (if you persist server-side) should store the `appliedOffers` snapshot when the user proceeds to checkout. That snapshot contains `{ offerId, code, amountDiscount, metadata }` so the client and server agree on what discounts were applied at checkout time.
- The `orders` document must persist the `appliedOffers` snapshot from the cart (or re-evaluation result) into `orders.appliedOffers`. This preserves auditability and prevents future price/offer changes from invalidating old orders.
- Optionally include a `cartId` (or `cartSnapshotId`) field in `orders` referencing the cart record used to create the order for traceability.
- During checkout, always re-validate offers and stock against master `offers` and `products` collections; but persist the snapshot used for the final charge in `orders`.

---

### 7) `carts` (optional server-side)
Purpose: persistent per-user or per-session cart for cross-device continuity.
Fields: `{ _id, userId?, sessionId?, items:[{productId, sku, qty, chosenColor, priceSnapshot}], updatedAt }`
TTL for guest carts optional.

---

### 8) `users` and `customers`
`users` for auth & app preference; `customers` (optional) for CRM/checkout details.
Users fields: `_id, email, passwordHash, roles, profile:{firstName,lastName,locale,preferredShowroom}, preferences:{currency,language,notificationPrefs}, createdAt`.
Indexes: `{ email:1 } unique`.

Customers fields: `_id, userId?, name, emails[], phones[], addresses[], billingProfiles[], loyaltyPoints`.

Usage: auth, account pages, notification targeting.

---

### 9) `showrooms`
Fields: `{ _id (string code), code, city, name, address, phone, coords:{lat,lng}, hours:{mon..sun}, imageUrl, week_end, services:[string], updatedAt }`.
Indexes: `{ city:1 }`, `2dsphere` on coords for geo queries.
Usage: Showrooms page, pickup selection in checkout, nearest showroom lookups.

Sample:
```json
{ "_id":"S222","code":"S222","city":"دمشق","name":"البرامكة","address":"...","phone":"011-9909","coords":{"lat":33.5064,"lng":36.285} }
```

---

### 10) `pages` (CMS)
Per-locale page content for static pages: `{ _id:"home|en", key:"home", locale:"en", html:"..", blocks:[...], seo:{}}`.
Usage: home, about, legal, faq.

---

### 11) `translations`
UI strings per-locale (also can be static JSON files). `{ locale:"en", strings: {...}, updatedAt }`.
Usage: client i18n bundle and server-side text.

---

### 12) `assets`
Image metadata and responsive srcsets: `{ _id, originalUrl, cdnPaths:{"1200":"...","600":"..."}, width, height, aspect, altEn, altAr, tags }`.
Usage: image srcset generation and validation.

---

### 13) `notifications`
Queued & delivered notifications: `{ _id, targetUserId?, channels:["email","push","inapp"], template, payload, status:"pending|sent|failed", attempts, lastAttemptAt, createdAt }`.
Usage: in-app badges/unread counts, push/email delivery.

---

### 14) `webhooks/events` (change/invalidation queue)
Event queue storing tasks for workers: `{ _id, type:"product.updated", payload:{ productId }, status:"pending", attempts, runAfter }`.
Workers pick pending events to regenerate read-models and call CDN invalidation.

---

### 15) `analytics_events` (optional)
Store RUM or event logs for analysis: short retention, or stream to analytics system.

---

### 16) `admin_audit`
Audit trail for admin changes: `{ _id, actorUserId, action, objectType, objectId, before, after, at }`.

---

## Indexes summary
- `products`: `{ slug:1 } unique`, `{ sku:1 } unique`, `{ categories:1 }`, text index on searchable fields.
- `products_read`: `{ _id:1 }` (slug|locale), `{ productId:1 }`.
- `categories`: `{ slug:1 }`.
- `offers`: `{ code:1 } unique`, `{ active:1, startAt:1, endAt:1 }`.
- `orders`: `{ orderNumber:1 } unique`, `{ userId:1, createdAt:-1 }`.
- `users`: `{ email:1 } unique`.
- `showrooms`: `{ city:1 }`, `2dsphere` on `coords`.
- `webhooks/events`: `{ status:1, runAfter:1 }`.

Consider Redis caches for hot `products_read` documents and counters (unread notifications, cart counts).

---

## Change flows & worker responsibilities
1. Admin edits a product (write to `products`).
2. Write triggers an event (change-stream or push to `webhooks/events`).
3. Background worker consumes event, regenerates `products_read` for affected locales/variants, updates search index, writes any derived static JSON files, and enqueues CDN invalidation.
4. CDN invalidation or versioned path promotion ensures new payloads served at edge.

Idempotency: worker jobs should be idempotent and use `attempts` counters + dead-letter handling.

---

## Minimal queries per page (performance checklist)
To keep page requests minimal and fast, front-end pages should read small, precomputed payloads. Below are recommended single-document reads (or small, cached endpoints) per page:

- Product Detail Page:
  - Read `products_read` by `_id` (slug|locale) from CDN/Redis or the DB. This single document contains all images, specs (EN/AR), inTheBox (EN/AR), offersSnapshot and precomputed price displays. No additional DB joins required.
  - If dynamic stock or realtime price is required, call a small dynamic endpoint `/api/products/{id}/stock` that returns only stock/price TTL-sensitive fields.

- Category / Listing Page:
  - Read a precomputed listing JSON (`category_pages` or `categories_read`) containing paginated arrays of product summaries (id, slug, title, priceDisplay, primaryImage). Avoid per-item product reads.

- Home Page:
  - Read `home_page` (single JSON) for hero banners, featured product summaries (id + read snapshot short fields), and translations.

- Search:
  - Query dedicated search index (Meili/Algolia/Elastic). Only fetch product summaries from search results (IDs + price + image). If necessary, fetch `products_read` for top N items by id in a batched request.

- Showrooms Page:
  - Serve a static JSON `showrooms.{locale}.json` from CDN (single file). For nearest search, call a geo endpoint that queries `showrooms` with a `near` geospatial index.

- Checkout Page:
  - Read cart summary (server-side `carts` doc or client session). For each item, use `products_read` only if additional display data is required; otherwise persist necessary snapshots (name, price, variantImage) in the `cart` to avoid reads.
  - At confirmation, server re-evaluates offers via `offers` collection and products stock via `products` master before writing `orders`.

- Account / Orders Page:
  - Query `orders` by `userId` paginated; each `orders` doc contains item snapshots and appliedOffers snapshot so UI can render without product joins.

- Admin pages (product edit):
  - Read `products` master for editing and use change-stream to trigger `products_read` regeneration. Admin may also fetch `products_read` for preview.

General principles:
- Always prefer single-document reads for page render.
- Keep TTL-sensitive values (stock/flash price) in separate small endpoints to allow long CDN TTLs for heavy payloads.
- Batch requests when you must fetch multiple `products_read` docs (use one request that accepts multiple ids and returns array).

---

## Static JSON files for low-change data
For data that changes infrequently (site metadata, showrooms, category lists, translations), publish versioned JSON files to the CDN under `public/static/` and serve them directly to the client. Examples created in this repo:
- `/static/showrooms.json` — grouped showrooms structure for the Showrooms page.
- `/static/site-static.json` — site-level metadata, category names, and other editable non-frequent content.

Advantages:
- Zero DB reads at runtime for these pages.
- Easy manual editing or CI-driven update and CDN invalidation.


---

## Checkout & offers
- At checkout, server should read `products_read` for display and to minimize lookups, but re-evaluate `offers` and `stock` using master collections to ensure correctness.
- Apply offers deterministically and persist `appliedOffers` snapshots to the `orders` document for audit.
- Use transactions for stock decrement if running on MongoDB replica set supporting multi-doc transactions.

---

## Search
- Use a dedicated search index (Meili/Algolia/Elastic) synced from `products`.
- Fields: nameEn/nameAr, tags, specs keywords, categories, brand, price, inStock.
- For facets (price range, brand, category), precompute attribute buckets during read-model generation.

---

## Caching & CDN
- Serve `products_read` as JSON from CDN with long TTL and versioned URLs (`/products/{slug}.{locale}.json?v={hash}`).
- Use `stale-while-revalidate` at edge if supported to avoid cold-cache latency.
- For highly dynamic fields (stock, price during flash sale) use short TTL or a separate dynamic endpoint that merges into client-side hydration.

---

## Migration suggestions
1. Export existing product dataset to JSON.
2. Normalize fields into `products` master shape (ensure bilingual fields exist, specs normalized, inTheBox as objects).
3. Run a job to create `products_read` docs for each locale (en/ar) using templates.
4. Validate product pages for a small set (smoke test), then roll out incrementally.

---

## Operational & monitoring
- Metrics: worker job durations, queue depths, CDN invalidation latency, products_read generation TPS, cache hit ratio, API latency.
- Alerts: worker failures > threshold, low cache-hit rate, high queue backlogs, high error-rate.
- Backups: daily snapshots, point-in-time restore retention policy.

---

## Next steps / artifacts you may want me to create
- Concrete JSON Schema (JSON Schema draft) for each collection.
- `mongo` `createIndex()` commands for all recommended indexes.
- Worker pseudo-code (Node + BullMQ) for change->regen->invalidate flow.
- Example migration scripts to transform current `src/data/products.ts` into `products` docs.

Tell me which artifact you need next and I will generate it (JSON schema, indexes, worker code, or migration script).\\
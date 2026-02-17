# MongoDB Structure (Performance-First) for the Current MABCO Website

This document is the updated MongoDB blueprint for the **current edited website** (home/catalog/offers/search/showrooms/checkout/account/admin/super-admin reports/services).

It includes:
- Complete collection design.
- Fields needed by admin + super-admin reporting pages.
- Required edits to existing objects so reports can be generated accurately.
- Route/page coverage check so no page is missed.
- Index/read-model strategy focused on performance.

---

## 1) Architecture Principles

1. Use **write models** for authoritative data (`products`, `orders`, `users`, etc.).
2. Use **read models/materialized views** for UI pages (`home_read`, `product_detail_read`, `category_brand_read`, etc.).
3. Keep analytics/audit append-only in dedicated collections (`admin_actions`, `web_events`, `notification_events`).
4. Generate reports from **daily rollups** (`report_daily_kpis`) instead of scanning large raw event collections.
5. Keep mutable hot fields (stock/price/status) small and indexed.

---

## 2) Page Coverage (Rechecked)

All current routes/features and required data sources:

- `/` Home: `home_read`, `categories`, `brands`, `offers`, `products_read`, `services_catalog`, `site_content`.
- `/products`, `/search`: `search_index` (or Atlas Search on `products`), `products_read` summaries.
- `/product/:id`: `product_detail_read` + optional dynamic stock/price endpoint from `inventory`.
- `/brand/:category/:id`, `/category/:id`: `category_brand_read` + `products_read` summaries.
- `/offers/:offerType`: `offers_read` + product snapshots.
- `/showrooms`: `showrooms` (or cached `showrooms_read`).
- `/checkout`: `carts`, `orders`, `inventory`, `offers`, `payments`.
- `/account/*`: `users`, `orders`, `devices`, `warranties`, `maintenance_tickets`, `invoices`.
- `/account/admin/content`: `products`, `categories`, `brands`, `assets`, `admin_actions`, `product_revisions`.
- `/account/admin/orders`: `orders`, `order_status_history`, `admin_actions`.
- `/account/superadmin`: `report_daily_kpis`, `admin_actions`, `users`.
- `/account/superadmin/admin-management`: `users`, `admin_roles`, `admin_privilege_history`.
- `/account/superadmin/product-tracking`: `product_revisions`, `admin_actions`, `products.visibility`.
- `/account/superadmin/analytics`: `report_daily_kpis`, `web_events`, `cart_events`, `notification_events`, `sales_rollups`.
- `/account/superadmin/notifications`: `notifications`, `notification_events`, `notification_deliveries`.
- Services in home (`printing`, `epayment`, `warranty`, `maintenance-status`): `service_requests`, `payment_transactions`, `warranties`, `maintenance_tickets`.

---

## 3) Core Write Collections

## 3.1 `products`
Canonical product record.

Key fields:
- `_id`, `sku` (unique), `slug` (unique)
- `name: { en, ar }`, `description: { en, ar }`
- `categoryIds: ObjectId[]`, `brandId: ObjectId`
- `pricing: { base, old, currency, taxClass }`
- `specs: [{ key: {en, ar}, value: {en, ar}, sortOrder }]`
- `variants: [{ code, color: {en, ar, hex}, images: [assetId], stockQty, priceDelta }]`
- `media: { primaryAssetId, galleryAssetIds: [] }`
- `status: { isActive, isHidden, hideReason, visibleFrom, visibleTo }`
- `metrics: { ratingAvg, ratingCount, soldCount30d, viewCount30d }`
- `audit: { createdBy, updatedBy, createdAt, updatedAt }`
- `version: number`

Indexes:
- `{ sku: 1 }` unique
- `{ slug: 1 }` unique
- `{ brandId: 1, categoryIds: 1, 'status.isActive': 1, 'status.isHidden': 1 }`
- `{ updatedAt: -1 }`
- Atlas Search index on localized name/description/specs

## 3.2 `categories`
- `_id`, `slug`, `name: {en, ar}`, `iconName`, `sortOrder`, `isActive`
- `seo`, `audit`
- Optional: `brandIds` (denormalized for fast category->brand menus)

Index: `{ slug: 1 }` unique, `{ isActive: 1, sortOrder: 1 }`

## 3.3 `brands`
- `_id`, `slug`, `name: {en, ar}`, `logoAssetId`, `imageAssetId`, `isActive`, `sortOrder`
- `categoryIds` (for quick mapping)

Index: `{ slug: 1 }` unique, `{ categoryIds: 1, isActive: 1 }`

## 3.4 `offers`
- `_id`, `code` unique
- `type: direct_discount|coupon|free_product|bundle_discount`
- `title: {en, ar}`, `description: {en, ar}`
- `scope: { allProducts, productIds, categoryIds, brandIds }`
- `rule`, `priority`, `stackable`
- `window: { startsAt, endsAt }`, `isActive`

Indexes:
- `{ code: 1 }` unique
- `{ isActive: 1, 'window.startsAt': 1, 'window.endsAt': 1 }`
- `{ 'scope.categoryIds': 1, 'scope.brandIds': 1 }`

## 3.5 `users`
- `_id`, `email` unique, `phone`
- `name: { first, last, full, fullAr }`
- `role: customer|admin|super_admin`
- `adminMeta: { level, privilegeSetId, isSuspended }`
- `preferences: { language, notificationChannels }`
- `stats: { totalOrders, totalSpent, lastLoginAt }`

Indexes:
- `{ email: 1 }` unique
- `{ role: 1, 'adminMeta.isSuspended': 1 }`

## 3.6 `orders`
- `_id`, `orderNumber` unique
- `userId`, `customerSnapshot`
- `items: [{ productId, sku, name, qty, unitPrice, discount, finalPrice, variantSnapshot }]`
- `pricing: { subtotal, discount, shipping, tax, total, currency }`
- `status: pending|confirmed|processing|shipped|out_for_delivery|delivered|cancelled|returned`
- `statusHistory: [{ from, to, at, byUserId, note }]`
- `payment`, `fulfillment`, `addresses`
- `appliedOffersSnapshot`
- `createdAt`, `updatedAt`

Indexes:
- `{ orderNumber: 1 }` unique
- `{ userId: 1, createdAt: -1 }`
- `{ status: 1, createdAt: -1 }`

## 3.7 `carts`
- `_id`, `userId` or `sessionId`
- `items[]`, `totalsSnapshot`, `appliedOffersPreview`
- `updatedAt`, `expiresAt`

Indexes:
- `{ userId: 1 }`, `{ sessionId: 1 }`
- TTL: `{ expiresAt: 1 }`

## 3.8 `showrooms`
- `_id`, `code`, `name: {en, ar}`, `city: {en, ar}`
- `address`, `phone`, `location: { type:'Point', coordinates:[lng,lat] }`
- `hours`, `services`, `isActive`

Indexes:
- `{ code: 1 }` unique
- `2dsphere` on `location`
- `{ isActive: 1, 'city.en': 1 }`

## 3.9 `notifications`
- `_id`, `type`, `title: {en, ar}`, `message: {en, ar}`
- `recipientType`, `recipientQuery` or `recipientIds`
- `channels`, `navigation`, `priority`
- `status: draft|scheduled|sent|failed`
- `scheduleAt`, `sentAt`, `createdBy`, `createdAt`
- `metrics: { sent, delivered, opened, clicked, dismissed }`

Indexes:
- `{ status: 1, scheduleAt: 1 }`
- `{ createdBy: 1, createdAt: -1 }`

## 3.10 `assets`
- `_id`, `storageKey`, `cdnUrl`, `variants`, `mimeType`, `size`
- `width`, `height`, `alt: {en, ar}`

Indexes: `{ storageKey: 1 }` unique

## 3.11 Service-related collections (missing before, required now)

### `warranties`
- `serialNumber` unique, `imei`, `userId`, `productId`, `purchaseOrderId`
- `coverageType`, `startsAt`, `endsAt`, `claimsUsed`, `maxClaims`, `isActive`

Index: `{ serialNumber: 1 }` unique, `{ userId: 1, endsAt: 1 }`

### `maintenance_tickets`
- `ticketNumber` unique, `serialNumber`, `userId`, `productSnapshot`
- `statusCode` (1..15), `statusLabel`, `timeline[]`, `technicianId`
- `receivedAt`, `eta`, `closedAt`

Index: `{ ticketNumber: 1 }` unique, `{ userId: 1, statusCode: 1, updatedAt: -1 }`

### `payment_transactions` (for e-payment service)
- `transactionId` unique, `provider`, `serviceType`, `accountRef`, `amount`, `status`
- `requestedBy`, `createdAt`, `settledAt`

Index: `{ transactionId: 1 }` unique, `{ status: 1, createdAt: -1 }`

### `service_requests` (printing/gaming/other service forms)
- `_id`, `type`, `userId`, `payload`, `status`, `assignedTo`, `createdAt`, `updatedAt`

Index: `{ type: 1, status: 1, createdAt: -1 }`

---

## 4) Admin + Super Admin Data Collections (Reporting)

## 4.1 `admin_actions`
Append-only audit for all admin/super-admin actions.

Fields:
- `_id`, `actorUserId`, `actorRole`, `actionType`
- `targetType`, `targetId`, `targetNameSnapshot`
- `changes: [{ field, oldValue, newValue }]`
- `requestMeta: { ip, userAgent, traceId }`
- `durationMs`, `status`, `note`, `createdAt`

Indexes:
- `{ actorUserId: 1, createdAt: -1 }`
- `{ targetType: 1, targetId: 1, createdAt: -1 }`
- `{ actionType: 1, createdAt: -1 }`

## 4.2 `product_revisions`
Version history for product tracking and edit-history modal.

Fields:
- `_id`, `productId`, `version`
- `snapshot` (minimal diff or full snapshot)
- `editedBy`, `editedAt`, `reason`

Indexes:
- `{ productId: 1, version: -1 }`
- `{ editedBy: 1, editedAt: -1 }`

## 4.3 `web_events` (time-series recommended)
For website traffic report.

Fields:
- `eventAt`, `sessionId`, `userId?`, `eventType` (page_view, click, search, add_to_cart, etc.)
- `path`, `referrer`, `deviceType`, `browser`, `country`, `city`
- `metadata`

Use MongoDB time-series:
- `timeField: eventAt`
- `metaField: { sessionId, userId, deviceType, country }`

Indexes:
- `{ eventAt: -1 }`
- `{ 'meta.userId': 1, eventAt: -1 }`

## 4.4 `cart_events` (time-series or append-only)
For conversion funnel reports.

Fields:
- `eventAt`, `userId?`, `sessionId`, `productId`, `action: added|removed|converted`
- `cartId`, `orderId?`, `qty`, `priceSnapshot`

Indexes:
- `{ productId: 1, eventAt: -1 }`
- `{ userId: 1, eventAt: -1 }`

## 4.5 `notification_events`
For notification analytics report.

Fields:
- `eventAt`, `notificationId`, `userId`, `channel`, `eventType: delivered|opened|clicked|dismissed`

Indexes:
- `{ notificationId: 1, eventType: 1, eventAt: -1 }`
- `{ userId: 1, eventAt: -1 }`

## 4.6 `report_daily_kpis` (materialized rollups)
Primary source for super-admin dashboard cards/charts.

Fields:
- `date` (UTC day)
- `traffic: { sessions, uniqueUsers, loggedInUsers, avgSessionSec, byDevice }`
- `sales: { orders, revenue, avgOrderValue, discountAmount, byStatus }`
- `notifications: { sent, delivered, opened, clicked, dismissed }`
- `admin: { actionCount, byType, byAdmin }`
- `products: { editedCount, hiddenCount, topEdited[] }`

Indexes:
- `{ date: 1 }` unique
- Optional monthly partition key if very large scale

---

## 5) Read Models for Fast UI

These are generated asynchronously from write collections:

- `home_read` (`home|en`, `home|ar`): hero banners, sections, category cards, offer blocks.
- `product_detail_read` (`{slug}|{locale}`): full PDP payload.
- `products_read`: card/list summaries for sliders/search/category.
- `category_brand_read` (`{categorySlug}|{locale}`): category with brand cards for home/footer/nav.
- `offers_read` (`{offerType}|{locale}`): offer page payload.
- `showrooms_read` (`showrooms|{locale}`): cached showroom payload.
- `footer_read` (`footer|{locale}`): category/brand/footer links.

Read model indexes:
- `_id` unique on each read collection.
- Keep docs compact and cacheable.

---

## 6) Required Edits to Existing Objects (Important)

To enable accurate reports and admin features, apply these object edits:

1. `products` add:
- `status.isHidden`, `status.hideReason`, `audit.updatedBy`, `version`.
- Reason: product tracking, hidden/visible stats, edit history.

2. `orders` add:
- `statusHistory[]`, `appliedOffersSnapshot`, `updatedByAdminId` (for manual status updates).
- Reason: sales status-change log report + audit-safe totals.

3. `users` add:
- `role`, `adminMeta.privilegeSetId`, `adminMeta.level`, `adminMeta.isSuspended`.
- Reason: admin management page and privilege editing.

4. `notifications` add:
- `metrics` counters + immutable delivery events in `notification_events`.
- Reason: open/click/dismiss reports without heavy recompute.

5. `showrooms` add:
- geospatial `location` and normalized `isActive`.
- Reason: performant map/filter/nearest queries.

6. `offers` add:
- `priority`, `stackable`, normalized `scope`.
- Reason: deterministic checkout calculation and offer reports.

7. Add new collections:
- `admin_actions`, `product_revisions`, `web_events`, `cart_events`, `notification_events`, `report_daily_kpis`, `warranties`, `maintenance_tickets`, `payment_transactions`, `service_requests`.

---

## 7) Performance & Scale Recommendations

1. Prefer read models + CDN for home/category/brand/offers/showrooms/footer payloads.
2. Use Atlas Search for multilingual product search/facets.
3. Use time-series collections for high-volume events (`web_events`, `cart_events`, `notification_events`).
4. Build daily rollups (`report_daily_kpis`) every hour + end-of-day finalize.
5. Keep raw events TTL-retained (example: 90-180 days), keep rollups long-term.
6. Use partial indexes for active data (example: active offers, non-deleted products).
7. Keep admin audit append-only and immutable.
8. Avoid joins at request time; precompute read models asynchronously.

---

## 8) Suggested Index Commands (Core)

```javascript
// products
 db.products.createIndex({ sku: 1 }, { unique: true })
 db.products.createIndex({ slug: 1 }, { unique: true })
 db.products.createIndex({ brandId: 1, categoryIds: 1, 'status.isActive': 1, 'status.isHidden': 1 })

// orders
 db.orders.createIndex({ orderNumber: 1 }, { unique: true })
 db.orders.createIndex({ userId: 1, createdAt: -1 })
 db.orders.createIndex({ status: 1, createdAt: -1 })

// admin actions
 db.admin_actions.createIndex({ actorUserId: 1, createdAt: -1 })
 db.admin_actions.createIndex({ targetType: 1, targetId: 1, createdAt: -1 })

// notifications + events
 db.notifications.createIndex({ status: 1, scheduleAt: 1 })
 db.notification_events.createIndex({ notificationId: 1, eventType: 1, eventAt: -1 })

// report rollups
 db.report_daily_kpis.createIndex({ date: 1 }, { unique: true })
```

---

## 9) Migration Checklist (from current static/mocked setup)

1. Migrate static files (`categories.json`, `brands.json`, `showrooms.json`, `site-static.json`) into master collections.
2. Add missing fields listed in section 6.
3. Create read-model generator workers.
4. Start writing admin actions + product revisions from admin pages.
5. Start collecting web/cart/notification events.
6. Build `report_daily_kpis` job and switch super-admin pages to rollups.
7. Add TTL/retention policies to raw events.

---

## 10) Notes

- This schema is intentionally designed for the current UI and routes.
- If a page still reads local static/mock data, map it to the corresponding collection above before backend rollout.
- Keep API responses thin and page-specific; avoid generic large payload endpoints.

# MongoDB Collections

Consolidated collection structures (single file).

# `admin_actions`

## Fields
- `actorUserId`
- `actorRole`
- `actionType`
- `targetType`
- `targetId`
- `changes[]`
- `requestMeta`
- `durationMs`
- `status`
- `note`
- `createdAt`

## Indexes
- `actor/date`
- `target/date`
- `action/date`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `assets`

## Fields
- `storageKey`
- `cdnUrl`
- `sourceType` (`external | local_upload`)
- `local.publicUrl` (for local uploads, e.g. `/uploads/file.jpg`)
- `local.diskPath`
- `local.fileName`
- `variants`
- `mimeType`
- `size`
- `width`
- `height`
- `alt.en/ar`

## Indexes
- `{ storageKey: 1 } unique`
- `{ cdnUrl: 1 } unique`
- `{ sourceType: 1 }`
- `{ local.publicUrl: 1 } unique sparse`

## Notes
- Created/updated by `npm run db:init` (update mode).
- Seed script stores **all non-product images** from current client data sources.
- Product images are intentionally excluded.
- Local server uploads are supported by storing `cdnUrl` + `local.*` metadata (`sourceType=local_upload`).

---

# `brands`

## Fields
- `brand_code` (string primary business key)
- `slug`
- `name.en/ar`
- `cat_code` (primary linked category code)
- `cat_codes[]` (multi-category link by code)
- `categoryIds` (optional ObjectId refs for admin filters)
- `image`
- `isActive`
- `sortOrder`

## Indexes
- `{ brand_code: 1 } unique`
- `{ slug: 1 } unique sparse`
- `{ cat_code: 1, isActive: 1 }`
- `{ cat_codes: 1, isActive: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `cart_events`

## Fields
- `eventAt`
- `meta`
- `productId`
- `action`
- `cartId`
- `orderId`
- `qty`
- `priceSnapshot`

## Indexes
- `{ eventAt: -1 }`
- `{ meta.productId: 1, eventAt: -1 }`
- `{ meta.userId: 1, eventAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `carts`

## Fields
- `userId/sessionId`
- `items[].quantity|qty (1..2)`
- `limits.maxPurchaseQuantityPerItem`
- `totalsSnapshot`
- `expiresAt`
- `updatedAt`

## Indexes
- `{ userId: 1 }`
- `{ sessionId: 1 }`
- `TTL { expiresAt: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `categories`

## Fields
- `cat_code` (string primary business key)
- `slug`
- `name.en/ar`
- `iconName`
- `sortOrder`
- `isActive`
- `seo`
- `audit`

## Indexes
- `{ cat_code: 1 } unique`
- `{ slug: 1 } unique sparse`
- `{ isActive: 1, sortOrder: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `category_brand_read`

## Fields
- `_id`
- `categoryId`
- `locale`
- `category + brands payload`

## Indexes
- `{ _id: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `footer_read`

## Fields
- `_id`
- `locale`
- `footer payload`

## Indexes
- `{ _id: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `home_read`

## Fields
- `_id`
- `locale`
- `page payload`

## Indexes
- `{ _id: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `maintenance_tickets`

## Fields
- `ticketNumber`
- `serialNumber`
- `userId`
- `productSnapshot`
- `statusCode`
- `statusLabel`
- `timeline`
- `technicianId`
- `receivedAt`
- `eta`
- `closedAt`

## Indexes
- `{ ticketNumber: 1 } unique`
- `{ userId: 1, statusCode: 1, updatedAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `notification_events`

## Fields
- `eventAt`
- `meta(notificationId,userId)`
- `channel`
- `eventType`

## Indexes
- `notification/date`
- `user/date`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `notifications`

## Fields
- `type`
- `title.en/ar`
- `message.en/ar`
- `recipientType/query`
- `channels`
- `navigation`
- `priority`
- `status`
- `scheduleAt`
- `metrics`

## Indexes
- `{ status: 1, scheduleAt: 1 }`
- `{ createdBy: 1, createdAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `offers`

## Fields
- `code`
- `type`
- `titleEn`
- `titleAr`
- `descriptionEn`
- `descriptionAr`
- `discountType`
- `discountValue`
- `couponValue`
- `eligibleProductIds[]`
- `validityDays?`
- `freeProductId`
- `discountPercentage`
- `relatedProductIds[]`
- `content.*` (optional normalized format)
- `definition` (optional normalized format)
- `priority`
- `window.startsAt/endsAt`
- `isActive`
- `scope?`

## Indexes
- `{ code: 1 } unique`
- `{ type: 1, isActive: 1, window range }`
- `{ priority: -1, createdAt: -1 }`
- `legacy target indexes (eligible/related/free product)`
- `definition-target indexes`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.
- Compatible with current website offer shape used in `client/src/data/products.ts`.

---

# `offers_read`

## Fields
- `_id`
- `offerType`
- `locale`
- `offer page payload`

## Indexes
- `{ _id: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `orders`

## Fields
- `orderNumber`
- `userId`
- `items[].qty (1..2)`
- `pricing`
- `status`
- `statusHistory`
- `payment`
- `fulfillment`
- `appliedOffersSnapshot`
- `createdAt/updatedAt`

## Indexes
- `{ orderNumber: 1 } unique`
- `{ userId: 1, createdAt: -1 }`
- `{ status: 1, createdAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `payment_transactions`

## Fields
- `transactionId`
- `provider`
- `serviceType`
- `accountRef`
- `amount`
- `status`
- `requestedBy`
- `createdAt`
- `settledAt`

## Indexes
- `{ transactionId: 1 } unique`
- `{ status: 1, createdAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `product_detail_read`

## Fields
- `_id`
- `productId`
- `locale`
- `detail payload`

## Indexes
- `{ _id: 1 }`
- `{ productId: 1, locale: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `product_revisions`

## Fields
- `productId`
- `version`
- `snapshot`
- `editedBy`
- `editedAt`
- `reason`

## Indexes
- `{ productId: 1, version: -1 }`
- `{ editedBy: 1, editedAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `product_visibility_events`

## Fields
- `productId`
- `action(hidden|shown)`
- `actorUserId`
- `actorRole`
- `reason`
- `createdAt`

## Indexes
- `product/date`
- `actor/date`
- `action/date`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `products`

## Fields
- `stk_code` (string primary business key)
- `id` (legacy numeric id from current frontend data)
- `sku`
- `slug`
- `name` / `nameAr` (legacy shape) and/or localized object shape
- `description` / `descriptionAr`
- `basePrice`
- `price`
- `oldPrice`
- `image`
- `category` / `categoryAr`
- `cat_code`
- `cat_codes[]`
- `brand`
- `brand_code`
- `brand_codes[]` (supports multi-brand linkage)
- `rating` / `reviews`
- `badge`, `isMostSold`, `isNew`, `isHot`
- `colorVariants[]` (`name`, `nameAr`, `hexCode`, `image`, `images[]`, `sku`, `stock|inStock|isAvailable`)
- `categoryIds`
- `brandId`
- `pricing`
- `chargeOptions[]`
- `specs[]`
- `specifications[]`
- `offers[]` (same typed offer structure used in frontend)
- `availability.isAvailable`
- `variants[].isAvailable`
- `status`
- `audit`
- `version`

## Indexes
- `{ stk_code: 1 } unique`
- `{ sku: 1 } unique`
- `{ slug: 1 } unique`
- `{ id: 1 } unique`
- `{ cat_code: 1 }`
- `{ cat_codes: 1 }`
- `{ brand_code: 1 }`
- `{ brand_codes: 1 }`
- `{ brandId: 1, categoryIds: 1, status flags }`
- `{ category: 1, brand: 1 }`
- `{ availability.isAvailable: 1, status.isHidden: 1 }`
- `{ colorVariants.name: 1, colorVariants.isAvailable: 1 }`
- `charge options indexes`
- `{ updatedAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.
- Validator keeps compatibility with the currently working dataset in `client/src/data/products.ts`.

---

# `products_read`

## Fields
- `_id`
- `productId`
- `locale`
- `card/list payload`

## Indexes
- `{ _id: 1 }`
- `{ productId: 1, locale: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `report_daily_kpis`

## Fields
- `date`
- `traffic`
- `sales`
- `notifications`
- `admin`
- `products`

## Indexes
- `{ date: 1 } unique`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `saved_spec_titles`

## Fields
- `name.en/ar`
- `icon`
- `usageCount`
- `category?`
- `nameEnNormalized?`
- `status.isActive`
- `audit`

## Indexes
- `name indexes`
- `usageCount desc`
- `nameEnNormalized unique sparse`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `service_requests`

## Fields
- `type`
- `userId`
- `payload`
- `status`
- `assignedTo`
- `createdAt`
- `updatedAt`

## Indexes
- `{ type: 1, status: 1, createdAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `showrooms`

## Fields
- `code`
- `name.en/ar`
- `city.en/ar`
- `address`
- `phone`
- `location(Point)`
- `hours`
- `services`
- `isActive`

## Indexes
- `{ code: 1 } unique`
- `2dsphere(location)`
- `{ isActive: 1, city.en: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `showrooms_read`

## Fields
- `_id`
- `locale`
- `showroom payload`

## Indexes
- `{ _id: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `site_content`

## Fields
- `key`
- `locale`
- `content`

## Indexes
- `{ _id: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `users`

## Fields
- `email`
- `phone`
- `name`
- `role`
- `adminMeta.level`
- `adminMeta.privilegeSetId`
- `adminMeta.isSuspended`
- `adminMeta.allowAllCategories`
- `adminMeta.allowAllBrands`
- `adminMeta.allowedCategoryIds[]`
- `adminMeta.allowedBrandIds[]`
- `preferences`
- `stats`

## Indexes
- `{ email: 1 } unique`
- `{ role: 1, adminMeta.isSuspended: 1 }`
- `{ role: 1, adminMeta.allowAllCategories: 1, adminMeta.allowedCategoryIds: 1 }`
- `{ role: 1, adminMeta.allowAllBrands: 1, adminMeta.allowedBrandIds: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.
- Category/brand permissions are stored per admin user under `adminMeta`.

---

# `warranties`

## Fields
- `serialNumber`
- `imei`
- `userId`
- `productId`
- `purchaseOrderId`
- `coverageType`
- `startsAt`
- `endsAt`
- `claimsUsed`
- `maxClaims`
- `isActive`

## Indexes
- `{ serialNumber: 1 } unique`
- `{ userId: 1, endsAt: 1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

---

# `web_events`

## Fields
- `eventAt`
- `meta(sessionId,userId,device,country)`
- `eventType`
- `path`
- `referrer`
- `metadata`

## Indexes
- `{ eventAt: -1 }`
- `{ meta.userId: 1, eventAt: -1 }`

## Notes
- Created/updated by `npm run db:init` (update mode).
- No static seed data is inserted by schema scripts.

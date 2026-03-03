# offers

## Key Fields
- `code` unique
- `type`: `direct_discount | coupon | free_product | bundle_discount`
- `titleEn`, `titleAr`, `descriptionEn`, `descriptionAr`
- `discountType`, `discountValue`
- `couponValue`, `eligibleProductIds[]`, `validityDays`
- `freeProductId`
- `discountPercentage`, `relatedProductIds[]`
- optional normalized: `content`, `definition`, `scope`, `window`, `priority`
- `isActive`

## Indexes
- `{ code: 1 }` unique
- `{ type: 1, isActive: 1, window.startsAt: 1, window.endsAt: 1 }`
- `{ priority: -1, createdAt: -1 }`

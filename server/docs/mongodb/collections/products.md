# products

## Purpose
Canonical product catalog document used across storefront, admin, cart, checkout, and reports.

## Key Fields
- `stk_code` (string, business primary key)
- `id` (legacy id, optional: number or string)
- `slug`
- `name`, `nameAr`
- `description`, `descriptionAr`
- `price`
- `image`
- `category`, `categoryAr`, `cat_code`, `cat_codes[]`
- `brand`, `brand_code`, `brand_codes[]`
- `rating`, `reviews`, badges
- `availability.isAvailable`
- `colorVariants[]`
: `stk_code`, `price`, `offers[]`, `color_name`, `color_name_ar`, `color_hex`, `in_stock`, `active`, `images[]`
- `chargeOptions[]`
: `stk_code`, `price`, `offers[]`, `name`, `name_ar`, `in_stock`, `active`
- `specs[]`
: `title`, `titleAr`, `value`, `valueAr`, `icon`
: `icon` can be either
: 1) React icon key string (`"Battery"`)
: 2) object `{ type: "react_icon"|"url", key?, url? }`
- `inTheBox[]`
: supports simple string or localized object
: `{ en?, ar?, nameEn?, nameAr?, valueEn?, valueAr? }`
- `offers[]`
- `status`, `audit`, `version`

## Indexes
- `{ stk_code: 1 }` unique
- `{ slug: 1 }` sparse
- `{ id: 1 }` unique sparse
- `{ cat_code: 1 }`, `{ cat_codes: 1 }`
- `{ brand_code: 1 }`, `{ brand_codes: 1 }`
- `{ brandId: 1, categoryIds: 1, status flags }`
- `{ category: 1, brand: 1 }`
- `{ availability.isAvailable: 1, status.isHidden: 1 }`
- `{ colorVariants.name: 1, colorVariants.isAvailable: 1 }`
- `{ chargeOptions.isActive: 1, chargeOptions.sortOrder: 1 }`
- `{ chargeOptions.id: 1 }`
- `{ updatedAt: -1 }`

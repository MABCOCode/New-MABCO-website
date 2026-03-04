# offers

## Key Fields
- `offer_no` unique
- `offer_type`: `direct_discount | coupon | free_product | bundle_discount`
- `mainproductstk_code` (only for offers collection)
- `discount`, `discount_type`
- `title`, `title_ar`, `description`, `description_ar`
- `products[]` (stk_code list)
- `start`, `end`
- `is_active`

## Indexes
- `{ offer_no: 1 }` unique
- `{ offer_type: 1, is_active: 1, start: 1, end: 1 }`
- `{ mainproductstk_code: 1 }`
- `{ products: 1 }`

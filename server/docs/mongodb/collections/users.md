# users

## Key Fields
- `email` unique
- `phone`
- `name`
- `role`
- `adminMeta` (permission scope, suspension, category/brand access)
- `preferences`, `stats`

## Indexes
- `{ email: 1 }` unique
- `{ role: 1, adminMeta.isSuspended: 1 }`
- `{ role: 1, adminMeta.allowAllCategories: 1, adminMeta.allowedCategoryIds: 1 }`
- `{ role: 1, adminMeta.allowAllBrands: 1, adminMeta.allowedBrandIds: 1 }`

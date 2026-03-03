# brands

## Key Fields
- `brand_code` (string primary business key)
- `slug`
- `name.en`, `name.ar`
- `cat_code`, `cat_codes[]`
- `image`
- `isActive`, `sortOrder`

## Indexes
- `{ brand_code: 1 }` unique
- `{ slug: 1 }` unique sparse
- `{ cat_code: 1, isActive: 1 }`
- `{ cat_codes: 1, isActive: 1 }`

# categories

## Key Fields
- `cat_code` (string primary business key)
- `slug`
- `name.en`, `name.ar`
- `iconName`
- `sortOrder`
- `isActive`

## Indexes
- `{ cat_code: 1 }` unique
- `{ slug: 1 }` unique sparse
- `{ isActive: 1, sortOrder: 1 }`

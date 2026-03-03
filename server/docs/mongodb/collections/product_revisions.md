# product_revisions

## Key Fields
- `productId`
- `version`
- `snapshot`
- `editedBy`, `editedAt`, `reason`

## Indexes
- `{ productId: 1, version: -1 }`
- `{ editedBy: 1, editedAt: -1 }`

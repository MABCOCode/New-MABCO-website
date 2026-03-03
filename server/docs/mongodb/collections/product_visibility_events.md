# product_visibility_events

## Key Fields
- `productId`
- `action` (`hidden|shown`)
- `actorUserId`, `actorRole`
- `reason`
- `createdAt`

## Indexes
- `{ productId: 1, createdAt: -1 }`
- `{ actorUserId: 1, createdAt: -1 }`
- `{ action: 1, createdAt: -1 }`

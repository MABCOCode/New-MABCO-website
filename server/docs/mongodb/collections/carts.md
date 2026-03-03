# carts

## Key Fields
- `userId` or `sessionId`
- `items[]`
- `limits.maxPurchaseQuantityPerItem`
- `totalsSnapshot`
- `expiresAt`, `updatedAt`

## Indexes
- `{ userId: 1 }`
- `{ sessionId: 1 }`
- TTL `{ expiresAt: 1 }`

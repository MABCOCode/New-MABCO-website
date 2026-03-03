# warranties

## Key Fields
- `serialNumber` unique
- `imei`, `userId`, `productId`, `purchaseOrderId`
- `coverageType`, `startsAt`, `endsAt`
- `claimsUsed`, `maxClaims`, `isActive`

## Indexes
- `{ serialNumber: 1 }` unique
- `{ userId: 1, endsAt: 1 }`

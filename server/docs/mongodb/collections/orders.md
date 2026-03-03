# orders

## Key Fields
- `orderNumber` unique
- `userId`
- `items[]`
- `pricing`
- `status`, `statusHistory[]`
- `payment`, `fulfillment`
- `appliedOffersSnapshot`

## Indexes
- `{ orderNumber: 1 }` unique
- `{ userId: 1, createdAt: -1 }`
- `{ status: 1, createdAt: -1 }`

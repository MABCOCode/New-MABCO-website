# payment_transactions

## Key Fields
- `transactionId` unique
- `provider`, `serviceType`
- `accountRef`, `amount`
- `status`, `requestedBy`, `createdAt`, `settledAt`

## Indexes
- `{ transactionId: 1 }` unique
- `{ status: 1, createdAt: -1 }`

# maintenance_tickets

## Key Fields
- `ticketNumber` unique
- `serialNumber`, `userId`
- `productSnapshot`
- `statusCode`, `statusLabel`, `timeline[]`
- `technicianId`, `receivedAt`, `eta`, `closedAt`

## Indexes
- `{ ticketNumber: 1 }` unique
- `{ userId: 1, statusCode: 1, updatedAt: -1 }`

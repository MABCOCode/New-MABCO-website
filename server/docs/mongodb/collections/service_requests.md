# service_requests

## Key Fields
- `type`
- `userId`
- `payload`
- `status`
- `assignedTo`
- `createdAt`, `updatedAt`

## Indexes
- `{ type: 1, status: 1, createdAt: -1 }`

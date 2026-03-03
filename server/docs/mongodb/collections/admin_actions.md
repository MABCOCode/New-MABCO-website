# admin_actions

## Key Fields
- `actorUserId`, `actorRole`
- `actionType`
- `targetType`, `targetId`
- `changes[]`
- `requestMeta`, `durationMs`, `status`, `note`, `createdAt`

## Indexes
- `{ actorUserId: 1, createdAt: -1 }`
- `{ targetType: 1, targetId: 1, createdAt: -1 }`
- `{ actionType: 1, createdAt: -1 }`

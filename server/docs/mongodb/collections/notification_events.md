# notification_events

## Time-Series
- `timeField`: `eventAt`
- `metaField`: `meta`
- `granularity`: `minutes`

## Key Fields
- `eventAt`
- `meta.notificationId`, `meta.userId`
- `channel`, `eventType`

## Indexes
- `{ meta.notificationId: 1, eventAt: -1 }`
- `{ meta.userId: 1, eventAt: -1 }`

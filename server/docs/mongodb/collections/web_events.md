# web_events

## Time-Series
- `timeField`: `eventAt`
- `metaField`: `meta`
- `granularity`: `minutes`

## Key Fields
- `eventAt`
- `meta` (`sessionId`, `userId`, device/country keys)
- `eventType`, `path`, `referrer`, `metadata`

## Indexes
- `{ eventAt: -1 }`
- `{ meta.userId: 1, eventAt: -1 }`

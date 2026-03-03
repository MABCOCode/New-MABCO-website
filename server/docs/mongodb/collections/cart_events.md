# cart_events

## Time-Series
- `timeField`: `eventAt`
- `metaField`: `meta`
- `granularity`: `minutes`

## Key Fields
- `eventAt`, `meta`
- `productId`, `action`
- `cartId`, `orderId`, `qty`, `priceSnapshot`

## Indexes
- `{ eventAt: -1 }`
- `{ meta.productId: 1, eventAt: -1 }`
- `{ meta.userId: 1, eventAt: -1 }`

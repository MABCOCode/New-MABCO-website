# showrooms

## Key Fields
- `code` unique
- `name.en/ar`
- `city.en/ar`
- `address`, `phone`
- `location` (`Point`)
- `hours`, `services`, `isActive`

## Indexes
- `{ code: 1 }` unique
- `2dsphere(location)`
- `{ isActive: 1, city.en: 1 }`

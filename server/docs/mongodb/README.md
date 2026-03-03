# MongoDB Collections

Source of truth for validators/indexes is `server/scripts/createMongoDB.js`.

Docs are now split per collection under:
- `server/docs/mongodb/collections/`

Entry points:
- [products](./collections/products.md)
- [offers](./collections/offers.md)
- [orders](./collections/orders.md)
- [carts](./collections/carts.md)
- [users](./collections/users.md)

Notes:
- Product structure is offer-driven for discounts (`offers` + `price`).
- Product specs are in `specs[]` and support icon key or URL payload.
- Product box contents are stored in `inTheBox[]`.

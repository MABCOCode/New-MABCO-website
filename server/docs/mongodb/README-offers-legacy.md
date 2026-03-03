# Offers Structure (Legacy)

This project uses a legacy offers shape for both:
- Embedded product offers: `products.offers[]`
- Offers collection: `offers` documents

The main difference:
- `mainproductstk_code` is ONLY for the offers collection, because the product document itself is the main product when offers are embedded in `products.offers`.

## Fields
- `offer_no`: string identifier (synced from external system).
- `offer_type`: one of `direct_discount`, `coupon`, `free_product`, `bundle_discount`.
- `mainproductstk_code`: string `stk_code` of the main product. Required only in offers collection.
- `discount`: number. Meaning depends on type:
  - `direct_discount`: discount value or percentage
  - `coupon`: coupon value
  - `bundle_discount`: discount percentage
  - `free_product`: use `0`
- `discount_type`: `p` for percent, `v` for value.
- `title`: English title.
- `title_ar`: Arabic title.
- `products`: array of `stk_code` strings for related/eligible products.
- `window.start`: ISO date string start.
- `window.end`: ISO date string end.
- `is_active`: boolean

## Example: Embedded Product Offers
```json
{
  "offers": [
    {
      "offer_no": "OFF-0001",
      "offer_type": "direct_discount",
      "discount": 15,
      "discount_type": "p",
      "title": "15% OFF Special Deal",
      "title_ar": "خصم 15% عرض خاص",
      "products": ["471524358527396"],
      "window": { "start": "2026-02-26T00:00:00.000Z", "end": "2026-03-05T23:59:59.999Z" },
      "is_active": true
    }
  ]
}
```

## Example: Offers Collection Document
```json
{
  "offer_no": "OFF-1001",
  "offer_type": "direct_discount",
  "mainproductstk_code": "471524358527396",
  "discount": 15,
  "discount_type": "p",
  "title": "15% OFF Special Deal",
  "title_ar": "خصم 15% عرض خاص",
  "products": ["471524358527396"],
  "window": { "start": "2026-02-26T00:00:00.000Z", "end": "2026-03-05T23:59:59.999Z" },
  "is_active": true
}
```

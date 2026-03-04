# banner_slides

## Purpose
Homepage banner slider content managed by admins.

## Key Fields
- `id` (number, unique)
- `image` (string)
- `url` (string, optional)
- `titleEn`, `titleAr`
- `subtitleEn`, `subtitleAr`
- `buttonTextEn`, `buttonTextAr`
- `order` (number)
- `isActive` (boolean)

## Indexes
- `{ id: 1 }` unique
- `{ isActive: 1, order: 1 }`

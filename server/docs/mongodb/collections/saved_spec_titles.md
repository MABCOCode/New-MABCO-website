# saved_spec_titles

## Purpose
Reusable saved specification titles for admin product editor autocomplete.

## Key Fields
- `name.en/ar`
- `icon` (icon key or URL)
- `usageCount`
- `category`
- `nameEnNormalized`
- `status.isActive`
- `audit`

## Indexes
- name indexes (`name.en`, `name.ar`)
- `{ usageCount: -1 }`
- `{ nameEnNormalized: 1 }` unique sparse

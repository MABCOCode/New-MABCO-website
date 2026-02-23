# MABCO Server

## Setup
1. `cd server`
2. `npm install`
3. copy `.env.example` to `.env` and edit values
4. initialize database schema (non-destructive update mode): `npm run db:init`
5. optional full reset (drops and recreates collections): `npm run db:reset`
6. start dev server: `npm run dev`

## MongoDB Schema Docs
- Collection-by-collection notes: `server/docs/mongodb/README.md`

## API Base
- `http://localhost:5000/api`

## Main Endpoints
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/brands`
- `GET /api/offers`
- `GET /api/showrooms`
- `GET /api/orders`
- `GET /api/admin/reports/daily-kpis`
- `GET /api/admin/actions`
- `GET /api/admin/product-revisions/:productId`
- `GET /api/admin/users/:id/permissions`
- `PUT /api/admin/users/:id/permissions`

## Admin Security
- If `ADMIN_API_KEY` is set in `.env`, all `/api/admin/*` endpoints require header:
- `x-admin-key: <ADMIN_API_KEY>`

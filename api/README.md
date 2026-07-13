# Backend on Vercel (Node serverless functions)

This folder contains Vercel serverless functions implementing your Express API routes.

## Routes
Expected routes (mapped from your Express app):
- POST /api/signup
- POST /api/login
- GET /api/me
- GET /api/products
- GET /api/inventory
- PATCH /api/inventory/:id
- POST /api/orders/checkout
- GET /api/orders/history
- GET /api/transactions
- PATCH /api/transactions/:id/status
- GET /api/discounts
- POST /api/discounts/auth
- POST /api/discounts/:id/approve
- GET /api/notifications/discounts

## Notes
- Create one file per function.
- Use the same controller logic from `backend/`.
- Ensure auth middleware reads `Authorization: Bearer <token>`.
- Use `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `JWT_SECRET` env vars.


# TODO: Host Express backend on Vercel and connect to Vercel frontend (SEPARATE PROJECTS)

## Decision
- [x] Two Vercel projects (backend separate)

## 1) Create a Vercel project for the backend
- [ ] Add the `backend/` code as a separate Vercel project

## 2) Make the backend deployable on Vercel
Vercel for Node typically uses either:
- Vercel Functions (serverless) OR
- a framework adapter (not guaranteed for raw Express)

Given the current repo is a standalone Express server (`backend/server.js`), you will need to deploy it as serverless API routes (recommended), not as a long-running server.

- [ ] Create Vercel API handlers for each endpoint the frontend calls:
  - [ ] `POST /api/signup`
  - [ ] `POST /api/login`
  - [ ] `GET /api/me`
- [ ] Reuse existing controllers and auth middleware logic.

## 3) Environment variables on the backend Vercel project
Set the following in the backend project:
- [ ] `JWT_SECRET`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] (Email provider env vars used by `sendSignupConfirmationEmail`, if signup emails are enabled)

## 4) Environment variables on the frontend Vercel project
- [ ] Set `VITE_API_BASE_URL` to the backend project's domain, e.g.
  - `https://<backend-vercel-domain>`

Because the frontend code calls:
- `${VITE_API_BASE_URL}/api/login`
- `${VITE_API_BASE_URL}/api/signup`
- `${VITE_API_BASE_URL}/api/me`

## 5) CORS / Authorization correctness
- [ ] Ensure backend allows the frontend origin (or uses permissive CORS in dev)
- [ ] Ensure backend expects `Authorization: Bearer <token>` (it does via `authMiddleware`)

## 6) Test
- [ ] Login from deployed frontend returns `{ token, user }`
- [ ] `/api/me` returns the user when `Authorization` header is present

## 7) Iterate remaining endpoints
After auth works, repeat the same serverless handler approach for:
- products
- inventory
- orders
- transactions
- discounts


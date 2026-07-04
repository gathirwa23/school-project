# Backend Refactor TODO

- [ ] Create folder structure (config/, controllers/, models/, routes/, middleware/, data/)
- [ ] Create `backend/config/db.js` exporting Supabase client
- [ ] Create `backend/middleware/authMiddleware.js` (JWT verification)
- [ ] Create `backend/controllers/productController.js` (getProducts + getInventory)
- [ ] Create `backend/routes/productRoutes.js` mounting protected product/inventory routes
- [ ] Create `backend/models/Product.js` (row normalization + status)
- [ ] Create `backend/data/seedProducts.json` by migrating DEFAULT_PRODUCTS
- [ ] Create `backend/server.js` (move Express app + auth routes + mount product routes + listen)
- [ ] Update `backend/index.js` to become a small launcher to `server.js`
- [x] Update `backend/package.json` scripts to run `server.js`
- [x] Test: `node server.js` starts successfully




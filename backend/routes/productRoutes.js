const express = require('express')

const { getProducts, getInventory, updateInventoryStock } = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/api/products', authMiddleware, getProducts)
router.get('/api/inventory', authMiddleware, getInventory)
router.patch('/api/inventory/:id', authMiddleware, updateInventoryStock)

module.exports = router


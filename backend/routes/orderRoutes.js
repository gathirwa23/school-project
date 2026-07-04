const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const { checkoutOrders, getOrderHistory } = require('../controllers/orderController')

const router = express.Router()

// Checkout a cart (creates orders and updates inventory)
router.post('/api/orders/checkout', authMiddleware, checkoutOrders)

// Purchase history for the logged-in user
router.get('/api/orders/history', authMiddleware, getOrderHistory)

module.exports = router

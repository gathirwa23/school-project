const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const { listIssuedDiscounts, approveDiscount, createDiscountAuth, listOwnerDiscountNotifications } = require('../controllers/discountController')

const router = express.Router()

// Owner-only: list pending discount requests (drivers submit into `discount auth`)
router.get('/api/discounts', authMiddleware, listIssuedDiscounts)

// Driver: submit discount request for approval
router.post('/api/discounts/auth', authMiddleware, createDiscountAuth)

// Owner-only: approve a listed discount
router.post('/api/discounts/:id/approve', authMiddleware, approveDiscount)

// Owner: notifications (discount requests)
router.get('/api/notifications/discounts', authMiddleware, listOwnerDiscountNotifications)

module.exports = router



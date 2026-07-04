const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const { updateTransactionStatus, listTransactions } = require('../controllers/transactionController')

const router = express.Router()

// List all transactions (owner/driver)
router.get('/api/transactions', authMiddleware, listTransactions)

// Manually update transaction status (owner/driver)
router.patch('/api/transactions/:id/status', authMiddleware, updateTransactionStatus)

module.exports = router


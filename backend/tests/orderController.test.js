const test = require('node:test')
const assert = require('node:assert/strict')

const { buildOrderRecord } = require('../controllers/orderController')

test('buildOrderRecord uses schema-compatible fields for order writes', () => {
  const record = buildOrderRecord({
    userId: 'user-123',
    productName: 'Coffee Beans',
    price: 25,
    quantity: 2,
  })

  assert.deepEqual(record, {
    name: 'Coffee Beans',
    price: 25,
    quantity: 2,
    status: true,
  })
})

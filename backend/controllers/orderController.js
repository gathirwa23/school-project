const fs = require('node:fs')
const path = require('node:path')
const { supabase, supabaseAdmin } = require('../config/db')

const ORDER_HISTORY_FILE = path.join(__dirname, '..', 'data', 'orders.json')

function buildOrderRecord({ productName, price, quantity }) {
  return {
    name: productName,
    price: Number(price),
    quantity: Number(quantity),
    status: true,
  }
}

function normalizeOrderRow(order) {
  if (!order) return null

  const status = typeof order.status === 'boolean'
    ? (order.status ? 'completed' : 'pending')
    : String(order.status || 'completed')

  return {
    ...order,
    status,
  }
}

function readLocalOrderHistory() {
  try {
    if (!fs.existsSync(ORDER_HISTORY_FILE)) return []
    const raw = fs.readFileSync(ORDER_HISTORY_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    if (parsed && Array.isArray(parsed.orders)) return parsed.orders
  } catch (err) {
    console.warn('Unable to read local order history:', err.message)
  }
  return []
}

function writeLocalOrderHistory(orders) {
  try {
    fs.mkdirSync(path.dirname(ORDER_HISTORY_FILE), { recursive: true })
    fs.writeFileSync(ORDER_HISTORY_FILE, JSON.stringify({ orders }, null, 2))
  } catch (err) {
    console.warn('Unable to write local order history:', err.message)
  }
}

function createLocalOrderRecord({ userId, productName, price, quantity }) {
  return {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId: String(userId),
    name: productName,
    price: Number(price),
    quantity: Number(quantity),
    status: 'completed',
    created_at: new Date().toISOString(),
  }
}

async function checkoutOrders(req, res) {
  try {
    const { id, user_id } = req.user || {}
    const resolvedUserId = user_id || id
    if (!resolvedUserId) return res.status(401).json({ message: 'Missing user id in token' })

    const { cartItems } = req.body || {}
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'cartItems must be a non-empty array' })
    }

    // Normalize input: [{ productId, quantity }]
    const normalized = cartItems
      .map((it) => {
        const productId = it.productId ?? it.id ?? it.product_id ?? it.productId
        const quantity = Number(it.quantity ?? it.qty)
        if (productId === undefined) return null
        if (Number.isNaN(quantity) || quantity <= 0) return null
        return { productId, quantity }
      })
      .filter(Boolean)

    if (normalized.length === 0) {
      return res.status(400).json({ message: 'Invalid cartItems' })
    }

    // Fetch inventory rows for all products in cart
    const ids = [...new Set(normalized.map((x) => x.productId))]
    const { data: inventoryRows, error: invErr } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', ids)

    if (invErr) throw invErr
    const invById = new Map((inventoryRows || []).map((r) => [String(r.id), r]))

    // Validate stock & build order rows
    for (const item of normalized) {
      const row = invById.get(String(item.productId))
      if (!row) return res.status(404).json({ message: `Product not found: ${item.productId}` })

      const stockNum = typeof row.stock === 'number' ? row.stock : Number(row.stock)
      if (Number.isNaN(stockNum)) return res.status(500).json({ message: 'Invalid stock value' })
      if (stockNum < item.quantity) {
        return res.status(409).json({
          message: `Insufficient stock for ${row.name || row.product || item.productId}`,
        })
      }
    }

    // Create orders + decrement stock
    // Note: Supabase operations here aren't in a transaction; we do best-effort sequential updates.
    const createdOrders = []

    for (const item of normalized) {
      const row = invById.get(String(item.productId))
      const productName = row.name ?? row.product ?? String(item.productId)
      const unitPriceNum = typeof row.price === 'number' ? row.price : Number(row.price)

      const orderPayload = buildOrderRecord({
        productName,
        price: unitPriceNum,
        quantity: item.quantity,
      })

      let createdOrder = null
      const { data: orderInsert, error: orderErr } = await supabaseAdmin
        .from('order')
        .insert(orderPayload)
        .select()

      if (orderErr) {
        console.warn('Supabase order insert failed, using local fallback:', orderErr.message)
        createdOrder = createLocalOrderRecord({
          userId: resolvedUserId,
          productName,
          price: unitPriceNum,
          quantity: item.quantity,
        })
      } else if (orderInsert && orderInsert.length) {
        createdOrder = normalizeOrderRow(orderInsert[0])
      } else {
        throw new Error('Failed to create order')
      }

      if (!createdOrder) throw new Error('Failed to create order')
      createdOrders.push(createdOrder)

      // Record sale event (1 row per cart item / per created order line)
      // Table: `sale event`
      // Columns: sale_id, quantity, total amount

      const saleId = createdOrder?.id || `local-sale-${Date.now()}-${Math.random().toString(16).slice(2)}`
      const quantityNum = Number(item.quantity)
      const unitPrice = Number(unitPriceNum)
      const totalAmount = quantityNum * unitPrice
      const saleTime = new Date().toISOString()

      // Your `sale event` schema is: (sale_id, total amount, quantity)
      // So we only insert those columns here.
      const saleEventPayload = {
        sale_id: saleId,
        quantity: quantityNum,
        'total amount': totalAmount,
      }


      const { error: saleEventErr } = await supabaseAdmin
        .from('sales')
        .insert(saleEventPayload)


      if (saleEventErr) {
        // Do not fail the entire checkout if sale-event recording fails.
        console.warn('sale event insert failed:', saleEventErr.message)
      }

      const localOrders = readLocalOrderHistory()
      const nextLocalOrders = [...localOrders, createdOrder].filter(Boolean)
      writeLocalOrderHistory(nextLocalOrders)

      const stockNum = typeof row.stock === 'number' ? row.stock : Number(row.stock)
      const nextStock = stockNum - item.quantity

      const { error: stockErr } = await supabaseAdmin
        .from('products')
        .update({ stock: nextStock })
        .eq('id', item.productId)

      if (stockErr) throw stockErr
    }

    return res.json({ orders: createdOrders })
  } catch (err) {
    console.error('checkoutOrders error:', err)
    return res.status(500).json({ message: 'Checkout failed' })
  }
}

async function getOrderHistory(req, res) {
  try {
    const { id, user_id } = req.user || {}
    const resolvedUserId = user_id || id
    if (!resolvedUserId) return res.status(401).json({ message: 'Missing user id in token' })

    let orders = []
    const { data, error } = await supabase
      .from('order')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && Array.isArray(data)) {
      orders = data.map(normalizeOrderRow).filter(Boolean)
    } else {
      console.warn('Supabase order history query failed, using local fallback:', error?.message || 'unknown error')
    }

    const localOrders = readLocalOrderHistory()
    const filteredLocalOrders = localOrders.filter((order) => !resolvedUserId || String(order.userId) === String(resolvedUserId))

    const mergedOrders = [...orders, ...filteredLocalOrders]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

    return res.json({ orders: mergedOrders })
  } catch (err) {
    console.error('getOrderHistory error:', err)
    return res.status(500).json({ message: 'Failed to fetch order history' })
  }
}

module.exports = {
  buildOrderRecord,
  checkoutOrders,
  getOrderHistory,
}

 const { supabase, supabaseAdmin } = require('../config/db')
const { getDefaultProducts } = require('../legacy/productsFallback')
const { normalizeProducts } = require('../models/Product')

async function getProducts(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .order('id', { ascending: true })

    if (error) throw error

    const rows = (data || []).map((row) => ({
      id: row.id,
      product: row.name ?? row.product,
      name: row.name,
      price: row.price,
      stock: row.stock,
    }))

    const items = normalizeProducts(rows)
    return res.json({ items })
  } catch (err) {
    console.error('Get products error:', err)
    try {
      return res.json({ items: getDefaultProducts() })
    } catch (fallbackErr) {
      return res.status(500).json({ message: 'Failed to fetch products' })
    }
  }
}

async function getInventory(req, res) {
  try {
    // Dashboard expects inventory items:
    // { id, product, stock, price, status }
    // Your Supabase has the product name in `products.name` (type: text),
    // so we populate dashboard inventory from the `products` table.
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stock, price')
      .order('id', { ascending: true })

    if (error) throw error

    const items = (data || []).map((item) => {
      const stockNum = typeof item.stock === 'number' ? item.stock : Number(item.stock)
      let status = 'in-stock'
      if (stockNum === 0) status = 'out-of-stock'
      else if (stockNum < 20) status = 'low-stock'

      return {
        id: item.id,
        product: item.name ?? item.product,
        stock: stockNum,
        price: item.price,
        status,
      }
    })

    return res.json({ items })
  } catch (err) {
    console.error('Get inventory error:', err)
    try {
      return res.json({ items: getDefaultProducts() })
    } catch (fallbackErr) {
      return res.status(500).json({ message: 'Failed to fetch inventory' })
    }
  }
}

async function updateInventoryStock(req, res) {
  try {
    const { id } = req.params
    const { stock } = req.body

    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: 'Missing stock' })
    }

    const stockNum = typeof stock === 'number' ? stock : Number(stock)
    if (Number.isNaN(stockNum)) {
      return res.status(400).json({ message: 'Invalid stock' })
    }

    // Source of truth for dashboard/user inventory is `products.stock`.
    // Persist stock updates there so subsequent GET /api/inventory reflects changes.
    // Use service-role client to bypass RLS on products table.
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ stock: stockNum })
      .eq('id', id)
      .select('id, name, product, stock, price')

    if (error) throw error
    if (!data || !data.length) return res.status(404).json({ message: 'Product not found' })

    const updated = data[0]
    return res.json({
      item: {
        id: updated.id,
        product: updated.name ?? updated.product,
        stock: stockNum,
        price: updated.price,
      },
    })
  } catch (err) {
    console.error('Update inventory stock error:', err)
    return res.status(500).json({ message: 'Failed to update inventory stock' })
  }
}

module.exports = {
  getProducts,
  getInventory,
  updateInventoryStock,
}


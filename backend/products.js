// Simple in-memory product catalog + helpers.
// This is used as a fallback when Supabase table is not configured.

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Shampoo 500ml', price: 200, stock: 142 },
  { id: 2, name: 'Conditioner 1L', price: 300, stock: 28 },
  { id: 3, name: 'Hair oil 250ml', price: 150, stock: 7 },
  { id: 4, name: 'Treatment 200ml', price: 250, stock: 0 },
]

function statusFromStock(stock) {
  const stockNum = typeof stock === 'number' ? stock : Number(stock)
  if (stockNum === 0) return 'out-of-stock'
  if (stockNum < 20) return 'low-stock'
  return 'in-stock'
}

function mapProducts(rows) {
  return (rows || []).map((p) => {
    const stockNum = typeof p.stock === 'number' ? p.stock : Number(p.stock)
    return {
      id: p.id,
      product: p.name ?? p.product,
      price: p.price,
      stock: stockNum,
      status: statusFromStock(stockNum),
    }
  })
}

function getDefaultProducts() {
  return mapProducts(DEFAULT_PRODUCTS)
}

module.exports = {
  getDefaultProducts,
  mapProducts,
}


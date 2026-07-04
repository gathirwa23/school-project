// Backward-compatible fallback helpers.
// Keeps the current in-memory behavior equivalent to `backend/products.js`.

const seedProducts = require('../data/seedProducts.json')

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
  return mapProducts(seedProducts)
}

module.exports = {
  getDefaultProducts,
  mapProducts,
}


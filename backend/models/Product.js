function statusFromStock(stock) {
  const stockNum = typeof stock === 'number' ? stock : Number(stock)
  if (stockNum === 0) return 'out-of-stock'
  if (stockNum < 20) return 'low-stock'
  return 'in-stock'
}

function normalizeProduct(row) {
  const stockNum = typeof row.stock === 'number' ? row.stock : Number(row.stock)
  return {
    id: row.id,
    product: row.name ?? row.product,
    price: row.price,
    stock: stockNum,
    status: statusFromStock(stockNum),
  }
}

function normalizeProducts(rows) {
  return (rows || []).map(normalizeProduct)
}

module.exports = {
  statusFromStock,
  normalizeProduct,
  normalizeProducts,
}


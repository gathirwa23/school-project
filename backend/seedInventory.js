const { supabase } = require('./config/db')
const seedProducts = require('./data/seedProducts.json')

async function seedProductsTable() {
  // Seed into Supabase products table: id, name, stock, price
  // Existing rows are left untouched; we upsert by id.
  const rows = (seedProducts || []).map((p) => ({
    id: p.id,
    name: p.name ?? p.product,
    stock: p.stock,
    price: p.price,
  }))

  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error('Seed products table error:', error)
    process.exit(1)
  }

  console.log(`Seeded products table with ${rows.length} products.`)
  process.exit(0)
}

seedProductsTable().catch((e) => {
  console.error(e)
  process.exit(1)
})

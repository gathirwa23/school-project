require('dotenv').config()

const { supabase } = require('./config/db')
const seedProducts = require('./data/seedProducts.json')

async function seed() {
  // Adjust these table/column names to match your Supabase schema.
  // This seed targets `products(id, name, price, stock)` as used by productController.
  const rows = seedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
  }))

  console.log('Seeding products into Supabase...')

  // Upsert so re-running is safe.
  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }

  console.log(`✅ Seeded/updated ${rows.length} products into Supabase table: products`)

}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Seed script error:', e)
    process.exit(1)
  })


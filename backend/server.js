require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { supabase } = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const discountRoutes = require('./routes/discountRoutes')




const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Auth endpoints remain here to avoid behavior changes.
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

async function testConnection() {
  try {
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1)

    if (error) throw error

    console.log('✓ Connected to Supabase')
  } catch (err) {
    console.warn('⚠ Could not verify users table. Make sure it exists in Supabase dashboard.')
    console.warn('  Error:', err.message)
  }
}

app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })
  if (!role) return res.status(400).json({ message: 'Role is required' })

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existing && existing.email) return res.status(409).json({ message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const userId = Date.now().toString()

    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      name: name || '',
      email,
      password: hashed,
      role: role || 'user',
      created_at: new Date(),
    }).select()

    if (insertError) throw insertError

    // Send confirmation email (do not fail signup if email sending fails)
    try {
      console.log(`[signup] sending confirmation email to=${email}`)
      await sendSignupConfirmationEmail({ toEmail: email, toName: name })
      console.log(`[signup] confirmation email send attempt complete for=${email}`)
    } catch (emailErr) {
      console.warn('[signup] confirmation email failed:', emailErr?.message || emailErr)
    }


    const token = jwt.sign({ id: userId, email, role: role || 'user' }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      token,
      user: { id: userId, name: name || '', email, role: role || 'user' },
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: err.message || 'Signup failed' })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })

  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
})

const authMiddleware = require('./middleware/authMiddleware')
const { sendSignupConfirmationEmail } = require('./utils/sendSignupConfirmationEmail')

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', req.user.id)
      .single()

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error('Get user error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.use(productRoutes)
app.use(orderRoutes)
app.use(transactionRoutes)
app.use(discountRoutes)



testConnection()

app.listen(PORT, () => {
  console.log(`✓ Auth server listening on http://localhost:${PORT}`)
  console.log(`✓ Using Supabase`)
})


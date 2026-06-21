require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fladasxfssnhdpfdehmn.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_Z44r7LdZt-dOLedvKCCm6w_ExQvwyHJ'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

app.use(cors())
app.use(express.json())

// Test Supabase connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' }).limit(1)
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
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existing && existing.email) return res.status(409).json({ message: 'User already exists' })

    // Hash password
    const hashed = await bcrypt.hash(password, 10)
    const userId = Date.now().toString()

    // Insert user
    const { data: newUser, error: insertError } = await supabase.from('users').insert({
      id: userId,
      name: name || '',
      email,
      password: hashed,
      role: role || 'user',
      created_at: new Date(),
    }).select()

    if (insertError) throw insertError

    const token = jwt.sign({ id: userId, email, role: role || 'user' }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: userId, name: name || '', email, role: role || 'user' } })
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
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
})


function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Missing auth' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth' })
  const token = parts[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}


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

testConnection()

app.listen(PORT, () => {
  console.log(`✓ Auth server listening on http://localhost:${PORT}`)
  console.log(`✓ Using Supabase at ${SUPABASE_URL}`)
})


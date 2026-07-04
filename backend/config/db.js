require('dotenv').config()

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fladasxfssnhdpfdehmn.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_KEY in environment (.env).')
}

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : supabase

module.exports = { supabase, supabaseAdmin }



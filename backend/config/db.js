require('dotenv').config()

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL in environment')
if (!SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY in environment')
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment')

// Client used by normal user-facing requests
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Admin client used for inserts/updates (service role)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

module.exports = { supabase, supabaseAdmin }


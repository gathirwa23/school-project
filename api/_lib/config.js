require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Fail fast so we don't accidentally run with an insecure default.
  throw new Error('Missing JWT_SECRET env var');
}

// Supabase env vars may be required only by some routes.
if (!process.env.SUPABASE_URL) {
  // Let functions boot; controller code may still fall back in some cases.
}

module.exports = {
  JWT_SECRET,
};




require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

if (!process.env.SUPABASE_URL) {
  // Let functions boot; controller code may still fall back in some cases.
}

module.exports = {
  JWT_SECRET,
};


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { supabase } = require('../backend/config/db');
const { JWT_SECRET } = require('./_lib/config');

function json(res, status, body) {
  res.status(status).json(body);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return json(res, 405, { message: 'Method not allowed' });

    const { email, password } = req.body || {};
    if (!email || !password) return json(res, 400, { message: 'Missing fields' });

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) return json(res, 401, { message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return json(res, 401, { message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return json(res, 200, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('api/login error:', err);
    return json(res, 500, { message: 'Login failed' });
  }
};


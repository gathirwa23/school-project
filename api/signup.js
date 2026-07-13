const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { supabase } = require('./_lib/supabase');
const { JWT_SECRET } = require('./_lib/config');

const { sendSignupConfirmationEmail } = require('../backend/utils/sendSignupConfirmationEmail');

function json(res, status, body) {
  res.status(status).json(body);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return json(res, 405, { message: 'Method not allowed' });

    const { name, email, password, role } = req.body || {};
    if (!email || !password) return json(res, 400, { message: 'Missing fields' });
    if (!role) return json(res, 400, { message: 'Role is required' });

    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existing && existing.email) return json(res, 409, { message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        name: name || '',
        email,
        password: hashed,
        role: role || 'user',
        created_at: new Date(),
      })
      .select();

    if (insertError) throw insertError;

    try {
      await sendSignupConfirmationEmail({ toEmail: email, toName: name });
    } catch (emailErr) {
      console.warn('[signup] confirmation email failed:', emailErr?.message || emailErr);
    }

    const token = jwt.sign(
      { id: userId, email, role: role || 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return json(res, 201, {
      token,
      user: { id: userId, name: name || '', email, role: role || 'user' },
    });
  } catch (err) {
    console.error('api/signup error:', err);
    return json(res, 500, { message: err.message || 'Signup failed' });
  }
};


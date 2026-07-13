const jwt = require('jsonwebtoken');

const { supabase } = require('./_lib/supabase');
const { JWT_SECRET } = require('./_lib/config');

function json(res, status, body) {
  res.status(status).json(body);
}

function getBearerToken(req) {
  const auth = req.headers?.authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  return parts[1];
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed' });

    const token = getBearerToken(req);
    if (!token) return json(res, 401, { message: 'Missing auth' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return json(res, 401, { message: 'Invalid token' });
    }

    const userId = payload?.id;
    if (!userId) return json(res, 401, { message: 'Invalid token' });

    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();

    if (!user) return json(res, 404, { message: 'User not found' });

    return json(res, 200, user);
  } catch (err) {
    console.error('api/me error:', err);
    return json(res, 500, { message: 'Server error' });
  }
};


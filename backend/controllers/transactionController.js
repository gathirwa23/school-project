const { supabase, supabaseAdmin } = require('../config/db')

function normalizeStatusInput(nextStatus) {
  const s = String(nextStatus || '').trim().toLowerCase()

  // Map a few common UI strings -> canonical order.status values.
  // If your DB uses different values, update these mappings.
  if (['completed', 'complete', 'done', 'delivered', 'success'].includes(s)) return 'completed'
  if (['pending', 'in_progress', 'in-progress', 'processing'].includes(s)) return 'pending'
  if (['failed', 'error', 'cancelled', 'canceled', 'rejected'].includes(s)) return 'failed'

  // fall back to original (for forward-compat)
  return s || 'pending'
}

function getRole(req) {
  return (req.user?.role || '').toLowerCase()
}

async function updateTransactionStatus(req, res) {
  try {
    const role = getRole(req)
    const { id } = req.params
    const { status } = req.body || {}

    if (!role) return res.status(401).json({ message: 'Missing user role' })
    if (!id) return res.status(400).json({ message: 'Missing transaction id' })
    if (status == null) return res.status(400).json({ message: 'Missing status' })

    // Driver and owner can update.
    const canUpdate = role === 'driver' || role === 'owner'
    if (!canUpdate) return res.status(403).json({ message: 'Forbidden' })

    const nextStatus = normalizeStatusInput(status)

    const updatePayload = { status: nextStatus }
    if (req.user?.id) updatePayload.updated_by = req.user.id

    // We assume the table is `order` and has `id` and `status`.
    const { data: updated, error } = await supabaseAdmin
      .from('order')
      .update(updatePayload)
      .eq('id', id)
      .select()

    if (error) throw error
    if (!updated || !updated.length) return res.status(404).json({ message: 'Transaction not found' })

    return res.json({ transaction: updated[0] })
  } catch (err) {
    console.error('updateTransactionStatus error:', err)
    return res.status(500).json({ message: 'Failed to update transaction status' })
  }
}

async function listTransactions(req, res) {
  try {
    const role = getRole(req)
    if (!role) return res.status(401).json({ message: 'Missing user role' })

    // Owner + driver can view.
    const canView = role === 'driver' || role === 'owner'
    if (!canView) return res.status(403).json({ message: 'Forbidden' })

    const { data, error } = await supabase
      .from('order')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.json({ transactions: Array.isArray(data) ? data : [] })
  } catch (err) {
    console.error('listTransactions error:', err)
    return res.status(500).json({ message: 'Failed to fetch transactions' })
  }
}

module.exports = {
  updateTransactionStatus,
  listTransactions,
}


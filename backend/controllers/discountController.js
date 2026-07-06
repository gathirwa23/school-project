const { supabase, supabaseAdmin } = require('../config/db')

async function listIssuedDiscounts(req, res) {
  try {
    const role = (req.user?.role || '').toLowerCase()
    if (!role) return res.status(401).json({ message: 'Missing user role' })
    if (role !== 'owner') return res.status(403).json({ message: 'Forbidden' })

    // Owner view: pending discount requests submitted by drivers.
    // Table name has a space: `discount auth`
    // We infer status based on whether `approved_at` is null.
    const { data, error } = await supabase
      .from('discount auth')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const discounts = (Array.isArray(data) ? data : []).map((row) => {
      const approvedAt = row.approved_at || row.approvedAt || row.approved_at_ts || null
      const pending = !approvedAt
      return {
        ...row,
        status: pending ? 'pending' : 'approved',
        // normalize for UI; your table uses spaced column names
        value: row['original price'] ?? row.original_price ?? row.originalPrice ?? row.value ?? row.amount ?? null,
        customer_id: row.customer_id ?? row.user_id ?? row.customer ?? row.customerId ?? null,
      }
    })


    return res.json({ discounts })
  } catch (err) {
    console.error('listIssuedDiscounts error:', err.message || err)
    return res.status(500).json({ message: err.message || 'Failed to fetch discounts' })
  }
}

async function createDiscountAuth(req, res) {
  try {
    const role = (req.user?.role || '').toLowerCase()
    if (!role) return res.status(401).json({ message: 'Missing user role' })
    if (role !== 'driver') return res.status(403).json({ message: 'Forbidden' })

    const {
      order_id,
      transaction_id,
      customer_id,
      original_price,
      originalPrice,
      // approve pipeline currently only needs original/approved/approved_at.
      approved_price,
      reason,
      note,
    } = req.body || {}


    const createdBy = req.user?.id
    if (!createdBy) return res.status(401).json({ message: 'Missing user id in token' })

    const value = original_price ?? originalPrice
    if (value == null) return res.status(400).json({ message: 'Missing original price' })

    // Your Supabase table `discount auth` has only:
    // - original price
    // - approved price
    // - approved at
    // So we insert only those fields here (and rely on schema for any other metadata).
    const payload = {
      'original price': value,
      'approved price': null,
      'approved at': null,
    }


    const { data, error } = await supabaseAdmin
      .from('discount auth')
      .insert(payload)
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
    
    const discountRecord = Array.isArray(data) && data.length > 0 ? data[0] : data
    return res.status(201).json({ 
      success: true,
      discountAuth: discountRecord,
      message: 'Discount request submitted successfully'
    })
  } catch (err) {
    console.error('createDiscountAuth error:', err.message || err)
    return res.status(500).json({ message: err.message || 'Failed to submit discount request' })
  }
}

async function approveDiscount(req, res) {
  try {
    const role = (req.user?.role || '').toLowerCase()
    if (!role) return res.status(401).json({ message: 'Missing user role' })
    if (role !== 'owner') return res.status(403).json({ message: 'Forbidden' })

    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Missing discount id' })

    // Always set approved_at on the server when approving.
    // Owner should NOT be required to send `approved_at` from the client.
    const serverApprovedAt = new Date().toISOString()

    // Owner supplies approved price (optional). If not supplied, default to original price.
    const {
      approved_price,
      approvedPrice,
    } = req.body || {}

    const approvedPriceValue = approved_price ?? approvedPrice

    const { data: existing, error: existingErr } = await supabaseAdmin
      .from('discount auth')
      .select('id, original price, approved at, approved price, order_id, transaction_id')
      .eq('id', id)
      .maybeSingle()

    if (existingErr) throw existingErr
    if (!existing) return res.status(404).json({ message: 'Discount not found' })

    // Idempotency: if already approved, return the stored record and do not re-update.
    const alreadyApprovedAt = existing?.['approved at'] ?? existing?.approved_at ?? existing?.approvedAt ?? null
    if (alreadyApprovedAt) {
      const approvedPriceExisting =
        existing?.['approved price'] ?? existing?.approved_price ?? existing?.approvedPrice ?? null

      return res.json({
        discount: {
          ...existing,
          status: 'approved',
          value:
            existing?.['original price'] ??
            existing?.original_price ??
            existing?.originalPrice ??
            existing?.value ??
            existing?.amount ??
            null,
          customer_id:
            existing?.customer_id ??
            existing?.user_id ??
            existing?.customer ??
            existing?.customerId ??
            null,
          approved_price: approvedPriceExisting,
        },
        message: '✅ Discount already approved',
      })
    }

    const original = existing?.['original price']
    const finalApprovedPrice = approvedPriceValue ?? original ?? null
    const finalApprovedAt = serverApprovedAt

    const { data, error } = await supabaseAdmin
      .from('discount auth')
      .update({
        'approved price': finalApprovedPrice,
        'approved at': finalApprovedAt,
      })
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || !data.length) return res.status(404).json({ message: 'Discount not found' })

    // If your `discount auth` row is linked to an order/transaction,
    // update the corresponding order status so the Transactions table button shows `approved`.
    const discountRow = data[0]
    const linkedOrderId =
      discountRow.order_id ??
      discountRow.transaction_id ??
      discountRow.orderId ??
      discountRow.transactionId ??
      null

    if (linkedOrderId) {
      await supabaseAdmin
        .from('order')
        .update({ status: 'approved' })
        .eq('id', linkedOrderId)
    }

    const approved = {
      ...discountRow,
      status: 'approved',
      // normalize for UI consistency with listIssuedDiscounts
      value: discountRow['original price'] ?? discountRow.original_price ?? discountRow.originalPrice ?? discountRow.value ?? discountRow.amount ?? null,
      customer_id:
        discountRow.customer_id ?? discountRow.user_id ?? discountRow.customer ?? discountRow.customerId ?? null,
    }

    return res.json({
      discount: approved,
      message: '✅ Discount approved successfully',
    })


  } catch (err) {
    console.error('approveDiscount error:', err)
    return res.status(500).json({ message: 'Failed to approve discount' })
  }
}


async function listOwnerDiscountNotifications(req, res) {
  try {
    const role = (req.user?.role || '').toLowerCase()
    if (!role) return res.status(401).json({ message: 'Missing user role' })
    if (role !== 'owner') return res.status(403).json({ message: 'Forbidden' })

    // Pending = approved_at is null (or empty)
    const { data, error } = await supabase
      .from('discount auth')
      .select('*')
      .is('approved at', null)
      .order('created_at', { ascending: false })
      .limit(20)


    if (error) throw error

    const notifications = (Array.isArray(data) ? data : []).map((row) => ({
      id: row.id,
      type: 'discount_request',
      original_price: row['original price'] ?? row.original_price ?? row.originalPrice ?? null,
      approved_at: row['approved at'] ?? row.approved_at ?? row.approvedAt ?? null,
      created_at: row.created_at ?? row.createdAt ?? null,
      driver_id: row.driver_id ?? row.created_by ?? null,
      order_id: row.order_id ?? row.transaction_id ?? null,
      status: 'pending',
    }))


    return res.json({
      notifications,
      count: notifications.length,
    })
  } catch (err) {
    console.error('listOwnerDiscountNotifications error:', err)
    return res.status(500).json({ message: 'Failed to fetch notifications' })
  }
}

module.exports = {
  listIssuedDiscounts,
  createDiscountAuth,
  approveDiscount,
  listOwnerDiscountNotifications,
}



import { useEffect, useMemo, useState } from 'react'

function statusPillClass(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('complete') || s.includes('done') || s.includes('success')) return 'pill-ok'
  if (s.includes('pending') || s.includes('progress') || s.includes('processing')) return 'pill-warn'
  if (s.includes('fail') || s.includes('error') || s.includes('reject') || s.includes('cancel')) return 'pill-err'
  return 'pill-warn'
}

function TransactionsPanel({ user }) {
  const isOwner = (user?.role || '').toLowerCase() === 'owner'
  const isDriver = (user?.role || '').toLowerCase() === 'driver'

  const [loading, setLoading] = useState(true)
  const [txError, setTxError] = useState('')

  const [transactions, setTransactions] = useState([])

  const [discountsLoading, setDiscountsLoading] = useState(false)
  const [discountsError, setDiscountsError] = useState('')
  const [discountsSuccess, setDiscountsSuccess] = useState('')

  const [discounts, setDiscounts] = useState([])

  // Driver discount request inputs: { [transactionId]: { originalPrice } }
  const [driverDiscountEdits, setDriverDiscountEdits] = useState({})
  const [driverDiscountSavingId, setDriverDiscountSavingId] = useState(null)
  const [driverDiscountError, setDriverDiscountError] = useState('')

  // Local edit buffers


  const [statusEdits, setStatusEdits] = useState({}) // { [id]: nextStatus }
  const [savingId, setSavingId] = useState(null)

  const token = useMemo(() => localStorage.getItem('token') || '', [])

  // Initial load
  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      if (!token) {
        if (!cancelled) setLoading(false)
        return
      }

      try {
        // transactions
        if (isOwner || isDriver) {
          const txRes = await fetch('http://localhost:5000/api/transactions', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!txRes.ok) throw new Error('Failed to fetch transactions')
          const txData = await txRes.json()
          if (!cancelled) setTransactions(txData.transactions || [])
        }

        // discounts (owner only)
        if (isOwner) {
          setDiscountsLoading(true)
          setDiscountsError('')

          const dRes = await fetch('http://localhost:5000/api/discounts', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!dRes.ok) throw new Error('Failed to fetch discounts')
          const dData = await dRes.json()
          if (!cancelled) setDiscounts(dData.discounts || [])
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          // Prefer transactions error if it happens first.
          setTxError(e.message || 'Failed to load')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setDiscountsLoading(false)
        }
      }
    }

    loadAll()

    return () => {
      cancelled = true
    }
  }, [token, isOwner, isDriver])

  async function saveTransactionStatus(txId) {
    const nextStatus = statusEdits[txId]
    if (!nextStatus) return

    try {
      setSavingId(txId)
      setTxError('')

      const res = await fetch(`http://localhost:5000/api/transactions/${txId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to update status')
      }

      const updated = await res.json()

      setTransactions((prev) => prev.map((t) => (String(t.id) === String(txId) ? updated.transaction : t)))
    } catch (e) {
      console.error(e)
      setTxError(e.message || 'Failed to update status')
    } finally {
      setSavingId(null)
    }
  }

  async function approveDiscount(discountId) {
    try {
      setDiscountsError('')
      setDiscountsSuccess('')
      setDiscountsLoading(true)


      const res = await fetch(`http://localhost:5000/api/discounts/${discountId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to approve discount')
      }

      const updated = await res.json().catch(() => ({}))

      // Positive message + ensure table refreshes from backend truth
      if (updated?.message) {
        setDiscountsSuccess(updated.message)
      } else {
        setDiscountsSuccess('✅ Discount approved successfully')
      }

      // Refresh discounts so status changes from pending -> approved immediately
      await refreshDiscounts()

    } catch (e) {
      console.error(e)
      setDiscountsError(e.message || 'Failed to approve discount')
    } finally {
      setDiscountsLoading(false)
    }
  }


  async function refreshDiscounts() {
    if (!isOwner || !token) return
    
    try {
      setDiscountsLoading(true)
      setDiscountsError('')

      const dRes = await fetch('http://localhost:5000/api/discounts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!dRes.ok) throw new Error('Failed to fetch discounts')
      const dData = await dRes.json()
      setDiscounts(dData.discounts || [])
    } catch (e) {
      console.error('refreshDiscounts error:', e)
      setDiscountsError(e.message || 'Failed to refresh discounts')
    } finally {
      setDiscountsLoading(false)
    }
  }

  const pendingDiscounts = useMemo(() => {
    return discounts.filter((d) => String(d.status || '').toLowerCase() === 'pending')
  }, [discounts])

  if (loading) return <div className="bottom">Loading...</div>

  if (!(isOwner || isDriver)) {
    return (
      <div className="bottom">
        <div className="card-head">
          <span className="card-title">Transactions</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bottom">
        <div className="card-head">
          <span className="card-title">Transactions</span>
        </div>

        {txError && <div style={{ color: 'crimson', marginBottom: 10 }}>{txError}</div>}
        {driverDiscountError && <div style={{ color: 'crimson', marginBottom: 10 }}>{driverDiscountError}</div>}

        <table className="tx-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ opacity: 0.8 }}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const txId = t.id
                const amount = t.amount ?? t.total_amount ?? t.price ?? ''
                const amountNum = typeof amount === 'number' ? amount : Number(amount)
                const amountStr = Number.isFinite(amountNum) ? amountNum.toFixed(2) : String(amount || '')
                const currentStatus = t.status ?? 'pending'
                const nextStatus = statusEdits[txId] ?? currentStatus

                const driverOriginalPrice = driverDiscountEdits?.[txId]?.originalPrice ?? ''

                return (
                  <tr key={txId}>
                    <td>{txId}</td>
                    <td>{amountStr}</td>
                    <td>
                      <span className={`pill ${statusPillClass(nextStatus)}`}>{currentStatus}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <select
                          value={nextStatus}
                          onChange={(e) => setStatusEdits((prev) => ({ ...prev, [txId]: e.target.value }))}
                          style={{ padding: '4px 6px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                        <button className="btn-sm" disabled={savingId === txId} onClick={() => saveTransactionStatus(txId)}>
                          {savingId === txId ? 'Saving…' : 'Save'}
                        </button>
                      </div>

                      {isDriver && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Original price"
                            value={driverOriginalPrice}
                            onChange={(e) =>
                              setDriverDiscountEdits((prev) => ({
                                ...prev,
                                [txId]: { ...(prev?.[txId] || {}), originalPrice: e.target.value },
                              }))
                            }
                            style={{ width: 140, padding: '4px 6px' }}
                          />
                          <button
                            className="btn-sm"
                            disabled={driverDiscountSavingId === txId}
                            onClick={async () => {
                              try {
                                setDriverDiscountError('')
                                setDriverDiscountSavingId(txId)

                                const res = await fetch('http://localhost:5000/api/discounts/auth', {
                                  method: 'POST',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    transaction_id: txId,
                                    original_price: Number(driverOriginalPrice),
                                  }),
                                })

                                if (!res.ok) {
                                  const data = await res.json().catch(() => ({}))
                                  throw new Error(data.message || 'Failed to submit discount')
                                }

                                // Clear input and refresh discounts

                                setDriverDiscountEdits((prev) => ({
                                  ...prev,
                                  [txId]: { ...(prev?.[txId] || {}), originalPrice: '' },
                                }))
                                
                                // Trigger owner's discount refresh if applicable
                                if (isOwner) {
                                  await refreshDiscounts()
                                }
                              } catch (e) {
                                console.error(e)
                                setDriverDiscountError(e.message || 'Failed to submit discount')
                              } finally {
                                setDriverDiscountSavingId(null)
                              }
                            }}
                          >
                            {driverDiscountSavingId === txId ? 'Submitting…' : 'Request discount approval'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {isOwner && (
        <div className="bottom" style={{ marginTop: 14 }}>
          <div className="card-head">
            <span className="card-title">Discount Approvals</span>
          </div>

          {discountsSuccess && (
            <div style={{ color: '#3B6D11', marginBottom: 10 }}>{discountsSuccess}</div>
          )}
          {discountsError && <div style={{ color: 'crimson', marginBottom: 10 }}>{discountsError}</div>}
          {discountsLoading && <div style={{ opacity: 0.8, marginBottom: 10 }}>Loading discounts…</div>}


          <table className="tx-table">
            <thead>
              <tr>
                <th>Discount</th>
                <th>Customer</th>
                <th>Value</th>
                <th>Status</th>
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>
              {pendingDiscounts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ opacity: 0.8 }}>
                    No pending discounts.
                  </td>
                </tr>
              ) : (
                pendingDiscounts.map((d) => {
                  const value = d.value ?? d.amount ?? d.discount_amount ?? ''
                  return (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.customer_id || d.user_id || d.customer || '—'}</td>
                      <td>{typeof value === 'number' ? value.toFixed(2) : String(value || '—')}</td>
                      <td>
                        <span className="pill pill-warn">{d.status}</span>
                      </td>
                      <td>
                        <button className="btn-sm" disabled={discountsLoading} onClick={() => approveDiscount(d.id)}>
                          Approve
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default TransactionsPanel


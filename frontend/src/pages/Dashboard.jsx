import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import '../styles/ReviewsModal.css'
import { productImageDataUri } from '../utils/productImageDataUri'
import TransactionsPanel from './TransactionsPanel'


function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [theme, setTheme] = useState('light')


  const [discountNotificationsCount, setDiscountNotificationsCount] = useState(0)

  const [inventoryItems, setInventoryItems] = useState([])
  const [filteredInventory, setFilteredInventory] = useState(inventoryItems)

  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearchStatus, setActiveSearchStatus] = useState('all')

  const [selectedProductId, setSelectedProductId] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const selectedProduct = useMemo(() => {
    if (selectedProductId == null) return null
    return inventoryItems.find((p) => p.id === selectedProductId) || null
  }, [inventoryItems, selectedProductId])

  const isOwner = (user?.role || '').toLowerCase() === 'owner'

  function openProductModal(productId) {
    setSelectedProductId(productId)
    setIsProductModalOpen(true)
  }

  function closeProductModal() {
    setIsProductModalOpen(false)
  }

  const reportData = {
    totalSales: 145000,
    unitsThisMonth: 342,
    discountsGiven: 12,
    shrinkage: 5,
  }

  const [salesPeriod, setSalesPeriod] = useState('monthly') // 'weekly' | 'monthly'

  const periodMultiplier = useMemo(() => {
    // mock transformation so charts are clearly dynamic when clicking
    // (replace with real backend data later)
    return salesPeriod === 'weekly' ? 0.32 : 1
  }, [salesPeriod])

  const computedReportData = useMemo(() => {
    const m = periodMultiplier
    return {
      totalSales: Math.round(reportData.totalSales * m),
      unitsThisMonth: Math.round(reportData.unitsThisMonth * m),
      discountsGiven: Math.max(0, Math.round(reportData.discountsGiven * (m + 0.05))),
      shrinkage: Math.max(0, Math.round(reportData.shrinkage * (m + 0.02))),
    }
  }, [periodMultiplier, reportData])
  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const nextTheme = savedTheme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', nextTheme)
    setTheme(nextTheme)
  }, [])


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }


    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch user')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error(err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    async function fetchNotifications() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/discounts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setDiscountNotificationsCount(data?.count ?? 0)
      } catch {
        // ignore notification errors; do not block dashboard
      }
    }

    fetchNotifications()

    async function fetchInventory() {

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch inventory')
        const data = await res.json()
        const items = data.items || []
        setInventoryItems(items)
        setFilteredInventory(items)
      } catch (err) {
        console.error(err)
      }
    }

    if (user) fetchInventory()
  }, [user])

  function filterInventory(status) {
    setActiveSearchStatus(status)

    let next
    if (status === 'all') {
      next = inventoryItems
    } else {
      next = inventoryItems.filter(item => item.status === status)
    }

    // apply search term (product name)
    const q = searchTerm.trim().toLowerCase()
    if (q) {
      next = next.filter((item) => (item.product || '').toLowerCase().includes(q))
    }

    setFilteredInventory(next)
  }


  function updateStock(id, newStock) {
    const updated = inventoryItems.map(item => {
      if (item.id === id) {
        let newStatus = 'in-stock'
        if (newStock === 0) newStatus = 'out-of-stock'
        else if (newStock < 20) newStatus = 'low-stock'
        return { ...item, stock: newStock, status: newStatus }
      }
      return item
    })
    setInventoryItems(updated)
    setFilteredInventory(updated)
  }

  if (loading) return <div className="dashboard">Loading...</div>
  if (!user) return <div className="dashboard">No user found</div>

  const firstName = user.name ? user.name.split(' ')[0] : user.email.split('@')[0]
  const initials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user.email.substring(0, 2).toUpperCase()

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-mark">📦</div>
          <span className="sb-title">Van Sales</span>
        </div>
        <nav>
          <div 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="nav-icon">⊞</span> Dashboard
          </div>
          <div 
            className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveSection('inventory')}
          >
            <span className="nav-icon">📦</span> Inventory
          </div>
          <div 
            className={`nav-item ${activeSection === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveSection('posts')}
          >
            <span className="nav-icon">📰</span> Posts
          </div>
          <div 
            className={`nav-item ${activeSection === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveSection('transactions')}
          >
            <span className="nav-icon">💳</span> Transactions
          </div>
          <div 
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('reports')}
          >
            <span className="nav-icon">📊</span> Reports
          </div>
          <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
            <span className="nav-icon">⚙️</span> Settings
          </div>

        </nav>
        <div className="sb-footer">
          <div className="sb-user">
            <div className="av-sm">{initials}</div>
            <div className="sb-user-info">
              <p>{user.name || 'User'}</p>
              <span>{user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-link">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="greeting">Hey <em>{firstName}</em> 👋, welcome back!</div>
          <div className="topbar-right">
            <div className="search-box">
              <input
                className="search-input"
                type="text"
                value={searchTerm}
                placeholder="Search product…"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // apply filter immediately
                    // (filterInventory already applies status; we apply search here)
                    // Keep it simple: search filters within current status selection handled in filter effect below.
                    // Trigger rerender by updating term state only.
                    e.preventDefault()
                  }
                }}
              />
              <button
                className="search-btn"
                onClick={() => {
                  // apply by re-setting filtered inventory using current status filter
                  // (status filter is applied in filterInventory; here we just re-run it for 'all')
                  filterInventory(activeSearchStatus)
                }}
                aria-label="Search"
              >
                🔍
              </button>
            </div>

            <button
              className="notif-btn"
              aria-label="Notifications"
              onClick={() => {
                alert(`You have ${discountNotificationsCount || 0} discount notifications.`)
              }}
            >
              🔔
              {discountNotificationsCount > 0 && <span className="notif-badge">{discountNotificationsCount}</span>}
            </button>


            <div
              className="av-lg"
              onClick={() => setActiveSection('settings')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setActiveSection('settings')
              }}
              aria-label="Open settings"
            >
              {initials}
            </div>
          </div>
        </div>

        {/* DASHBOARD SECTION (Owner/Driver) */}
        {activeSection === 'dashboard' && user.role !== 'user' && (
          <>
            {/* STAT CARDS */}
            <div className="stats">
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Role</span>
                  <span className="tag tag-up">✓</span>
                </div>
                <div className="stat-val">{user.role}</div>
                <div className="stat-sub">Active status</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Account Email</span>
                  <span className="tag tag-up">✓</span>
                </div>
                <div className="stat-val-email">{user.email}</div>
                <div className="stat-sub">Verified</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Full Name</span>
                  <span className="tag tag-up">✓</span>
                </div>
                <div className="stat-val">{user.name || 'N/A'}</div>
                <div className="stat-sub">Profile complete</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Account Status</span>
                  <span className="tag tag-up">Active</span>
                </div>
                <div className="stat-val">✓</div>
                <div className="stat-sub">All systems running</div>
              </div>
            </div>

            {/* MID ROW: Info Cards */}
            <div className="mid">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Welcome to Your Dashboard</span>
                </div>
                <div className="welcome-content">
                  <p>Hello <strong>{firstName}</strong> 👋 — welcome back!</p>
                  <p>
                    You’re currently logged in as <strong style={{ textTransform: 'capitalize' }}>{user.role}</strong>. Here’s your quick Van Sales overview.
                  </p>

                  <div className="business-insights">
                    <div className="insight-row">
                      <span className="insight-label">Most liked product</span>
                      <span className="insight-value">Olive Oil 250ml</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">Van locations (pickup)</span>
                      <span className="insight-value">Nyali • Tudor • Mtwapa • Bamburi • Ganjoni • Majengo • Kisauni • Changamwe</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">Physical drop days</span>
                      <span className="insight-value">Mon • Wed • Sat</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">Monthly sales snapshot</span>
                      <span className="insight-value">KSh {reportData.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">Demand signal</span>
                      <span className="insight-value">{reportData.unitsThisMonth} units sold</span>
                    </div>
                  </div>

                  <ul className="info-list">
                    <li>✓ Account authenticated and secure</li>
                    <li>✓ Role-based access enabled</li>
                    <li>✓ Profile data synced</li>
                    <li>✓ Quick access to key workflows</li>
                  </ul>
                </div>
              </div>

              <div className="card info-card">
                <div className="card-head">
                  <span className="card-title">Quick Info</span>
                </div>
                <div className="quick-info">
                  <div className="info-row">
                    <span className="info-label">User ID</span>
                    <span className="info-value">{user.id.substring(0, 8)}...</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status</span>
                    <span className="info-value" style={{color: '#3B6D11'}}>●</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Role</span>
                    <span className="info-value">{user.role}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email.substring(0, 12)}...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="bottom">
              <div className="card-head">
                <span className="card-title">Profile Details</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm">📋 Export</button>
                  <button className="btn-sm">⚙️ Edit</button>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{user.name || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">
                    <span className="role-badge" style={{textTransform: 'capitalize'}}>
                      {user.role}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">User ID:</span>
                  <span className="detail-value">{user.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account Status:</span>
                  <span className="detail-value">
                    <span className="pill pill-ok">Active</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PRODUCT MODAL (opened from Inventory table) */}
        {isProductModalOpen && selectedProduct && (
          <div
            className="reviews-modal-overlay"
            onClick={closeProductModal}
            role="dialog"
            aria-modal="true"
          >
            <div className="reviews-modal" onClick={(e) => e.stopPropagation()}>
              <div className="reviews-modal-head">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="reviews-title">Product Details</div>
                  <div className="reviews-subtitle">
                    {selectedProduct.product} • ID: {String(selectedProduct.id).slice(0, 8)}…
                  </div>
                  <img
                    src={productImageDataUri({
                      id: selectedProduct.id,
                      name: selectedProduct.product,
                      width: 420,
                      height: 260,
                    })}
                    alt={selectedProduct.product}
                    style={{
                      width: 96,
                      height: 64,
                      borderRadius: 12,
                      objectFit: 'cover',
                      border: '0.5px solid #EDE0CE',
                    }}
                  />

                  <button className="reviews-close-btn" onClick={closeProductModal} aria-label="Close modal">
                    ✕ Close
                  </button>
                </div>
              </div>

              <div className="reviews-grid">
                <div className="metrics-panel">
                  <div className="metrics-row">
                    <span className="metrics-label">Stock</span>
                    <span>{selectedProduct.stock}</span>
                  </div>
                  <div className="metrics-row">
                    <span className="metrics-label">Price</span>
<span>{selectedProduct.price}</span>
                  </div>
                  <div className="metrics-row">
                    <span className="metrics-label">Status</span>
                    <span
                      className={`status-pill ${
                        selectedProduct.status === 'in-stock'
                          ? 'status-ok'
                          : selectedProduct.status === 'low-stock'
                            ? 'status-warn'
                            : 'status-err'
                      }`}
                    >
                      {selectedProduct.status === 'in-stock'
                        ? 'In stock'
                        : selectedProduct.status === 'low-stock'
                          ? 'Low'
                          : 'Out'}
                    </span>
                  </div>

                  <div className="metrics-divider" />

                  {isOwner ? (
                    <>
                      <div className="metrics-heading">Admin Performance (mock charts)</div>

                      {(() => {
                        const stockNum = Number(selectedProduct.stock) || 0
                        const priceNum = Number(selectedProduct.price) || 1

                        const scoreVelocity = Math.max(5, Math.round(stockNum / 2))
                        const scoreDemand = Math.max(5, Math.round(priceNum * 2))
                        const scoreOverall = Math.max(5, Math.round(scoreVelocity * 0.6 + scoreDemand * 0.4))
                        const maxVal = Math.max(scoreVelocity, scoreDemand, scoreOverall, 1)

                        const charts = [
                          { label: 'Velocity', value: scoreVelocity },
                          { label: 'Demand', value: scoreDemand },
                          { label: 'Overall', value: scoreOverall },
                        ]

                        return (
                          <div className="modal-bar-chart">
                            {charts.map((c) => {
                              const pct = Math.round((c.value / maxVal) * 100)
                              return (
                                <div key={c.label} className="modal-bar-row">
                                  <div className="modal-bar-label">{c.label}</div>
                                  <div className="modal-bar-track">
                                    <div className="modal-bar-fill" style={{ width: `${pct}%` }} />
                                  </div>
                                  <div className="modal-bar-val">{c.value}</div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })()}
                    </>
                  ) : (
                    <div className="metrics-heading" style={{ marginTop: 12, color: '#8A7060' }}>
                      Admin performance is restricted to owners.
                    </div>
                  )}
                </div>

                <div className="reviews-panel">
                  <div className="reviews-heading">Customer Reviews (mock)</div>
                  <div className="reviews-list">
                    {[
                      { name: 'Njeri', stars: 5, body: 'Quality is great and delivery was fast.' },
                      { name: 'Maina', stars: 4, body: 'Good value for money. Will buy again.' },
                      { name: 'Amina', stars: 3, body: 'Packaging was okay, product works as expected.' },
                      { name: 'Otieno', stars: 5, body: 'Excellent! The product performs well.' },
                    ].map((r, idx) => (
                      <div className="review-card" key={`${r.name}-${idx}`}>
                        <div className="review-head">
                          <div className="review-name">{r.name}</div>
                          <div className="review-stars">
                            {'★'.repeat(r.stars)}
                            {'☆'.repeat(5 - r.stars)}
                          </div>
                        </div>
                        <div className="review-body">{r.body}</div>
                        <div className="review-meta">
                          <span>Verified buyer</span>
                          <span>Just now</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY SECTION */}
        {activeSection === 'inventory' && (
          <>
            <div className="bottom">
              <div className="card-head">
                <span className="card-title">Inventory Management</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm" onClick={() => filterInventory('all')}>All Items</button>
                  <button className="btn-sm" onClick={() => filterInventory('in-stock')}>In Stock</button>
                  <button className="btn-sm" onClick={() => filterInventory('low-stock')}>Low Stock</button>
                  <button className="btn-sm" onClick={() => filterInventory('out-of-stock')}>Out of Stock</button>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id}>
                      <td>
                        <button
                          type="button"
                          className="btn-sm"
                          style={{ background: 'transparent' }}
                          onClick={() => openProductModal(item.id)}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <img
                              src={productImageDataUri({ id: item.id, name: item.product, width: 44, height: 44 })}
                              alt={item.product}
                              style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}
                              loading="lazy"
                            />
                            <span>{item.product}</span>
                          </span>
                        </button>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => updateStock(item.id, parseInt(e.target.value))}
                          style={{ width: '60px', padding: '4px' }}
                        />
                      </td>
<td>{item.price}</td>
                      <td>
                        <span className={`pill pill-${item.status === 'in-stock' ? 'ok' : item.status === 'low-stock' ? 'warn' : 'err'}`}>
                          {item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            const el = document.getElementById(`stock-input-${item.id}`)
                            if (el) el.focus()
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-sm"
                          style={{ marginLeft: 6 }}
                          onClick={async (e) => {
                            e.stopPropagation()
                            const token = localStorage.getItem('token')
                            if (!token) return

                            try {
                              const nextStock = Number(item.stock)
                              const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/${item.id}`, {
                                method: 'PATCH',
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ stock: nextStock }),
                              })

                              if (!res.ok) throw new Error('Failed to update stock')

                              const invRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory`, {
                                headers: { Authorization: `Bearer ${token}` },
                              })
                              if (!invRes.ok) throw new Error('Failed to refresh inventory')
                              const invData = await invRes.json()
                              const items = invData.items || []
                              setInventoryItems(items)
                              setFilteredInventory(items)

                            } catch (e2) {
                              console.error(e2)
                            }
                          }}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SETTINGS SECTION */}
        {activeSection === 'settings' ? (
          <>
            <div className="bottom">
              <div className="card-head">
                <span className="card-title">Settings</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm" onClick={() => setActiveSection('dashboard')}>← Back</button>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Account Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">
                    <span className="role-badge" style={{ textTransform: 'capitalize' }}>
                      {user.role}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Notifications:</span>
                  <span className="detail-value">
                    <span className="pill pill-ok">Enabled</span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Theme:</span>
                  <span className="detail-value">
                    <button
                      className="btn-sm"
                      onClick={() => {
                        const next = theme === 'dark' ? 'light' : 'dark'
                        setTheme(next)
                        localStorage.setItem('theme', next)
                        document.documentElement.setAttribute('data-theme', next)
                      }}
                      type="button"
                    >
                      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Security:</span>
                  <span className="detail-value">
                    <button className="btn-sm">Update Password</button>
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* POSTS SECTION */}
        {activeSection === 'posts' && (
          <>
            <div className="bottom">
              <div className="card-head">
                <span className="card-title">Posts / New Listings</span>
              </div>

              {(() => {
                const items = Array.isArray(inventoryItems) ? inventoryItems : []
                const toNum = (v) => (typeof v === 'number' ? v : Number(v))

                const inStock = items.filter((it) => it.status === 'in-stock')
                const lowStock = items.filter((it) => it.status === 'low-stock')
                const outOfStock = items.filter((it) => it.status === 'out-of-stock')

                const pickTop = (arr, n) => {
                  // Sort by highest stock, then by id for stable ordering.
                  const next = [...arr].sort((a, b) => {
                    const da = toNum(a.stock)
                    const db = toNum(b.stock)
                    if (db !== da) return db - da
                    return Number(a.id) - Number(b.id)
                  })
                  return next.slice(0, n)
                }

                const pickLow = (arr, n) => {
                  // Sort by lowest stock (scarcer = more “on demand”), then by id.
                  const next = [...arr].sort((a, b) => {
                    const da = toNum(a.stock)
                    const db = toNum(b.stock)
                    if (da !== db) return da - db
                    return Number(a.id) - Number(b.id)
                  })
                  return next.slice(0, n)
                }

                const newListings = pickTop(inStock, 5).map((it) => {
                  const stockNum = toNum(it.stock)
                  const tag = stockNum >= 40 ? 'New' : stockNum >= 20 ? 'Trending' : 'Just In'
                  const pillClass = tag === 'New' ? 'pill-ok' : 'pill-ok'
                  return {
                    title: `Fresh Stock: ${it.product}`,
                    tag,
                    pillClass,
                  }
                })

                const highlyOnDemand = pickLow(lowStock.length ? lowStock : inStock, 5).map((it) => {
                  const stockNum = toNum(it.stock)
                  const tag = stockNum <= 5 ? 'Hot' : stockNum <= 15 ? 'High' : 'Fast Moving'
                  return {
                    title: `${it.product}`,
                    tag,
                    pillClass: 'pill-warn',
                  }
                })

                const fallbackRows = (count = 3) =>
                  outOfStock.slice(0, count).map((it, idx) => ({
                    title: `${it.product}`,
                    tag: 'Available Soon',
                    pillClass: 'pill-warn',
                    idx,
                  }))

                const leftRows = newListings.length ? newListings : fallbackRows(3).map((r) => ({ ...r, pillClass: 'pill-ok' }))
                const rightRows = highlyOnDemand.length ? highlyOnDemand : fallbackRows(3)

                return (
                  <>
                    <div className="side-by-side">
                      <div className="side-card">
                        <div className="card-subtitle">New Listings</div>
                        <div className="list-pills">
                          {leftRows.map((p) => (
                            <div key={`${p.title}-${p.tag}`} className="list-row">
                              <span className="list-title">{p.title}</span>
                              <span className={`pill ${p.pillClass}`}>{p.tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="side-card">
                        <div className="card-subtitle">Highly On Demand</div>
                        <div className="list-pills">
                          {rightRows.map((p) => (
                            <div key={`${p.title}-${p.tag}`} className="list-row">
                              <span className="list-title">{p.title}</span>
                              <span className={`pill ${p.pillClass}`}>{p.tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {!items.length && (
                      <div className="no-products-message">
                        <p>No inventory loaded yet.</p>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </>
        )}


        {/* TRANSACTIONS SECTION */}
        {activeSection === 'transactions' && (
          <TransactionsPanel user={user} />
        )}


        {/* USER COMMERCE VIEW moved to UserDashboard.jsx */}
        {null}

        {/* REPORTS SECTION */}
        {activeSection === 'reports' && (
          <>
            <div className="stats">

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Total Sales</span>
                  <span className="tag tag-up">+12.5%</span>
                </div>
                <div className="stat-val">KSh {reportData.totalSales.toLocaleString()}</div>
                <div className="stat-sub">This month</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Units Sold</span>
                  <span className="tag tag-up">+8.2%</span>
                </div>
                <div className="stat-val">{reportData.unitsThisMonth}</div>
                <div className="stat-sub">This month</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Discounts Given</span>
                  <span className="tag tag-dn">-2.1%</span>
                </div>
                <div className="stat-val">{reportData.discountsGiven}</div>
                <div className="stat-sub">Active</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">Shrinkage</span>
                  <span className="tag tag-up">+0.5%</span>
                </div>
                <div className="stat-val">{reportData.shrinkage}</div>
                <div className="stat-sub">Units</div>
              </div>
            </div>

            <div className="bottom">
              <div className="card-head">
                <span className="card-title">Sales Report</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className={`btn-sm ${salesPeriod === 'weekly' ? 'btn-sm-active' : ''}`}
                    onClick={() => setSalesPeriod('weekly')}
                    type="button"
                  >
                    📊 Weekly
                  </button>
                  <button
                    className={`btn-sm ${salesPeriod === 'monthly' ? 'btn-sm-active' : ''}`}
                    onClick={() => setSalesPeriod('monthly')}
                    type="button"
                  >
                    📊 Monthly
                  </button>
                  <button
                    className="btn-sm"
                    type="button"
                    onClick={() => {
                      // Print hard copy of the report as currently shown.
                      // Uses a dedicated print container so the page isn't cluttered.
                      const el = document.getElementById('sales-report-print')
                      if (!el) {
                        window.print()
                        return
                      }

                      const prev = document.body.innerHTML
                      document.body.innerHTML = el.outerHTML
                      window.print()
                      document.body.innerHTML = prev
                      window.location.reload()
                    }}
                  >
                    📥 Download
                  </button>
                </div>
              </div>

              {/* CHARTS */}
              <div className="report-charts">
                  <div className="report-chart-card" id="sales-report-print">
                  <div className="chart-head">
                    <span className="chart-title">Performance & Growth</span>
                    <span className="chart-sub">Owner metrics + visual progress</span>
                  </div>

                  <div className="growth-grid">
                    {(() => {
                      const kpis = [
                        {
                          label: 'Revenue Growth',
                          value: 12.5,
                          display: '+12.5%',
                          tone: 'up',
                        },
                        {
                          label: 'Units Sold Growth',
                          value: 8.2,
                          display: '+8.2%',
                          tone: 'up',
                        },
                        {
                          label: 'Conversion Health',
                          value: 72,
                          display: '72%',
                          tone: 'up',
                        },
                        {
                          label: 'Stock Risk',
                          value: 18,
                          display: 'Low',
                          tone: 'warn',
                          barPct: 18,
                        },
                      ]

                      const maxBar = 100

                      return kpis.map((k) => {
                        const pct = typeof k.barPct === 'number' ? k.barPct : Math.min(maxBar, Math.max(0, k.value))
                        return (
                          <div key={k.label} className="growth-metric">
                            <div className="growth-top">
                              <span className="growth-label">{k.label}</span>
                              <span className={`tag ${k.tone === 'up' ? 'tag-up' : 'tag-dn'}`}>{k.display}</span>
                            </div>
                            <div className="growth-track">
                              <div className={`growth-fill ${k.tone === 'up' ? 'growth-fill-up' : 'growth-fill-down'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>

                  {(() => {
                      const maxVal = Math.max(
                      computedReportData.totalSales,
                      computedReportData.unitsThisMonth,
                      computedReportData.discountsGiven,
                      computedReportData.shrinkage,
                      1
                    )

                    const items = [
                      { label: 'Total Sales', value: computedReportData.totalSales, display: `KSh ${computedReportData.totalSales.toLocaleString()}` },
                      { label: 'Units Sold', value: computedReportData.unitsThisMonth, display: `${computedReportData.unitsThisMonth}` },
                      { label: 'Discounts', value: computedReportData.discountsGiven, display: `${computedReportData.discountsGiven}` },
                      { label: 'Shrinkage', value: computedReportData.shrinkage, display: `${computedReportData.shrinkage} units` },
                    ]

                    return (
                      <div className="bar-chart">
                        {items.map((it) => {
                          const pct = Math.round((it.value / maxVal) * 100)
                          return (
                            <div key={it.label} className="bar-col">
                              <div className="bar-track">
                                <div className="bar-fill" style={{ height: `${pct}%` }} />
                              </div>
                              <div className="bar-meta">
                                <span className="bar-label">{it.label}</span>
                                <span className="bar-val">{it.display}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                <div className="report-chart-card report-chart-side">
                  <div className="chart-head">
                    <span className="chart-title">Breakdown</span>
                    <span className="chart-sub">Quick read</span>
                  </div>

                  <div className="breakdown-list">
                    <div className="breakdown-row">
                      <span>Total Revenue</span>
                      <div className="breakdown-right">
                        <span className="breakdown-val">KSh {computedReportData.totalSales.toLocaleString()}</span>
                        <div className="breakdown-bar">
                              <div
                            className="breakdown-fill"
                            style={{
                              width: `${Math.round((computedReportData.totalSales / Math.max(computedReportData.totalSales, computedReportData.unitsThisMonth, computedReportData.discountsGiven, computedReportData.shrinkage)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="breakdown-row">
                      <span>Units Sold</span>
                      <div className="breakdown-right">
                        <span className="breakdown-val">{computedReportData.unitsThisMonth}</span>
                        <div className="breakdown-bar">
                              <div
                            className="breakdown-fill"
                            style={{
                              width: `${Math.round((computedReportData.unitsThisMonth / Math.max(computedReportData.totalSales, computedReportData.unitsThisMonth, computedReportData.discountsGiven, computedReportData.shrinkage)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="breakdown-row">
                      <span>Discounts Given</span>
                      <div className="breakdown-right">
                        <span className="breakdown-val">{computedReportData.discountsGiven}</span>
                        <div className="breakdown-bar">
                              <div
                            className="breakdown-fill"
                            style={{
                              width: `${Math.round((computedReportData.discountsGiven / Math.max(computedReportData.totalSales, computedReportData.unitsThisMonth, computedReportData.discountsGiven, computedReportData.shrinkage)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="breakdown-row">
                      <span>Shrinkage</span>
                      <div className="breakdown-right">
                        <span className="breakdown-val">{computedReportData.shrinkage} units</span>
                        <div className="breakdown-bar">
                              <div
                            className="breakdown-fill"
                            style={{
                              width: `${Math.round((computedReportData.shrinkage / Math.max(computedReportData.totalSales, computedReportData.unitsThisMonth, computedReportData.discountsGiven, computedReportData.shrinkage)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="avg-row">
                      <span>Average Transaction Value</span>
                      <strong>KSh {Math.round(computedReportData.totalSales / 50).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra charts */}
              <div className="report-extra">
                {/* PIE CHART */}
                <div className="report-chart-card">
                  <div className="chart-head">
                    <span className="chart-title">Sales Mix (Pie)</span>
                    <span className="chart-sub">Relative shares</span>
                  </div>

                  {(() => {
                    const values = [
                      { label: 'Sales', value: computedReportData.totalSales, color: '#7A5C3A' },
                      { label: 'Units', value: computedReportData.unitsThisMonth, color: '#C8A870' },
                      { label: 'Discounts', value: computedReportData.discountsGiven, color: '#3B6D11' },
                      { label: 'Shrinkage', value: computedReportData.shrinkage, color: '#A32D2D' },
                    ]
                    const sum = values.reduce((a, b) => a + b.value, 0) || 1
                    let acc = 0

                    const cx = 60
                    const cy = 60
                    const r = 42
                    const circumference = 2 * Math.PI * r

                    const segments = values.map((v) => {
                      const portion = v.value / sum
                      const dash = portion * circumference
                      const gap = circumference - dash
                      const start = acc
                      acc += portion
                      return { ...v, portion, dash, gap, start }
                    })

                    const rotationOffset = -90
                    return (
                      <div className="pie-wrap">
                        <div className="pie">
                          <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDE0CE" strokeWidth="14" />
                            <g transform={`rotate(${rotationOffset} ${cx} ${cy})`}>
                              {segments.map((s) => (
                                <circle
                                  key={s.label}
                                  cx={cx}
                                  cy={cy}
                                  r={r}
                                  fill="none"
                                  stroke={s.color}
                                  strokeWidth="14"
                                  strokeDasharray={`${s.dash} ${s.gap}`}
                                  strokeDashoffset={-s.start * circumference}
                                  strokeLinecap="butt"
                                />
                              ))}
                            </g>
                          </svg>
                          <div className="pie-center">
                            <div className="pie-center-top">Total</div>
                            <div className="pie-center-val">KSh {computedReportData.totalSales.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="pie-legend">
                          {values.map((v) => (
                            <div key={v.label} className="legend-row">
                              <span className="legend-swatch" style={{ background: v.color }} />
                              <span className="legend-label">{v.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* LINE CHART */}
                <div className="report-chart-card report-chart-side">
                  <div className="chart-head">
                    <span className="chart-title">Monthly Trend (Line)</span>
                    <span className="chart-sub">Mock trend from KPIs</span>
                  </div>

                  {(() => {
                    const points = [
                      Math.round(computedReportData.totalSales * 0.85),
                      Math.round(computedReportData.totalSales * 0.92),
                      Math.round(computedReportData.totalSales * 1.02),
                      Math.round(computedReportData.totalSales * 0.98),
                      Math.round(computedReportData.totalSales * 1.12),
                      Math.round(computedReportData.totalSales * 1.06),
                    ]
                    const max = Math.max(...points) || 1
                    const min = Math.min(...points) || 0

                    const w = 280
                    const h = 160
                    const pad = 10
                    const scaleX = (i) => pad + (i * (w - pad * 2)) / (points.length - 1)
                    const scaleY = (val) => {
                      const denom = (max - min) || 1
                      return pad + (1 - (val - min) / denom) * (h - pad * 2)
                    }

                    const d = points
                      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(v)}`)
                      .join(' ')

                    const areaD = `${d} L ${scaleX(points.length - 1)} ${h - pad} L ${scaleX(0)} ${h - pad} Z`

                    return (
                      <div className="line-chart">
                        <svg width="100%" height="180" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                          <path d={areaD} fill="rgba(122,92,58,0.12)" />
                          <path d={d} fill="none" stroke="#7A5C3A" strokeWidth="3" strokeLinecap="round" />
                          {points.map((v, i) => (
                            <circle
                              key={i}
                              cx={scaleX(i)}
                              cy={scaleY(v)}
                              r="4"
                              fill="#C8A870"
                              stroke="#7A5C3A"
                              strokeWidth="2"
                            />
                          ))}
                        </svg>

                        <div className="line-xlabels">
                          <span>W1</span>
                          <span>W2</span>
                          <span>W3</span>
                          <span>W4</span>
                          <span>W5</span>
                          <span>W6</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Original report items (kept) */}
              <div className="report-content" style={{ marginTop: 16 }}>
                  <div className="report-item">
                  <span>Total Revenue ({salesPeriod === 'weekly' ? 'This Week' : 'This Month'})</span>
                  <strong>KSh {computedReportData.totalSales.toLocaleString()}</strong>
                </div>
                <div className="report-item">
                  <span>Total Units Sold</span>
                  <strong>{computedReportData.unitsThisMonth}</strong>
                </div>
                <div className="report-item">
                  <span>Average Transaction Value</span>
                  <strong>KSh {Math.round(computedReportData.totalSales / 50).toLocaleString()}</strong>
                </div>
                <div className="report-item">
                  <span>Active Discounts</span>
                  <strong>{computedReportData.discountsGiven}</strong>
                </div>
                <div className="report-item">
                  <span>Inventory Loss</span>
                  <strong>{computedReportData.shrinkage} units</strong>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard

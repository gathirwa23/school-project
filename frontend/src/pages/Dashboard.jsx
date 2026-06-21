import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, product: 'Shampoo 500ml', stock: 142, status: 'in-stock', price: 200 },
    { id: 2, product: 'Conditioner 1L', stock: 28, status: 'low-stock', price: 300 },
    { id: 3, product: 'Hair oil 250ml', stock: 7, status: 'low-stock', price: 150 },
    { id: 4, product: 'Treatment 200ml', stock: 0, status: 'out-of-stock', price: 250 },
  ])
  const reportData = {
    totalSales: 145000,
    unitsThisMonth: 342,
    discountsGiven: 12,
    shrinkage: 5,
  }
  const [filteredInventory, setFilteredInventory] = useState(inventoryItems)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:5000/api/me', {
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

  function filterInventory(status) {
    if (status === 'all') {
      setFilteredInventory(inventoryItems)
    } else {
      setFilteredInventory(inventoryItems.filter(item => item.status === status))
    }
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
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('reports')}
          >
            <span className="nav-icon">📊</span> Reports
          </div>
          <div className="nav-item"><span className="nav-icon">⚙️</span> Settings</div>
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
              🔍 <span>Search…</span>
            </div>
            <button className="notif-btn" aria-label="Notifications">
              🔔
              <span className="notif-badge">3</span>
            </button>
            <div className="av-lg">{initials}</div>
          </div>
        </div>

        {/* DASHBOARD SECTION */}
        {activeSection === 'dashboard' && (
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
                  <p>Hello <strong>{firstName}</strong>, you're logged in as a <strong>{user.role}</strong>.</p>
                  <p>This is your personal dashboard where you can manage your account and view important information.</p>
                  <ul className="info-list">
                    <li>✓ Account authenticated and secure</li>
                    <li>✓ Role-based access enabled</li>
                    <li>✓ Profile data synced</li>
                    <li>✓ Ready to explore</li>
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
                      <td>{item.product}</td>
                      <td>
                        <input 
                          type="number" 
                          value={item.stock} 
                          onChange={(e) => updateStock(item.id, parseInt(e.target.value))}
                          style={{ width: '60px', padding: '4px' }}
                        />
                      </td>
                      <td>KSh {item.price}</td>
                      <td>
                        <span className={`pill pill-${item.status === 'in-stock' ? 'ok' : item.status === 'low-stock' ? 'warn' : 'err'}`}>
                          {item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td><button className="btn-sm">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm">📊 Weekly</button>
                  <button className="btn-sm">📊 Monthly</button>
                  <button className="btn-sm">📥 Download</button>
                </div>
              </div>
              <div className="report-content">
                <div className="report-item">
                  <span>Total Revenue (This Month)</span>
                  <strong>KSh {reportData.totalSales.toLocaleString()}</strong>
                </div>
                <div className="report-item">
                  <span>Total Units Sold</span>
                  <strong>{reportData.unitsThisMonth}</strong>
                </div>
                <div className="report-item">
                  <span>Average Transaction Value</span>
                  <strong>KSh {Math.round(reportData.totalSales / 50).toLocaleString()}</strong>
                </div>
                <div className="report-item">
                  <span>Active Discounts</span>
                  <strong>{reportData.discountsGiven}</strong>
                </div>
                <div className="report-item">
                  <span>Inventory Loss</span>
                  <strong>{reportData.shrinkage} units</strong>
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

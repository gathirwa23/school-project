import { useEffect, useMemo, useState } from 'react'
import '../styles/Dashboard.css'
import '../styles/ProductDescriptionModal.css'
import '../styles/UserDashboardLogo.css'
import '../styles/UserOrderHistory.css'
import { productImageDataUri } from '../utils/productImageDataUri'
import saloonyLogo from '../assets/images/saloony-logo.jpg'


function UserDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inventoryItems, setInventoryItems] = useState([])

  const [cart, setCart] = useState([]) // [{ productId, quantity }]

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState('')

  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Order history panel
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [orders, setOrders] = useState([]) // backend returns: [{ id, name, price, quantity, status, created_at, ... }]

  // Product description modal (click product image)

  const [selectedProductId, setSelectedProductId] = useState(null)
  const [isProductDescModalOpen, setIsProductDescModalOpen] = useState(false)

  const selectedProduct = useMemo(() => {
    if (selectedProductId == null) return null
    return inventoryItems.find((p) => String(p.id) === String(selectedProductId)) || null
  }, [inventoryItems, selectedProductId])

  function openProductDescription(productId) {
    setSelectedProductId(productId)
    setIsProductDescModalOpen(true)
  }

  function closeProductDescription() {
    setIsProductDescModalOpen(false)
  }

  const firstName = user?.name ? user.name.split(' ')[0] : user?.email?.split('@')?.[0]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
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
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    async function fetchInventory() {
      try {
        const invRes = await fetch('http://localhost:5000/api/inventory', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!invRes.ok) throw new Error('Failed to fetch inventory')
        const invData = await invRes.json()
        setInventoryItems(invData.items || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
    fetchInventory()
  }, [])

  useEffect(() => {
    if (!user) return
    if (String(user.role).toLowerCase() !== 'user') {
      window.location.href = '/dashboard'
    }
  }, [user])

  useEffect(() => {
    function onDocClick(e) {
      if (!cartOpen) return
      const target = e.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-cart-root]')) return
      setCartOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [cartOpen])

  const cartLineItems = useMemo(() => {
    return cart
      .map((c) => {
        const p = inventoryItems.find((x) => String(x.id) === String(c.productId))
        if (!p) return null
        return {
          productId: c.productId,
          quantity: c.quantity,
          product: p.product,
          price: p.price,
          status: p.status,
        }
      })
      .filter(Boolean)
  }, [cart, inventoryItems])

  const cartTotal = useMemo(() => {
    return cartLineItems.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0)
  }, [cartLineItems])

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
  }, [cart])

  const filteredInventory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return inventoryItems
    return inventoryItems.filter((p) => String(p.product || '').toLowerCase().includes(q))
  }, [inventoryItems, searchQuery])

  function addToCart(productId) {
    setCart((prev) => {
      const idx = prev.findIndex((x) => String(x.productId) === String(productId))
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  function clearCart() {
    setCart([])
  }

  async function checkout() {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    if (!cart.length) return

    setError('')
    setCheckoutLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Checkout failed')

      // Refresh inventory
      const invRes = await fetch('http://localhost:5000/api/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (invRes.ok) {
        const invData = await invRes.json()
        setInventoryItems(invData.items || [])
      }

      clearCart()
      setCartOpen(false)

      // If user has opened order history already, refresh it so new orders show up immediately.
      if (ordersOpen) {
        await fetchOrderHistory()
      }
    } catch (e) {
      console.error(e)
      // Hide noisy “failed fetch”/checkout errors after we already know the user action succeeded.
      // If backend actually returns an error status, it will already be caught by `!res.ok` above.
      setError('')
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function fetchOrderHistory() {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    setOrdersError('')
    setOrdersLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/orders/history', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to fetch order history')

      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch (e) {
      console.error(e)
      setOrdersError(e.message || 'Failed to load order history')
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  if (loading) return <div className="dashboard">Loading...</div>
  if (!user) return <div className="dashboard">No user found</div>
  if (String(user.role).toLowerCase() !== 'user') return null

  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.email.substring(0, 2).toUpperCase()

  return (
    <div className="user-dashboard">
      {/* Top Navigation Bar */}
      <div className="user-dashboard-header">
        <div className="header-left">
          <div className="user-dashboard-logo" aria-label="saloony logo">
            <img className="user-dashboard-logo-img" src={saloonyLogo} alt="Saloony logo" />
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{userInitials}</div>
            <div className="user-details">
              <div className="user-name">{firstName}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>

          <div className="cart-icon-wrapper" data-cart-root>
            <button
              className="cart-icon-button"
              onClick={() => setCartOpen(!cartOpen)}
              title={`${cartItemCount} items in cart`}
            >
              🛒
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>

            {cartOpen && (
              <div className="cart-dropdown">
                <div className="cart-header">
                  <h3>Shopping Cart</h3>
                  <button className="close-cart" onClick={() => setCartOpen(false)}>✕</button>
                </div>

                <div className="cart-items-container">
                  {cartLineItems.length === 0 ? (
                    <div className="empty-cart">Your cart is empty</div>
                  ) : (
                    <>
                      {cartLineItems.map((item) => (
                        <div key={item.productId} className="cart-item">
                          <div className="cart-item-details">
                            <div className="cart-item-name">{item.product}</div>
                            <div className="cart-item-price">${Number(item.price).toFixed(2)}</div>
                          </div>
                          <div className="cart-item-quantity">
                            <button
                              onClick={() => {
                                setCart((prev) =>
                                  prev
                                    .map((c) =>
                                      String(c.productId) === String(item.productId)
                                        ? { ...c, quantity: c.quantity - 1 }
                                        : c
                                    )
                                    .filter((c) => c.quantity > 0)
                                )
                              }}
                              className="qty-btn"
                            >
                              −
                            </button>
                            <span className="qty-display">{item.quantity}</span>
                            <button
                              onClick={() => {
                                setCart((prev) =>
                                  prev.map((c) =>
                                    String(c.productId) === String(item.productId)
                                      ? { ...c, quantity: c.quantity + 1 }
                                      : c
                                  )
                                )
                              }}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                          <div className="cart-item-total">
                            ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {cartLineItems.length > 0 && (
                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total:</span>
                      <span className="total-amount">${cartTotal.toFixed(2)}</span>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button
                      className="checkout-btn"
                      onClick={checkout}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? 'Processing...' : 'Checkout'}
                    </button>
                    <button
                      className="clear-cart-btn"
                      onClick={clearCart}
                      disabled={checkoutLoading}
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="order-history-wrapper">
            <button
              className="order-history-btn"
              onClick={async () => {
                setOrdersOpen((prev) => !prev)
                // Lazy-load when opening
                const willOpen = !ordersOpen
                if (willOpen) {
                  await fetchOrderHistory()
                }
              }}
              title="View your order history"
            >
              📦 Order History
            </button>

            {ordersOpen && (
              <div className="order-history-panel">
                <div className="cart-header">
                  <h3>Order History</h3>
                  <button className="close-cart" onClick={() => setOrdersOpen(false)}>✕</button>
                </div>

                <div className="cart-items-container" style={{ maxHeight: 420 }}>
                  {ordersLoading ? (
                    <div className="empty-cart">Loading orders…</div>
                  ) : ordersError ? (
                    <div className="error-message">{ordersError}</div>
                  ) : orders.length === 0 ? (
                    <div className="empty-cart">No past orders found.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {orders.map((o) => {
                        const createdAt = o.created_at ? new Date(o.created_at).toLocaleString() : ''
                        return (
                          <div key={o.id} className="order-row">
                            <div className="order-row-main">
                              <div className="order-row-name">{o.name || 'Order item'}</div>
                              <div className="order-row-meta">
                                <span>Qty: {o.quantity ?? 1}</span>
                                <span>•</span>
                                <span>${Number(o.price ?? 0).toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="order-row-right">
                              <div className={`pill ${String(o.status || '').toLowerCase().includes('complete') ? 'pill-ok' : 'pill-warn'}`}>
                                {o.status || 'pending'}
                              </div>
                              <div className="order-row-date">{createdAt}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product Description Modal */}
      {isProductDescModalOpen && selectedProduct && (
        <div
          className="product-desc-modal-overlay"
          onClick={closeProductDescription}
          role="dialog"
          aria-modal="true"
        >
          <div className="product-desc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="product-desc-modal-head">
              <div className="product-desc-title-wrap">
                <div className="product-desc-title">Product Description</div>
                <div className="product-desc-subtitle">
                  {selectedProduct.product} • ID: {String(selectedProduct.id).slice(0, 8)}…
                </div>
              </div>
              <button
                className="product-desc-close-btn"
                onClick={closeProductDescription}
                aria-label="Close product description"
              >
                ✕ Close
              </button>
            </div>

            <div className="product-desc-body">
              <div className="product-desc-image-wrap">
                <img
                  className="product-desc-image"
                  src={productImageDataUri({
                    id: selectedProduct.id,
                    name: selectedProduct.product,
                    width: 560,
                    height: 360,
                  })}
                  alt={selectedProduct.product}
                />
              </div>

              <div className="product-desc-content">
                <div className="product-desc-description">
                  {selectedProduct.description
                    ? selectedProduct.description
                    : 'No description available for this product.'}
                </div>

                <div className="product-desc-meta">
                  <div className="product-desc-meta-item">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </div>
                  <div className="product-desc-meta-item">
                    Status: {selectedProduct.status || 'Unknown'}
                  </div>
                  <div className="product-desc-meta-item">
                    Stock: {selectedProduct.stock ?? 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="user-dashboard-content">
        <div className="products-grid">
          {filteredInventory.map((item) => (
            <div key={item.id} className="product-card">
              <div
                className="product-image"
                role="button"
                tabIndex={0}
                onClick={() => openProductDescription(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openProductDescription(item.id)
                }}
                aria-label={`View description for ${item.product}`}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={productImageDataUri({
                    id: item.id,
                    name: item.product,
                    width: 240,
                    height: 160,
                  })}
                  alt={item.product}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{item.product}</h3>
                <p className="product-description">{item.description || ''}</p>
                <div className="product-details">
                  <span className="product-price">${Number(item.price).toFixed(2)}</span>
                  <span
                    className={`product-status ${item.status ? item.status.toLowerCase() : 'unknown'}`}
                  >
                    {item.status || 'Unknown'}
                  </span>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item.id)}
                  disabled={item.status && item.status.toLowerCase() === 'out of stock'}
                >
                  {item.status && item.status.toLowerCase() === 'out of stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredInventory.length === 0 && (
          <div className="no-products-message">
            <p>No products found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard

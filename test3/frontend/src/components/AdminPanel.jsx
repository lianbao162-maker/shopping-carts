import React, { useState, useEffect } from 'react'
import { fetchAllUserCarts } from '../api'

export default function AdminPanel() {
  const [allUserCarts, setAllUserCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAllUserCarts()
  }, [])

  const loadAllUserCarts = async () => {
    try {
      setLoading(true)
      const data = await fetchAllUserCarts()
      setAllUserCarts(data)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load user carts')
    } finally {
      setLoading(false)
    }
  }

  const getTotalValue = (items) =>
    items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0)

  const totalUsers = allUserCarts.length
  const totalItems = allUserCarts.reduce((sum, u) => sum + u.items.length, 0)
  const totalValue = allUserCarts.reduce((sum, u) => sum + getTotalValue(u.items), 0)

  if (loading) return (
    <div className="admin-dashboard">
      <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Loading all carts...</p>
    </div>
  )

  if (error) return (
    <div className="admin-dashboard">
      <p style={{ color: 'var(--danger-color)', padding: '1rem' }}>Error: {error}</p>
    </div>
  )

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <button className="admin-refresh-btn" onClick={loadAllUserCarts}>↻ Refresh</button>
      </div>

      {/* Summary Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totalUsers}</div>
          <div className="admin-stat-label">Active Shoppers</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totalItems}</div>
          <div className="admin-stat-label">Total Cart Items</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">A${totalValue.toFixed(2)}</div>
          <div className="admin-stat-label">Total Cart Value</div>
        </div>
      </div>

      {/* All User Carts */}
      <h2 className="admin-section-title">All User Carts</h2>

      {allUserCarts.length === 0 ? (
        <div className="admin-empty">No users have items in their cart yet.</div>
      ) : (
        <div className="admin-carts-grid">
          {allUserCarts.map(({ user, items }) => (
            <div key={user._id} className="admin-user-card">
              <div className="admin-user-header">
                <div>
                  <div className="admin-user-name">{user.name}</div>
                  <div className="admin-user-email">{user.email}</div>
                </div>
                <div className="admin-user-badge">{user.role}</div>
              </div>

              {items.length === 0 ? (
                <p className="admin-cart-empty">Empty cart</p>
              ) : (
                <>
                  <table className="admin-cart-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item._id}>
                          <td>{item.productId?.name || 'Unknown'}</td>
                          <td>A${item.productId?.price?.toFixed(2) || '0.00'}</td>
                          <td>{item.quantity}</td>
                          <td>A${((item.productId?.price || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="admin-cart-total">
                    Cart Total: <strong>A${getTotalValue(items).toFixed(2)}</strong>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

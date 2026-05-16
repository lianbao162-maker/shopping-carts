import React, { useState } from 'react'
import Products from './Products'
import Cart from './Cart'
import ProfileSection from './ProfileSection'
import AdminPanel from './AdminPanel'

export default function ShopPage({ currentUser, onLogout, onAddToCart, onUserUpdate, cartRefreshKey }) {
  const [activeTab, setActiveTab] = useState('shop')
  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="shop-page">
      {/* Header */}
      <header className="shop-header">
        <div className="shop-navbar">
          <div className="shop-logo">
            <svg className="shop-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            ShopHub
          </div>

          <div className="shop-nav-center">
            {isAdmin ? (
              <span className="shop-tab active">⚙️ Admin Dashboard</span>
            ) : (
              <>
                <button
                  className={`shop-tab ${activeTab === 'shop' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shop')}
                >
                  🛍️ Shop
                </button>
                <button
                  className={`shop-tab ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  👤 My Profile
                </button>
              </>
            )}
          </div>

          <div className="shop-nav-right">
            <div className="user-info">
              <p>Welcome, <strong>{currentUser?.name || 'User'}</strong></p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                {isAdmin ? '⚙️ Admin' : '🛍️ Customer'}
              </p>
            </div>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {isAdmin ? (
        <AdminPanel />
      ) : activeTab === 'shop' ? (
        <div className="shop-container">
          <Products onAddToCart={onAddToCart} />
          <Cart key={currentUser?._id} refreshKey={cartRefreshKey} />
        </div>
      ) : (
        <div className="profile-page-container">
          <ProfileSection currentUser={currentUser} onUpdate={onUserUpdate} />
        </div>
      )}
    </div>
  )
}

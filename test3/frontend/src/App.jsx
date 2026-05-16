import React, { useState, useEffect } from 'react'
import { fetchCurrentUser, addItemToCart as addToCartAPI } from './api'
import LoginPage from './components/LoginPage'
import ShopPage from './components/ShopPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartRefreshKey, setCartRefreshKey] = useState(0)

  useEffect(() => {
    bootstrapAuth()
  }, [])

  const bootstrapAuth = async () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const user = await fetchCurrentUser()
      setCurrentUser(user)
      setIsAuthenticated(true)
    } catch (err) {
      localStorage.removeItem('authToken')
      setIsAuthenticated(false)
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = async () => {
    try {
      const user = await fetchCurrentUser()
      setCurrentUser(user)
      setIsAuthenticated(true)
    } catch (err) {
      console.error('Failed to fetch user after login:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  const handleAddToCart = async (productId, productName) => {
    try {
      await addToCartAPI(productId, 1)
      setCartRefreshKey(k => k + 1)
    } catch (err) {
      alert('Failed to add item to cart: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <ShopPage
      currentUser={currentUser}
      onLogout={handleLogout}
      onAddToCart={handleAddToCart}
      onUserUpdate={() => bootstrapAuth()}
      cartRefreshKey={cartRefreshKey}
    />
  )
}

import React, { useState, useEffect } from 'react'
import { fetchCart, addItemToCart, updateCartItem, deleteCartItem, clearCart } from '../api'

export default function Cart({ refreshKey }) {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCart()
  }, [refreshKey])

  const loadCart = async () => {
    try {
      setLoading(true)
      const items = await fetchCart()
      setCartItems(items)
      calculateTotal(items)
      setError('')
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('token')) {
        setError('Please login to view your cart')
      } else {
        setError(err.message || 'Failed to load cart')
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      const price = item.productId?.price || 0
      return acc + price * item.quantity
    }, 0)
    setTotal(sum)
  }

  const handleIncreaseQty = async (itemId, currentQty) => {
    try {
      await updateCartItem(itemId, currentQty + 1)
      loadCart()
    } catch (err) {
      setError('Failed to update quantity')
    }
  }

  const handleDecreaseQty = async (itemId, currentQty) => {
    if (currentQty <= 1) {
      handleRemoveItem(itemId)
      return
    }
    try {
      await updateCartItem(itemId, currentQty - 1)
      loadCart()
    } catch (err) {
      setError('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteCartItem(itemId)
      loadCart()
    } catch (err) {
      setError('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return
    try {
      await clearCart()
      loadCart()
    } catch (err) {
      setError('Failed to clear cart')
    }
  }

  const handleCheckout = () => {
    alert(`Checkout: A$${total.toFixed(2)}`)
  }

  if (loading) return <div className="cart-section"><p>Loading cart...</p></div>
  if (error) return <div className="cart-section"><p style={{ color: 'red' }}>{error}</p></div>

  return (
    <div className="cart-section">
      <h2>🛒 Cart</h2>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <ul className="cart-items-list">
            {cartItems.map(item => (
              <li key={item._id} className="cart-item">
                <div className="cart-item-name">{item.productId?.name || 'Unknown'}</div>
                <div className="cart-item-price">
                  A${item.productId?.price?.toFixed(2) || '0.00'} each
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => handleDecreaseQty(item._id, item.quantity)}>−</button>
                  <span className="cart-item-qty">{item.quantity}</span>
                  <button onClick={() => handleIncreaseQty(item._id, item.quantity)}>+</button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <span className="cart-total-label">Total:</span>
            <span className="cart-total-amount">A${total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout (A${total.toFixed(2)})
          </button>

          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { fetchProducts } from '../api'

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, products])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchProducts()
      setProducts(data)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    const term = searchTerm.toLowerCase()
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    )
    setFilteredProducts(filtered)
  }

  if (loading) return <div className="products-section"><p>Loading products...</p></div>
  if (error) return <div className="products-section"><p style={{ color: 'red' }}>{error}</p></div>

  return (
    <div className="products-section">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.imageURL
                ? <img src={`http://localhost:3000${product.imageURL}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.4rem' }} />
                : '📦'
              }
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">A${product.price.toFixed(2)}</p>
            <p className="product-stock">
              {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
            </p>
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product._id, product.name)}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          No products found
        </p>
      )}
    </div>
  )
}

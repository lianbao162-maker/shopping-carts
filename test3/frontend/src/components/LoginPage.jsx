import React, { useState, useEffect } from 'react'
import { registerUser, loginUser } from '../api'

export default function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('register') // 'register', 'login', 'admin'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  // Register form
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // Admin form
  const [adminForm, setAdminForm] = useState({ email: '', password: '' })

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })
  }

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value })
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = await registerUser(registerForm.name, registerForm.email, registerForm.password)
      localStorage.setItem('authToken', data.token)
      setMessage('Registration successful!')
      setIsError(false)
      setTimeout(() => onLoginSuccess(), 500)
    } catch (err) {
      setMessage(err.message || 'Registration failed')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = await loginUser(loginForm.email, loginForm.password)
      localStorage.setItem('authToken', data.token)
      setMessage('Login successful!')
      setIsError(false)
      setTimeout(() => onLoginSuccess(), 500)
    } catch (err) {
      setMessage(err.message || 'Login failed')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = await loginUser(adminForm.email, adminForm.password)
      localStorage.setItem('authToken', data.token)
      setMessage('Admin login successful!')
      setIsError(false)
      setTimeout(() => onLoginSuccess(), 500)
    } catch (err) {
      setMessage(err.message || 'Admin login failed')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="entry-page">
      <div className="entry-shell">
        <div className="entry-header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h1>ShopHub</h1>
          </div>
          <p>Choose your account path before entering the ShopHub page.</p>
        </div>

        <div className="entry-choice-row">
          <button
            className={`entry-choice-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register as Customer
          </button>
          <button
            className={`entry-choice-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login as Customer
          </button>
          <button
            className={`entry-choice-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Login as Admin
          </button>
        </div>

        {message && (
          <div className={`status-message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {activeTab === 'register' && (
          <section className="entry-panel active">
            <h2>Customer Registration</h2>
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                required
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                minLength="6"
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Customer Account'}
              </button>
            </form>
          </section>
        )}

        {activeTab === 'login' && (
          <section className="entry-panel active">
            <h2>Customer Login</h2>
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <input
                type="email"
                name="email"
                placeholder="Customer Email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login as Customer'}
              </button>
            </form>
            <p className="entry-hint">Default test customer: test@example.com / password123</p>
          </section>
        )}

        {activeTab === 'admin' && (
          <section className="entry-panel active">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminSubmit} className="auth-form">
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={adminForm.email}
                onChange={handleAdminChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={adminForm.password}
                onChange={handleAdminChange}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </form>
            <p className="entry-hint">Default admin: admin@shophub.local / admin123456</p>
          </section>
        )}
      </div>
    </div>
  )
}

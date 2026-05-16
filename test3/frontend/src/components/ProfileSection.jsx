import React, { useState } from 'react'
import { updateUserProfile, updatePassword } from '../api'

export default function ProfileSection({ currentUser, onUpdate }) {
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  })
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updateUserProfile(profileForm.name, profileForm.email)
      setMessage('Profile updated successfully!')
      setIsError(false)
      if (onUpdate) onUpdate()
    } catch (err) {
      setMessage(err.message || 'Failed to update profile')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match')
      setIsError(true)
      setLoading(false)
      return
    }

    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setMessage('Password updated successfully!')
      setIsError(false)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setMessage(err.message || 'Failed to update password')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-section">
      <h2>User Profile</h2>

      {message && (
        <div className={`status-message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleProfileSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profileForm.name}
            onChange={handleProfileChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
          Change Password
        </h3>

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

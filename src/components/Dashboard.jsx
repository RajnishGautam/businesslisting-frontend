import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api"
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [authToken, setAuthToken] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [business, setBusiness] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    image: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Load token first
  useEffect(() => {
    const saved = localStorage.getItem('token')
    if (!saved) {
      navigate('/')
      return
    }
    setAuthToken(saved)
    setCheckingAuth(false)
  }, [])

  // Fetch business only after token is ready
  useEffect(() => {
    if (!checkingAuth && authToken) {
      fetchBusiness()
    }
  }, [checkingAuth, authToken])

  const fetchBusiness = async () => {
    try {
      const res = await api.get('/api/business/my-business', {
        headers: { Authorization: `Bearer ${authToken}` }
      })

      if (res.data) {
        setBusiness(res.data)
        setFormData(res.data)
      } else {
        navigate('/create-listing')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/')
      } else {
        navigate('/create-listing')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5000000) {
      setError('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result
      })
    }
    reader.readAsDataURL(file)
  }

  const handleUpdate = async e => {
    e.preventDefault()
    setUpdating(true)
    setError('')

    try {
      const res = await api.put(`/api/business/${business._id}`, formData, {
        headers: { Authorization: `Bearer ${authToken}` }
      })

      setBusiness(res.data.business)
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    setFormData(business)
    setIsEditing(false)
    setError('')
  }

  if (checkingAuth || loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Business Dashboard</h2>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Listing
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-form">

          <div className="form-row">
            <div className="form-group">
              <label>Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Change Business Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="save-button" type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
            <button className="cancel-button" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>

        </form>
      ) : (
        <>
          <div className="business-display">
            <div className="business-image">
              <img src={business.image} alt={business.businessName} />
            </div>

            <div className="business-details">
              <div className="detail-item">
                <strong>Name</strong>
                <span>{business.businessName}</span>
              </div>
              <div className="detail-item">
                <strong>Category</strong>
                <span>{business.category}</span>
              </div>
              <div className="detail-item">
                <strong>Description</strong>
                <span>{business.description}</span>
              </div>

              <div className="detail-item">
                <strong>Email</strong>
                <span>{business.email}</span>
              </div>

              <div className="detail-item">
                <strong>Phone</strong>
                <span>{business.phone}</span>
              </div>

              <div className="detail-item">
                <strong>Address</strong>
                <span>{business.address}</span>
              </div>

              <div className="detail-item">
                <strong>City</strong>
                <span>{business.city}</span>
              </div>

              <div className="rating-summary">
                <div className="rating-box">
                  <span className="rating-number">
                    {business.averageRating.toFixed(1)}
                  </span>
                  <span className="rating-label">Average Rating</span>
                </div>

                <div className="rating-box">
                  <span className="rating-number">{business.totalRatings}</span>
                  <span className="rating-label">Total Reviews</span>
                </div>
              </div>
            </div>
          </div>

          <div className="reviews-section">
            <h3>Customer Reviews</h3>

            {business.ratings.length === 0 && (
              <p className="no-reviews">No reviews yet</p>
            )}

            <div className="reviews-list">
              {business.ratings.map(r => (
                <div className="review-card" key={r._id}>
                  <div className="review-header">
                    <span className="review-user">{r.userName}</span>
                    <span className="review-stars">{'★'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="review-comment">{r.comment}</p>}
                  <span className="review-date">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard

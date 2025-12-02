import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api"
import AdminBusinessForm from './AdminBusinessForm';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [allRes, adminRes] = await Promise.all([
        api.get('/api/business/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/api/business/admin/listings', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAllBusinesses(allRes.data);
      setAdminListings(adminRes.data);
      setUserListings(allRes.data.filter(b => !b.isAdminListing));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/');
      } else {
        setError('Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business')) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/business/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) {
      setError('Failed to delete business');
    }
  };

  const handleEdit = (business) => {
    setEditingBusiness(business);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingBusiness(null);
    fetchAllData();
  };

  const getActiveList = () => {
    let list = activeTab === 'admin' ? adminListings :
               activeTab === 'user' ? userListings :
               allBusinesses;

    return list.filter(item =>
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">

      <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <div className="header-right">
          <button
            className="add-business-btn"
            onClick={() => setShowAddForm(true)}
          >
            Add New Business
          </button>

          <div className="adminsearch-bar">
            <input
              type="text"
              className="adminsearch-input"
              placeholder="Search company name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Businesses ({allBusinesses.length})
        </button>

        <button
          className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          Admin Listings ({adminListings.length})
        </button>

        <button
          className={`tab ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          User Listings ({userListings.length})
        </button>
      </div>

      <div className="business-table-container">
        <table className="business-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Listing Type</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {getActiveList().map(business => (
              <tr key={business._id}>
                <td>
                  <img
                    src={business.image}
                    className="business-img"
                    alt={business.businessName}
                  />
                </td>

                <td>{business.businessName}</td>
                <td>{business.category}</td>
                <td>{business.email}</td>
                <td>{business.phone}</td>
                <td>{business.address}</td>

                <td>
                  <span
                    className={`listing-type ${business.isAdminListing ? 'admin-type' : 'user-type'}`}
                  >
                    {business.isAdminListing ? 'Admin Listing' : 'User Listing'}
                  </span>
                </td>

                <td>
                  {business.userId
                    ? `${business.userId.name} , (${business.userId.email})`
                    : 'Admin Added'}
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(business)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(business._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {showAddForm && (
        <AdminBusinessForm
          onClose={handleFormClose}
          editingBusiness={editingBusiness}
        />
      )}
    </div>
  );
}

export default AdminDashboard;

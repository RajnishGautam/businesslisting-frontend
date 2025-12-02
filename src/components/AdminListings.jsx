import React, { useEffect, useState } from 'react';
import api from "../api"
import BusinessDetailModal from './BusinessDetailModal';
import './AdminListings.css'; // can reuse Home.css or copy it

function AdminListings() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [availableCities, setAvailableCities] = useState([]);

  const categories = ['Restaurant', 'Retail', 'Technology', 'Healthcare', 'Education', 'Real Estate', 'Other'];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    const cities = [...new Set(businesses.map(b => b.city))].sort();
    setAvailableCities(cities);
  }, [businesses]);

  useEffect(() => {
    filterBusinesses();
  }, [searchTerm, selectedCategory, selectedCity, businesses]);

  const fetchBusinesses = async () => {
    try {
      const res = await api.get('/api/business/admin/public-listings'); // public admin listings API
      setBusinesses(res.data);
      setFilteredBusinesses(res.data);
    } catch (err) {
      console.error('Error fetching admin listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = businesses;
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }
    if (selectedCity) {
      filtered = filtered.filter(b => b.city.toLowerCase() === selectedCity.toLowerCase());
    }
    setFilteredBusinesses(filtered);
  };

  const handleSearchChange = e => setSearchTerm(e.target.value);
  const handleCategoryChange = e => setSelectedCategory(e.target.value);
  const handleCityChange = e => setSelectedCity(e.target.value);
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCity('');
  };
  const handleBusinessClick = business => setSelectedBusiness(business);
  const handleCloseModal = () => setSelectedBusiness(null);

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push(<span key={i} className="star filled">★</span>);
    if (hasHalfStar) stars.push(<span key="half" className="star half">★</span>);
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) stars.push(<span key={`empty-${i}`} className="star">★</span>);
    return stars;
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedCity;

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Admin Listed Businesses</h1>
        <p className="hero-subtitle">Explore businesses curated by our admin</p>
      </div>

      <div className="filter-section">
        <input type="text" placeholder="Search businesses..." value={searchTerm} onChange={handleSearchChange} className="search-input" />
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-filter">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedCity} onChange={handleCityChange} className="city-filter">
          <option value="">All Cities</option>
          {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        {hasActiveFilters && <button onClick={handleClearFilters} className="clear-filters-btn">Clear Filters</button>}
      </div>

      <div className="results-info">
        <p>{filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found</p>
      </div>

      {loading ? (
        <div className="loading">Loading businesses...</div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="no-results">
          <p>No businesses found</p>
          {hasActiveFilters && <button onClick={handleClearFilters} className="clear-filters-btn-large">Clear All Filters</button>}
        </div>
      ) : (
        <div className="business-grid">
          {filteredBusinesses.map(b => (
            <div key={b._id} className="business-card" onClick={() => handleBusinessClick(b)}>
              <div className="card-image">
                <img src={b.image} alt={b.businessName} />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="business-name">{b.businessName}</h3>
                  <span className="business-category">{b.category}</span>
                </div>
                <div className="rating-display">
                  <div className="stars">{renderStars(b.averageRating || 0)}</div>
                  <span className="rating-text">{b.averageRating || 0} ({b.totalRatings || 0} reviews)</span>
                </div>
                <p className="business-description">{b.description}</p>
                <div className="business-info">
                  <div className="info-item"><strong>📍</strong> <span>{b.city}</span></div>
                  <div className="info-item"><strong>📧</strong> <span>{b.email}</span></div>
                  <div className="info-item"><strong>📞</strong> <span>{b.phone}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBusiness && (
        <BusinessDetailModal business={selectedBusiness} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default AdminListings;

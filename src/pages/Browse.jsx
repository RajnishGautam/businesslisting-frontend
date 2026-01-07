import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BrowseSkeleton from "../components/BrowseSkeleton";
import api from "../api";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaFire,
  FaUtensils,
  FaShoppingBag,
  FaLaptopCode,
  FaHospital,
  FaGraduationCap,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";
import BusinessDetailModal from "../components/BusinessDetailModal";
import ContactFormModal from "../components/ContactFormModal";
import "./Browse.css";

function Browse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || ""
  );
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showContactForm, setShowContactForm] = useState(null);
  const [revealedPhones, setRevealedPhones] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    const cities = [...new Set(businesses.map((b) => b.city))].sort();
    setAvailableCities(cities);
  }, [businesses]);

  useEffect(() => {
    filterBusinesses();
    updateURL();
  }, [searchTerm, selectedCategory, selectedCity, businesses]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get("/api/business");
      setBusinesses(response.data);
      setFilteredBusinesses(response.data);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(
        (business) =>
          business.businessName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          business.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (business) => business.category === selectedCategory
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(
        (business) => business.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    setFilteredBusinesses(filtered);
  };

  const updateURL = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedCity) params.city = selectedCity;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCity("");
    setSearchParams({});
  };

  const handleReviewClick = (business) => {
    setSelectedBusiness(business);
  };

  const handlePhoneClick = (business) => {
    if (revealedPhones[business._id]) {
      return;
    }
    setShowContactForm(business);
  };

  const handleContactSuccess = (phone) => {
    setRevealedPhones((prev) => ({
      ...prev,
      [showContactForm._id]: phone,
    }));
    setShowContactForm(null);
  };

  const handleCloseModal = () => {
    setSelectedBusiness(null);
    fetchBusinesses();
  };

  const categories = [
    "Restaurant",
    "Retail",
    "Technology",
    "Healthcare",
    "Education",
    "Real Estate",
    "Other",
  ];

  const getCategoryIcon = (category) => {
    const iconMap = {
      Restaurant: <FaUtensils />,
      Retail: <FaShoppingBag />,
      Technology: <FaLaptopCode />,
      Healthcare: <FaHospital />,
      Education: <FaGraduationCap />,
      "Real Estate": <FaBuilding />,
      Other: <FaBriefcase />,
    };
    return iconMap[category] || <FaBriefcase />;
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedCity;

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1 className="browse-title">Browse All Businesses</h1>
        <p className="browse-subtitle">
          Explore and discover amazing local businesses
        </p>
      </div>

      <div className="browse-filters">
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="browse-search-input"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="browse-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="browse-select"
          >
            <option value="">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="browse-clear-btn">
              Clear All
            </button>
          )}
        </div>

        <div className="results-count">
          <span>{filteredBusinesses.length} businesses found</span>
          {selectedCategory && (
            <span className="filter-tag">
              {selectedCategory}
              <button
                className="filter-remove"
                onClick={() => setSelectedCategory("")}
              >
                ×
              </button>
            </span>
          )}
          {selectedCity && (
            <span className="filter-tag">
              {selectedCity}
              <button
                className="filter-remove"
                onClick={() => setSelectedCity("")}
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="browse-list">
          {Array.from({ length: 6 }).map((_, i) => (
            <BrowseSkeleton key={i} />
          ))}
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="browse-no-results">
          <p>No businesses found matching your criteria</p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="browse-clear-btn-large"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="browse-list">
          {filteredBusinesses.map((business) => (
            <div key={business._id} className="browse-card">
              {/* Left Image Section */}
              <div className="browse-card-image-wrapper">
                <img
                  src={business.image}
                  alt={business.businessName}
                  loading="lazy"
                  className="browse-card-image"
                  onLoad={(e) => e.target.classList.add("loaded")}
                />
                <span className="browse-verified-badge">
                  <FaCheckCircle /> verified
                </span>
                {business.trending && (
                  <span className="browse-trending-badge">
                    <FaFire /> Trending
                  </span>
                )}
              </div>

              {/* Right Content Section */}
              <div className="browse-card-content">
                <div>
                  <div className="browse-card-header">
                    <div className="browse-title-section">
                      <h2 className="browse-business-name">
                        <span className="browse-category-icon">
                          {getCategoryIcon(business.category)}
                        </span>
                        {business.businessName}
                      </h2>

                      <div className="browse-rating-reviews">
                        <div className="browse-rating-badge">
                          {(business.averageRating || 0).toFixed(1)} <FaStar />
                        </div>
                        <button
                          className="browse-reviews-count"
                          onClick={() => handleReviewClick(business)}
                        >
                          {business.totalRatings || 0} Ratings
                        </button>
                      </div>

                      <div className="browse-info-row">
                        <FaMapMarkerAlt className="browse-info-icon" />
                        <span>
                          {business.address}, {business.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="browse-card-actions">
                  <button
                    className={`browse-action-btn browse-phone-btn ${
                      revealedPhones[business._id] ? "revealed" : ""
                    }`}
                    onClick={() => handlePhoneClick(business)}
                  >
                    <FaPhone />
                    {revealedPhones[business._id] || "View Phone Number"}
                  </button>

                  {revealedPhones[business._id] && (
                    <a
                      href={`https://wa.me/${revealedPhones[
                        business._id
                      ].replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="browse-action-btn browse-whatsapp-btn"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>
                  )}

                  <button
                    className="browse-action-btn browse-enquiry-btn"
                    onClick={() => handleReviewClick(business)}
                  >
                    <FaEnvelope />
                    Send Enquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          onClose={handleCloseModal}
        />
      )}

      {showContactForm && (
        <ContactFormModal
          business={showContactForm}
          onClose={() => setShowContactForm(null)}
          onSuccess={handleContactSuccess}
        />
      )}
    </div>
  );
}

export default Browse;

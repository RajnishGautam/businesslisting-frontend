import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FaArrowLeft,
  FaClock,
  FaUser,
} from "react-icons/fa";
import ContactFormModal from "../components/ContactFormModal";
import "./BusinessDetail.css"; // Create this CSS file

function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealedPhone, setRevealedPhone] = useState(false);
  const [showContactForm, setShowContactForm] = useState(null);

  useEffect(() => {
    fetchBusinessDetail();
  }, [id]);

  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/business/${id}`);
      setBusiness(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Business not found");
      } else {
        setError("Failed to fetch business details");
      }
      console.error("Error fetching business:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePhoneReveal = () => {
    if (!revealedPhone) {
      setShowContactForm(business);
    }
  };

  const handleContactSuccess = (phone) => {
    setRevealedPhone(phone);
    setShowContactForm(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="business-detail-container">
        <div className="business-detail-content">
          <div className="animate-pulse">
            <div className="back-button-skeleton"></div>
            <div className="detail-card-skeleton">
              <div className="image-skeleton"></div>
              <div className="content-skeleton">
                <div className="title-skeleton"></div>
                <div className="subtitle-skeleton"></div>
                <div className="text-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="business-detail-container">
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">😕</div>
            <h2>Oops!</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate("/browse")}
              className="back-button-error"
            >
              <FaArrowLeft /> Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="business-detail-container">
      <div className="business-detail-content">
        <button
          onClick={() => navigate("/browse")}
          className="back-button"
        >
          <FaArrowLeft /> Back to Browse
        </button>

        <div className="detail-card">
          <div className="hero-section">
            <img
              src={business.image}
              alt={business.businessName}
              className="hero-image"
            />
            <div className="hero-overlay"></div>
            
            <div className="hero-badges">
              <span className="verified-badge">
                <FaCheckCircle /> Verified
              </span>
              {business.trending && (
                <span className="trending-badge">
                  <FaFire /> Trending
                </span>
              )}
            </div>

            <div className="hero-content">
              <div className="hero-header">
                <span className="category-icon-large">
                  {getCategoryIcon(business.category)}
                </span>
                <span className="category-badge">
                  {business.category}
                </span>
              </div>
              <h1 className="business-title">{business.businessName}</h1>
              <div className="rating-section">
                <div className="rating-badge-large">
                  <FaStar />
                  <span>{(business.averageRating || 0).toFixed(1)}</span>
                </div>
                <span className="ratings-text">
                  {business.totalRatings || 0} Ratings
                </span>
              </div>
            </div>
          </div>

          <div className="detail-content">
            <div className="info-grid">
              <div className="info-card">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <p className="info-label">Location</p>
                  <p className="info-value">
                    {business.address}, {business.city}
                  </p>
                </div>
              </div>
              <div className="info-card">
                <FaClock className="info-icon" />
                <div>
                  <p className="info-label">Listed On</p>
                  <p className="info-value">
                    {formatDate(business.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="description-section">
              <h2>About This Business</h2>
              <p>{business.description}</p>
            </div>

            <div className="actions-grid">
              <button
                onClick={handlePhoneReveal}
                className={`action-button phone-button ${
                  revealedPhone ? "revealed" : ""
                }`}
              >
                <FaPhone />
                {revealedPhone || "View Phone Number"}
              </button>

              {revealedPhone && (
                <a
                  href={`https://wa.me/${revealedPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button whatsapp-button"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              )}

              <button
                onClick={() => setShowContactForm(business)}
                className="action-button enquiry-button"
              >
                <FaEnvelope />
                Send Enquiry
              </button>
            </div>

            {business.ratings && business.ratings.length > 0 && (
              <div className="reviews-section">
                <h2>Customer Reviews</h2>
                <div className="reviews-list">
                  {business.ratings.map((rating, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <FaUser />
                          <span>{rating.userName}</span>
                        </div>
                        <div className="review-rating">
                          <FaStar />
                          <span>{rating.rating}</span>
                        </div>
                      </div>
                      {rating.comment && (
                        <p className="review-comment">{rating.comment}</p>
                      )}
                      <p className="review-date">
                        {formatDate(rating.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default BusinessDetail;
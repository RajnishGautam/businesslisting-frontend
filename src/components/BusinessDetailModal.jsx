import React, { useState, useEffect } from "react";
import api from "../api"
import "./BusinessDetailModal.css";

function BusinessDetailModal({ business, onClose }) {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchRatings();
    checkAuth();
  }, [business._id]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  const fetchRatings = async () => {
    try {
      const response = await api.get(`/api/rating/${business._id}`);
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);

      // Check if user already rated
      const token = localStorage.getItem("token");
      if (token) {
        const user = JSON.parse(localStorage.getItem("user"));
        const existingRating = response.data.ratings.find(
          (r) => r.userId === user.id
        );
        if (existingRating) {
          setUserRating(existingRating.rating);
          setUserComment(existingRating.comment);
        }
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Please login to rate this business");
      return;
    }

    if (userRating === 0) {
      setError("Please select a rating");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/api/rating/${business._id}`,
        { rating: userRating, comment: userComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Rating submitted successfully!");
      fetchRatings();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!window.confirm("Are you sure you want to delete your rating?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/rating/${business._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRating(0);
      setUserComment("");
      setSuccess("Rating deleted successfully!");
      fetchRatings();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete rating");
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star-icon ${interactive ? "interactive" : ""} ${
            i <= (interactive ? hoverRating || userRating : rating)
              ? "filled"
              : ""
          }`}
          onClick={interactive ? () => setUserRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="business-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        

        <div className="modal-body">
          {isAuthenticated && (
            <div className="rating-form-section">
              <h3>
                {userRating > 0 ? "Update Your Rating" : "Rate This Business"}
              </h3>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleRatingSubmit}>
                <div className="rating-input">
                  <label>Your Rating:</label>
                  <div className="stars-input">
                    {renderStars(userRating, true)}
                  </div>
                </div>

                <div className="comment-input">
                  <label htmlFor="comment">Your Review (Optional):</label>
                  <textarea
                    id="comment"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows="4"
                  />
                </div>

                <div className="rating-actions">
                  <button
                    type="submit"
                    className="submit-rating-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : userRating > 0
                      ? "Update Rating"
                      : "Submit Rating"}
                  </button>
                  {userRating > 0 && (
                    <button
                      type="button"
                      className="delete-rating-btn"
                      onClick={handleDeleteRating}
                    >
                      Delete Rating
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {!isAuthenticated && (
            <div className="login-prompt">
              <p>Please login to rate this business</p>
            </div>
          )}

          <div className="reviews-section">
            <h3>Customer Reviews ({totalRatings})</h3>

            {ratings.length === 0 ? (
              <p className="no-reviews">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="reviews-list">
                {ratings.map((rating, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>{rating.userName}</strong>
                        <span className="review-date">
                          {formatDate(rating.createdAt)}
                        </span>
                      </div>
                      <div className="review-stars">
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="review-comment">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetailModal;

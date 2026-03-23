import React, { useState, useEffect, useMemo } from 'react';
import { FiThumbsUp, FiMoreHorizontal } from 'react-icons/fi';

const TravellerFeedback = ({ tours = [] }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Simulate Fetching Reviews from an API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // In reality: const res = await fetch(`http://localhost:5000/api/reviews`);
        // For now, using mock data that links to your tour IDs
        const mockReviews = [
          {
            id: 101,
            tour_id: 1, // Matches Angkor Wat ID
            userName: "Raksantra Seam",
            contributions: 8,
            rating: 5,
            title: "Great full day tour",
            comment: "We had a wonderful full day tour of the floating village, lake, mangroves forest, artisan workshops, temple...",
            tourName: "Floating Village-Mangrove Forest Private Tonle Sap Lake Boat Tour",
            date: "January 2, 2026",
            likes: 0
          },
          {
            id: 102,
            tour_id: 2,
            userName: "Sophea Chea",
            contributions: 12,
            rating: 5,
            title: "Unforgettable Experience",
            comment: "This tour was incredible. The floating village is a sight to behold, and our guide was fantastic.",
            tourName: "Phnom Kulen Waterfall Day Trip",
            date: "February 15, 2026",
            likes: 2
          }
        ];
        setReviews(mockReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 2. Dynamic Filtering: Only show reviews for tours currently in the filtered list
  const visibleReviews = useMemo(() => {
    const tourIds = tours.map(t => t.id || t.tour_id);
    return reviews.filter(rev => tourIds.includes(rev.tour_id));
  }, [reviews, tours]);

  const handleLike = (id) => {
    setReviews(prev => prev.map(rev => 
      rev.id === id ? { ...rev, likes: rev.likes + 1 } : rev
    ));
  };

  if (loading) return <div className="loading-dots">Loading reviews...</div>;
  if (visibleReviews.length === 0) return null; // Hide section if no reviews match filters

  return (
    <div className="feedback-section-wrapper">
      <h2 className="section-title-large">What travellers are saying</h2>
      
      <div className="feedback-cards-grid">
        {visibleReviews.slice(0, 3).map((review) => (
          <div className="feedback-card" key={review.id}>
            <div className="reviewer-header">
              <div className="avatar-placeholder">
                {review.userName.charAt(0)}
              </div>
              <div className="reviewer-info">
                <span className="reviewer-name">{review.userName}</span>
                <span className="reviewer-meta">{review.contributions} contributions</span>
              </div>
              <div className="review-header-actions">
                <span className="like-count">{review.likes}</span>
                <button className="icon-btn" onClick={() => handleLike(review.id)}>
                  <FiThumbsUp />
                </button>
                <button className="icon-btn">
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>

            <div className="green-dots-row large-dots">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`circle ${i < review.rating ? 'filled' : ''}`}></span>
              ))}
            </div>

            <h4 className="review-title">{review.title}</h4>
            <p className="review-comment">
              {review.comment.length > 200 ? `${review.comment.substring(0, 200)}...` : review.comment}
            </p>
            {review.comment.length > 200 && <button className="read-more-link">Read more</button>}

            <div className="review-footer-meta">
              <p className="review-of-label">Review of: </p>
              <span className="tour-link-text">{review.tourName}</span>
              <p className="written-date">Written {review.date}</p>
            </div>

            <p className="subjective-opinion">
              This review is the subjective opinion of a Morodok Eco member and not of Morodok Eco LLC.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravellerFeedback;
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ThumbsUp, MoreHorizontal, X, Star, Camera } from 'lucide-react';
import '../../styles/packagedetails/reviewssection.css'; 

const ReviewsSection = ({ tourId = 1, currentUserId = 2 }) => {
  const [currentTab, setCurrentTab] = useState('Reviews');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewsList, setReviewsList] = useState([]);
  
  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch reviews dynamically from the backend on mount or tourId change
  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/package/${tourId}`);
      if (response.ok) {
        const data = await response.json();
        setReviewsList(data);
      }
    } catch (err) {
      console.error("Error fetching database reviews:", err);
    }
  };

  // Handle Review Submission to DB
  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    e.stopPropagation(); // Stops parent forms from hijacking this event

    if (formRating === 0 || !formComment.trim()) {
      alert("Please provide both a star rating and a written comment.");
      return;
    }

    const formData = new FormData();
    formData.append('tour_id', tourId);
    formData.append('user_id', currentUserId);
    formData.append('rating', formRating);
    formData.append('comment', formComment);
    if (selectedImage) {
      formData.append('review_image', selectedImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews/create', {
        method: 'POST', // Explicitly telling the browser to make a POST call
        body: formData, 
      });

      const data = await response.json();

      if (response.status === 200 || response.status === 201 || response.ok) {
        // Reset states and refresh feed
        setIsModalOpen(false);
        setFormRating(0);
        setFormComment('');
        setSelectedImage(null);
        setImagePreview(null);
        fetchReviews(); // Reloads reviews feed dynamically
      } else {
        alert(`Submission failed: ${data.error || 'Please ensure fields are filled correctly.'}`);
      }
    } catch (err) {
      console.error("Error creating review row:", err);
      alert("Network error: Could not reach the server.");
    }
  };

  // Image Upload Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Toggle Like Status
  const handleLikeClick = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/like`, { method: 'POST' });
      if (response.ok) {
        setReviewsList(prev => prev.map(rev => 
          rev.review_id === reviewId ? { ...rev, likes: (rev.likes || 0) + 1 } : rev
        ));
      }
    } catch (err) {
      console.error("Error syncing review like row counter:", err);
    }
  };

  // Client-side execution filtering rules
  const filteredReviewsList = reviewsList.filter(review => 
    review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute Live Metrics Stack
  const totalCount = reviewsList.length;
  const averageScore = totalCount > 0 
    ? (reviewsList.reduce((acc, curr) => acc + Number(curr.rating), 0) / totalCount).toFixed(1)
    : "0.0";

  const getMetricCount = (level) => {
    if (level === 'Excellent') return reviewsList.filter(r => Number(r.rating) === 5).length;
    if (level === 'Very good') return reviewsList.filter(r => Number(r.rating) === 4).length;
    if (level === 'Average') return reviewsList.filter(r => Number(r.rating) === 3).length;
    if (level === 'Poor') return reviewsList.filter(r => Number(r.rating) === 2).length;
    return reviewsList.filter(r => Number(r.rating) <= 1).length;
  };

  const distributionMetrics = ['Excellent', 'Very good', 'Average', 'Poor', 'Terrible'].map(level => {
    const count = getMetricCount(level);
    return {
      level,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
    };
  });

  const RenderDotStars = ({ score }) => {
    return (
      <div className="star-rating-row">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className={`dot-star ${index < score ? 'filled-green' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="reviews-layout-container" id="ReviewsSection">
      <h3 className="contribute-headline">Contribute</h3>
      
      {/* FIXED: Added type="button" to prevent parent forms from hijacking layout clicks */}
      <div className="contribute-action-row">
        <button type="button" className="btn-contribute-outline" onClick={() => setIsModalOpen(true)}>Write a review</button>
        <button type="button" className="btn-contribute-outline" onClick={() => setIsModalOpen(true)}>Upload image</button>
      </div>

      <div className="reviews-tabs-nav">
        <button 
          type="button"
          className={`tab-nav-item ${currentTab === 'Reviews' ? 'active-tab' : ''}`}
          onClick={() => setCurrentTab('Reviews')}
        >
          Reviews
        </button>
        <button 
          type="button"
          className={`tab-nav-item ${currentTab === 'Q&A' ? 'active-tab' : ''}`}
          onClick={() => setCurrentTab('Q&A')}
        >
          Q&A
        </button>
      </div>

      <div className="reviews-columns-grid">
        <div className="left-breakdown-panel">
          <div className="aggregated-score-row">
            <span className="numeric-rating-bold">{averageScore}</span>
            <RenderDotStars score={Math.round(Number(averageScore))} />
            <span className="total-reviews-count-label">({totalCount})</span>
          </div>

          <div className="breakdown-bars-stack">
            {distributionMetrics.map((metric, i) => (
              <div key={i} className="distribution-bar-row">
                <span className="rating-level-label">{metric.level}</span>
                <div className="progress-track-bg">
                  <div 
                    className="progress-fill-active" 
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
                <span className="metric-volume-count">{metric.count}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-promo-banners-container">
            <img src="/banners/airasia-left.png" alt="Promo Layout Left" className="promo-banner-asset" onError={(e) => e.target.style.display='none'} />
            <img src="/banners/airasia-left.png" alt="Promo Layout Right" className="promo-banner-asset" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>

        <div className="right-feed-panel">
          <div className="search-input-field-wrapper">
            <Search size={18} className="search-icon-inline-left" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-selection-toolbar-row">
            <button type="button" className="btn-filter-dropdown-pill">Filters <ChevronDown size={14} /></button>
            <button type="button" className="btn-filter-dropdown-pill">English <ChevronDown size={14} /></button>
            <button type="button" className="btn-filter-dropdown-pill">Most Recent <ChevronDown size={14} /></button>
          </div>

          <h4 className="popular-mentions-header">Popular mentions</h4>
          <div className="keywords-pills-row-container">
            <button type="button" className="pill-keyword-item" onClick={() => setSearchQuery('value')}>value</button>
            <button type="button" className="pill-keyword-item" onClick={() => setSearchQuery('crew')}>crew</button>
            {searchQuery && <button type="button" className="pill-keyword-item clear-btn" onClick={() => setSearchQuery('')}>Reset</button>}
          </div>

          <div className="reviews-feed-list-stack">
            {filteredReviewsList.length > 0 ? (
              filteredReviewsList.map((review) => (
                <div key={review.review_id || review.id} className="review-item-card-block">
                  <div className="user-meta-header-row">
                    <div className="user-profile-identity-info">
                      <div className="avatar-circle-placeholder">
                        {review.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="user-name-text">{review.username || 'Verified Traveler'}</div>
                        <div className="user-contributions-counter-label">1 Contribution</div>
                      </div>
                    </div>
                    
                    <div className="action-options-group-right">
                      <span className="likes-count-inline-label">{review.likes || 0}</span>
                      <button type="button" className="action-icon-trigger" onClick={() => handleLikeClick(review.review_id)}>
                        <ThumbsUp size={16} style={{ fill: review.likes > 0 ? '#00aa6c' : 'none', color: review.likes > 0 ? '#00aa6c' : 'inherit' }} />
                      </button>
                      <button type="button" className="action-icon-trigger"><MoreHorizontal size={18} /></button>
                    </div>
                  </div>

                  <RenderDotStars score={Number(review.rating)} />
                  <h5 className="review-card-headline-title">{Number(review.rating) >= 4 ? 'Great Experience' : 'Tour Feedback'}</h5>
                  <p className="review-card-body-paragraph-text">{review.comment}</p>
                  
                  {review.attached_image_path && (
                    <div className="review-attached-media">
                      <img src={`http://localhost:5000/uploads/reviews/${review.attached_image_path}`} alt="User upload item snapshot" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data-msg">No active matching traveler feedback matches that criterion.</p>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="review-modal-backdrop">
          <div className="review-modal-surface">
            <div className="modal-header-row">
              <h3>Share Your Travel Experience</h3>
              {/* FIXED: Explicitly declared as type="button" */}
              <button type="button" className="close-modal-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="form-input-group rating-selection-center">
                <label>How would you rate this package?</label>
                <div className="interactive-stars-row">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isActive = starValue <= (formHoverRating || formRating);
                    return (
                      <Star
                        key={starValue}
                        size={32}
                        className={`input-star-glyph ${isActive ? 'active' : ''}`}
                        onClick={() => setFormRating(starValue)}
                        onMouseEnter={() => setFormHoverRating(starValue)}
                        onMouseLeave={() => setFormHoverRating(0)}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="form-input-group">
                <label>Write your full review</label>
                <textarea
                  placeholder="What made your trip memorable? Tell us about the local crew, guides, transit conditions, and value..."
                  rows={5}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  maxLength={600}
                  required
                />
              </div>

              <div className="form-input-group image-upload-drop-zone">
                <label htmlFor="file-upload-input" className="file-upload-trigger-label">
                  <Camera size={18} /> Add Trip Photos
                </label>
                <input 
                  id="file-upload-input"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {imagePreview && (
                  <div className="upload-preview-thumbnail">
                    <img src={imagePreview} alt="Target file snapshot stream upload preview" />
                  </div>
                )}
              </div>

              <button type="submit" className="submit-review-action-btn">Post Review</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
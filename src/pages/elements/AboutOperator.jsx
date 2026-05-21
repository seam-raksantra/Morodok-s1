import React, { useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai'; 
import '../../styles/packagedetails/aboutoperator.css';

const AboutOperator = ({ tour }) => {
  const scrollRef = useRef(null);

  // 1. IMPROVED SAFEGUARD: Check if tour exists and has operator data
  // This handles both the old Array format and the new Object format
  if (!tour || !tour.operator) {
    return null;
  }

  // 2. EXTRACT DATA: Handle array or single object safely
  const opData = Array.isArray(tour.operator) ? tour.operator[0] : tour.operator;

  // Final check: if opData is still null/undefined after extraction
  if (!opData) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="op-outer-section">
      <div className="op-main-container">
        <h3 className="op-title">About Operator</h3>
        <p className="op-intro-text">
          Don’t take it from us – here’s what people have to say about this operator:
        </p>

        <div className="op-slider-wrapper">
          <div className="op-scroll-box" ref={scrollRef}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="op-review-card">
                <div className="op-card-header">
                  <div className="op-avatar-circle">
                    {/* <img 
                      src={opData.profile_image_url ? `/operators/${opData.profile_image_url}` : '/operators/default.jpg'} 
                      alt={opData.name} 
                      onError={(e) => { e.target.src = '/operators/default.jpg'; }}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    /> */}
                  </div>
                  <div className="op-user-details">
                    {/* FIXED: Using opData.name instead of operator.name */}
                    <h4>{opData.name || "Eco Operator"}</h4>
                    <span>{opData.total_reviews || 0} Contributions</span>
                  </div>
                </div>

                <div className="op-rating-row">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar 
                      key={i} 
                      className={i < Math.floor(opData.rating_avg || 5) ? "star-green" : "star-grey"} 
                    />
                  ))}
                </div>

                <h4 className="op-review-subject">Excellent transfer service</h4>
                <p className="op-review-body">
                  Excellent transfer service by {opData.name?.split(' ')[0] || 'the team'} — smooth ferry terminal pickup, 
                  great English-speaking driver...<span className="op-read-more">Read More</span>
                </p>

                <p className="op-review-date">Written January 8, 2026</p>
              </div>
            ))}
          </div>

          <button className="op-nav-btn" onClick={handleScroll}>
            <FiArrowRight />
          </button>
        </div>

        <div className="op-footer-area">
          <a href="#" className="op-see-all">See all reviews</a>
          <hr className="op-divider-line" />
          <p className="op-legal-text">
            These reviews are the subjective opinions of Morodok Eco members and not of Morodok Eco LLC. 
            Morodok Eco performs checks on reviews as part of our industry-leading trust & safety standards. 
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutOperator;
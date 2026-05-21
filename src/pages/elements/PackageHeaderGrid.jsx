import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiEdit2, FiHeart, FiCheckCircle, FiInfo } from 'react-icons/fi';
import '../../styles/packagedetails/packageheader.css'; 

import adsBanner from '../../assets/logo/ads_banner.jpg';
import tourBanner from '../../assets/logo/tour_banner.jpg';
import travelBanner from '../../assets/logo/travel_banner.jpg';

const bannerImages = [adsBanner, tourBanner, travelBanner];

const PackageHeaderGrid = ({ tour }) => {
  if (!tour) return <div className="loading-header">Loading...</div>;

  const data = tour;

  // State Management
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareText, setShareText] = useState('Share');
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // 10000ms = 10 seconds

    return () => clearInterval(interval);
  }, []);

  const imageBase = data.image_url || data.thumbnail || 'default';
  const avgRating = data.average_rating ? Number(data.average_rating) : 0;

  const handleShareClick = async () => {
    const shareData = {
      title: data.title || 'Check out this amazing tour package!',
      text: `Look at this incredible trip to ${data.location_name || 'Cambodia'}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    }
  };

  const handleReviewClick = () => {
    const reviewSection = document.getElementById('ReviewsSection');
    if (reviewSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = reviewSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  return (
    <section className="package-header-section">
      
      <div className="ads-banner-container">
        <div className="ads-banner-wrapper">
          {bannerImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Advertisement Banner ${index + 1}`}
              className={`ads-banner-image ${index === currentAdIndex ? 'active' : ''}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=40';
              }}
            />
          ))}
        </div>
      </div>

      <div className="header-text-container">
        <nav className="breadcrumb-container">
          <Link to="/packages" className="breadcrumb-link">Packages</Link>
          <span className="separator"> &gt; </span>
          <span className="breadcrumb-text">Package Details</span>
          <span className="separator"> &gt; </span>
          <span className="current">{data.location_name || "Cambodia"}</span>
        </nav>

        <div className="header-top-row">
          <h1 className="header-title">{data.title}</h1>
          <div className="header-actions">
            <button className="action-pill" onClick={handleShareClick}>
              <FiUpload /> {shareText}
            </button>
            <button className="action-pill" onClick={handleReviewClick}>
              <FiEdit2 /> Review
            </button>
            <button 
              className={`action-pill save-pill ${isSaved ? 'saved-active' : ''}`} 
              onClick={handleSaveToggle}
              style={{
                backgroundColor: isSaved ? '#fff0f0' : '',
                borderColor: isSaved ? '#ff4b4b' : '',
                color: isSaved ? '#ff4b4b' : ''
              }}
            >
              <FiHeart fill={isSaved ? "#ff4b4b" : "none"} /> {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="meta-info-bar">
          <div className="rating-block">
            <span className="rating-number">
              {avgRating > 0 ? avgRating.toFixed(1) : "No rating"}
            </span>
            
            <div className="dot-rating">
              {[...Array(5)].map((_, i) => {
                const isFilled = i < Math.floor(avgRating);
                return (
                  <span 
                    key={i} 
                    className={`dot ${isFilled ? 'filled' : 'empty'}`}
                  ></span>
                );
              })}
            </div>
            
            <span className="review-link" onClick={handleReviewClick} style={{ cursor: 'pointer' }}>
              ({data.review_count || 0} reviews)
            </span>
          </div>
          
          <div className="recommendation-tag-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <div className="recommendation-tag">
              <FiCheckCircle className="check-icon" />
              <span>Recommend 100% by travellers</span>
              <div 
                className="info-icon-trigger-zone"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px', cursor: 'pointer' }}
              >
                <FiInfo className="info-icon" />
              </div>
            </div>

            {showTooltip && (
              <div className="traveler-recommendation-tooltip">
                <div className="tooltip-arrow"></div>
                <p className="tooltip-title">Based on Traveler Ratings</p>
                <p className="tooltip-body">
                  100% of travelers who reviewed this tour package rated it as Excellent or Very Good.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="photo-grid-layout">
        <div className="grid-left-stack">
          <div className="small-photo-wrapper">
             <img 
                src={`/packages/${imageBase}-1.jpg`} 
                alt="Detail view 1" 
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/packages/default.jpg';
                }}
             />
          </div>
          <div className="small-photo-wrapper">
             <img 
                src={`/packages/${imageBase}-2.jpg`} 
                alt="Detail view 2" 
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/packages/default.jpg';
                }}
             />
          </div>
        </div>
        <div className="grid-right-large">
           <img 
              src={`/packages/${imageBase}.jpg`} 
              alt={data.title} 
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/packages/default.jpg';
              }}
           />
        </div>
      </div>
    </section>
  );
};

export default PackageHeaderGrid;
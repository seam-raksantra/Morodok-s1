import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiInfo, FiFilter, FiX } from 'react-icons/fi';
import { IoCheckmarkCircleOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import SidebarFilters from './SidebarFilters';
import TourSearchHeader from './TourSearchHeader';
import TravellerFeedback from './TravellerFeedback';
import '../../styles/packages/tourlisting.css';

// Import banner assets
import adsBanner from '../../assets/logo/ads_1.jpg';
import tourBanner from '../../assets/logo/ads_2.jpg';
import travelBanner from '../../assets/logo/tour_banner.jpg';
import posterBanner from '../../assets/logo/travel_banner.jpg';

const bannerImages = [adsBanner, tourBanner, travelBanner, posterBanner];

const TourListingPage = () => {
  const [provinces, setProvinces] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  
  // Local storage state strategies
  const [favorites, setFavorites] = useState({});
  const [user, setUser] = useState(null);

  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter States for Sidebar
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); 
  const [selectedRatings, setSelectedRatings] = useState([]);

  // Additional Filter States
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);

  // Mobile Filter Toggle State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // --- 10-SECOND AD ROTATOR INDEX STATE ---
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      const favKey = `fav_packages_${parsedUser.email}`;
      const savedFavs = localStorage.getItem(favKey);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api');
        const result = await response.json();
        const dataArray = result.data || [];
        setProvinces(dataArray);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 10-SECOND AD INTERVAL EFFECT ---
  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // 10000ms = 10 seconds

    return () => clearInterval(adInterval);
  }, []);

  const toggleFavorite = (tourId) => {
    if (!user) {
      alert("Please login to save your favorite packages!");
      return;
    }
    
    const targetTour = provinces.find(p => p.tour_id === tourId);
    const tourTitle = targetTour ? targetTour.title : "Unknown Package";
    let isNowFavorite = false;

    setFavorites(prev => {
      isNowFavorite = !prev[tourId];
      const newFavs = { ...prev, [tourId]: isNowFavorite };
      localStorage.setItem(`fav_packages_${user.email}`, JSON.stringify(newFavs));
      return newFavs;
    });

    const historyKey = `account_history_${user.email}`;
    const savedHistory = localStorage.getItem(historyKey);
    let historyArray = savedHistory ? JSON.parse(savedHistory) : [];

    const newHistoryEntry = {
      id: `history_${Date.now()}`,
      type: 'Package',
      item_id: tourId,
      title: tourTitle,
      action: isNowFavorite ? 'Added to Favorites' : 'Removed from Favorites',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      image_url: targetTour?.thumbnail || 'default'
    };

    historyArray.unshift(newHistoryEntry);
    localStorage.setItem(historyKey, JSON.stringify(historyArray));
  };

  // Filter and Sort Logic
  const filteredItems = useMemo(() => {
    let result = [...provinces];
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (selectedLanguages.length > 0) {
      result = result.filter((item) => 
        item.languages?.some(lang => selectedLanguages.includes(lang))
      );
    }
    if (selectedTimes.length > 0) {
      result = result.filter((item) => selectedTimes.includes(item.timeOfDay));
    }
    result = result.filter((item) => 
      item.base_price >= priceRange[0] && item.base_price <= priceRange[1]
    );
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      result = result.filter((item) => (item.average_rating || 0) >= minRating);
    }
    if (selectedDurations.length > 0) {
      result = result.filter((item) => selectedDurations.includes(item.duration_category));
    }
    if (selectedAttractions.length > 0) {
      result = result.filter((item) => 
        item.attractions?.some(attr => selectedAttractions.includes(attr))
      );
    }
    if (selectedAccessibility.length > 0) {
      result = result.filter((item) => 
        item.accessibility_features?.some(acc => selectedAccessibility.includes(acc))
      );
    }
    if (selectedOffers.length > 0) {
      result = result.filter((item) => 
        item.special_offers?.some(offer => selectedOffers.includes(offer))
      );
    }
    if (sortBy === 'priceLow') {
      result.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => b.base_price - a.base_price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    }
    return result;
  }, [
    provinces, searchQuery, sortBy, selectedCategory, selectedLanguages, 
    selectedTimes, priceRange, selectedRatings, selectedDurations,
    selectedAttractions, selectedAccessibility, selectedOffers
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery, sortBy, selectedCategory, selectedLanguages, 
    selectedTimes, priceRange, selectedRatings, selectedDurations,
    selectedAttractions, selectedAccessibility, selectedOffers
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedLanguages([]);
    setSelectedTimes([]);
    setPriceRange([0, 1000]);
    setSelectedRatings([]);
    setSelectedDurations([]);
    setSelectedAttractions([]);
    setSelectedAccessibility([]);
    setSelectedOffers([]);
    setSearchQuery('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const premiumFeedbackTours = useMemo(() => {
    return filteredItems.slice(0, 3);
  }, [filteredItems]);

  // Determine insertion midpoint row for listing views
  const adInsertionIndex = Math.max(2, Math.floor(currentItems.length / 2));

  return (
    <div className="main-listing-wrapper">
      <TourSearchHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      <button className="mobile-filter-trigger" onClick={() => setShowMobileFilters(true)}>
        <FiFilter /> Show Filters
      </button>

      <div className="content-container">
        <aside className={`filter-sidebar-wrapper ${showMobileFilters ? 'active' : ''}`}>
          <div className="mobile-sidebar-header">
            <h3>Filters</h3>
            <button className="mobile-close-btn" onClick={() => setShowMobileFilters(false)}>
              <FiX />
            </button>
          </div>
          <SidebarFilters 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            selectedDurations={selectedDurations}
            setSelectedDurations={setSelectedDurations}
            selectedAttractions={selectedAttractions}
            setSelectedAttractions={setSelectedAttractions}
            selectedAccessibility={selectedAccessibility}
            setSelectedAccessibility={setSelectedAccessibility}
            selectedOffers={selectedOffers}
            setSelectedOffers={setSelectedOffers}
            clearAllFilters={clearAllFilters}
          />
        </aside>

        <main className="results-column">
          <div className="results-count-meta">
            {filteredItems.length} results sorted by {sortBy} 
            <span className="info-wrapper" data-tooltip="We rank tours based on traveler ratings, booking volume, and price.">
              <FiInfo className="info-icon-small" />
            </span>
          </div>

          <div className="tour-list">
            {loading ? (
              <div className="loading">Updating tours...</div>
            ) : filteredItems.length > 0 ? (
              currentItems.flatMap((item, index) => {
                const imagePath = item.thumbnail 
                  ? `/provinces/${item.thumbnail}.jpg` 
                  : `/provinces/default.jpg`;
                
                const isFavorite = !!favorites[item.tour_id];
                const avgRating = item.average_rating ? Number(item.average_rating) : 5.0;

                const cardJsx = (
                  <div className="tour-card-clean" key={item.tour_id || index}>
                    <div className="image-wrap">
                      <img 
                        src={imagePath} 
                        alt={item.title}
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = '/provinces/default.jpg'; 
                        }}
                      />
                      <button 
                        className={`heart-overlay ${isFavorite ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.tour_id)}
                      >
                        <FiHeart fill={isFavorite ? "#ff4b4b" : "none"} />
                      </button>
                    </div>

                    <div className="info-wrap">
                      <h3 className="tour-title">{indexOfFirstItem + index + 1}. {item.title}</h3>
                      
                      {/* --- FUNCTIONAL DYNAMIC RATING & REVIEW COUNTS --- */}
                      <div className="rating-row-clean">
                        <span className="rating-text">{avgRating.toFixed(1)}</span>
                        <div className="green-circles">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`circle ${i < Math.floor(avgRating) ? 'filled' : ''}`}></span>
                          ))}
                        </div>
                        <span className="reviews-text">({item.review_count || 0})</span>
                      </div>

                      <p className="duration-label">{item.duration_category}</p>
                      <p className="description-snippet">{item.description}</p>
                      
                      <div className="trust-badges-clean">
                        <div className="badge-line">
                          <IoCheckmarkCircleOutline className="badge-icon" />
                          <span>free cancellation</span>
                          <span className="info-wrapper" data-tooltip="Cancel at least 24 hours before the start date for a full refund.">
                            <FiInfo className="info-trigger" />
                          </span>
                        </div>
                        <div className="badge-line">
                          <IoShieldCheckmarkOutline className="badge-icon" />
                          <span>Recommend 100% by travellers</span>
                          <span className="info-wrapper" data-tooltip="100% of travelers who took this tour gave it a 4 or 5 star rating.">
                            <FiInfo className="info-trigger" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pricing-wrap">
                      <div className="price-box">
                        <span className="label-from">from</span>
                        <span className="actual-price">${Math.round(item.base_price)}</span>
                        <span className="label-per">per adult</span>
                        <button 
                          className="reserve-green-btn" 
                          onClick={() => navigation(`/packagedetails/${item.tour_id}`)}
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                );

                // --- INJECT ROTATING BANNER AT THE SPECIFIED MIDPOINT ELEMENT ---
                if (index === adInsertionIndex) {
                  const adBannerJsx = (
                    <div className="ads-banner-container mid-list-ad" key="mid-list-advertisement">
                      <div className="ads-banner-wrapper">
                        {bannerImages.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`Promotion Display ${i + 1}`}
                            className={`ads-banner-image ${i === currentAdIndex ? 'active' : ''}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=40';
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                  return [adBannerJsx, cardJsx];
                }

                return [cardJsx];
              })
            ) : (
              <div className="no-results-container">
                <div className="no-results">No tour packages found matching your criteria.</div>
                <button onClick={clearAllFilters} className="clear-filters-btn">Reset All Filters</button>
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-footer">
                <div className="page-row">
                   {[...Array(totalPages)].map((_, i) => (
                     <span 
                      key={i + 1} 
                      className={`page-dot ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => paginate(i + 1)}
                     >
                       {i + 1}
                     </span>
                   ))}
                   <button 
                    className="page-arrow" 
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                   >
                     →
                   </button>
                </div>
                <p className="showing-text">
                  Showing results {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                </p>

                <p className="sell-out-text">
                  *Likely to sell out: Based on Viator’s booking data and information from the provider from the past 30 days...
                </p>

                <div className="embedded-feedback-section" style={{ marginTop: '1rem' }}>
                  <TravellerFeedback tours={premiumFeedbackTours} />
                </div>
            </div>
          )}
        </main>
      </div>

      {showMobileFilters && <div className="sidebar-overlay" onClick={() => setShowMobileFilters(false)}></div>}
    </div>
  );
};

export default TourListingPage;
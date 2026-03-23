import React, { useState, useEffect, useMemo } from 'react';
import { FiHeart, FiInfo, FiFilter, FiX } from 'react-icons/fi';
import { IoCheckmarkCircleOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import SidebarFilters from './SidebarFilters';
import TourSearchHeader from './TourSearchHeader';
import TravellerFeedback from './TravellerFeedback';
import '../../styles/packages/tourlisting.css';

const TourListingPage = () => {
  const [provinces, setProvinces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // --- Filter States for Sidebar ---
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); 
  const [selectedRatings, setSelectedRatings] = useState([]);

  // --- NEW: Additional Filter States from Screenshot ---
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);

  // Mobile Filter Toggle State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
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

  // Filter and Sort Logic
  const filteredItems = useMemo(() => {
    let result = [...provinces];

    // 1. Search Query
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Categories
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 3. Languages
    if (selectedLanguages.length > 0) {
      result = result.filter((item) => 
        item.languages?.some(lang => selectedLanguages.includes(lang))
      );
    }

    // 4. Time of Day
    if (selectedTimes.length > 0) {
      result = result.filter((item) => selectedTimes.includes(item.timeOfDay));
    }

    // 5. Price Range
    result = result.filter((item) => 
      item.base_price >= priceRange[0] && item.base_price <= priceRange[1]
    );

    // 6. Traveller Rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      result = result.filter((item) => (item.average_rating || 0) >= minRating);
    }

    // 7. Durations (NEW)
    if (selectedDurations.length > 0) {
      result = result.filter((item) => selectedDurations.includes(item.duration_category));
    }

    // 8. Popular Attractions (NEW)
    if (selectedAttractions.length > 0) {
      result = result.filter((item) => 
        item.attractions?.some(attr => selectedAttractions.includes(attr))
      );
    }

    // 9. Accessibility (NEW)
    if (selectedAccessibility.length > 0) {
      result = result.filter((item) => 
        item.accessibility_features?.some(acc => selectedAccessibility.includes(acc))
      );
    }

    // 10. Special Offers (NEW)
    if (selectedOffers.length > 0) {
      result = result.filter((item) => 
        item.special_offers?.some(offer => selectedOffers.includes(offer))
      );
    }

    // Sorting Logic
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

  // Reset page when filters change
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

  return (
    <div className="main-listing-wrapper">
      <TourSearchHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      <button 
        className="mobile-filter-trigger" 
        onClick={() => setShowMobileFilters(true)}
      >
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
            // Passing new props
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
            {filteredItems.length} results sorted by {sortBy} <FiInfo className="info-icon-small" />
          </div>

          <div className="tour-list">
            {loading ? (
              <div className="loading">Updating tours...</div>
            ) : filteredItems.length > 0 ? (
              currentItems.map((item, index) => {
                const imagePath = item.thumbnail 
                  ? `/provinces/${item.thumbnail}.jpg` 
                  : `/provinces/default.jpg`;

                return (
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
                      <button className="heart-overlay"><FiHeart /></button>
                    </div>

                    <div className="info-wrap">
                      <h3 className="tour-title">{indexOfFirstItem + index + 1}. {item.title}</h3>
                      <div className="rating-row-clean">
                        <span className="rating-text">{item.average_rating || '5.0'}</span>
                        <div className="green-circles">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`circle ${i < Math.floor(item.average_rating || 5) ? 'filled' : ''}`}></span>
                          ))}
                        </div>
                        <span className="reviews-text">(20)</span>
                      </div>
                      <p className="duration-label">{item.duration_category}</p>
                      <p className="description-snippet">{item.description}</p>
                      
                      <div className="trust-badges-clean">
                        <div className="badge-line">
                          <IoCheckmarkCircleOutline className="badge-icon" />
                          <span>free cancellation</span>
                        </div>
                        <div className="badge-line">
                          <IoShieldCheckmarkOutline className="badge-icon" />
                          <span>Recommend 100% by travellers</span>
                        </div>
                      </div>
                    </div>

                    <div className="pricing-wrap">
                      <div className="price-box">
                        <span className="label-from">from</span>
                        <span className="actual-price">${Math.round(item.base_price)}</span>
                        <span className="label-per">per adult</span>
                        <button className="reserve-green-btn">Reserve</button>
                      </div>
                    </div>
                  </div>
                );
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
                  *Likely to sell out: Based on Viator’s booking data and information from the provider from the past 30 days, it seems likely this experience will sell out through Viator, a Morodok Eco company.
                </p>
            </div>
          )}
        </main>
      </div>

      <TravellerFeedback tours={filteredItems} />

      {showMobileFilters && <div className="sidebar-overlay" onClick={() => setShowMobileFilters(false)}></div>}
    </div>
    
  );
};

export default TourListingPage;
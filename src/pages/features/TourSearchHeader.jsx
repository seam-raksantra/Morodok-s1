import React from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import '../../styles/packages/toursearchheader.css';

const TourSearchHeader = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => {
  
  const getSortLabel = (value) => {
    switch (value) {
      case 'priceLow': return 'Price: Low to High';
      case 'priceHigh': return 'Price: High to Low';
      case 'rating': return 'Top Rated';
      default: return 'Featured';
    }
  };

  return (
    <section className="search-header-container">
      <h2 className="main-listing-title">Eco Tour Packages in Cambodia</h2>

      <div className="search-controls-row">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tours..." 
            className="tour-search-field"
            value={searchQuery} // Controlled input
            onChange={(e) => setSearchQuery(e.target.value)} // Updates Parent State
          />
        </div>

        <div className="sort-dropdown-wrapper" style={{ position: 'relative' }}>
          <select 
            className="sort-select-hidden" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} // Updates Parent State
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer', zIndex: 2
            }}
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <div className="sort-dropdown-display">
            <span>{getSortLabel(sortBy)}</span>
            <FiChevronDown className="dropdown-arrow" />
          </div>
        </div>
      </div>
      <hr className="header-divider" />
    </section>
  );
};

export default TourSearchHeader;
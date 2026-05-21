import React, { useState, useEffect } from 'react';
import { FiChevronUp, FiChevronDown, FiInfo } from 'react-icons/fi';

import logoWildlife from '../../assets/logo/wildlife_alliance.jpg';
import logoEcoFinance from '../../assets/logo/eco_and_finance.png';
import logoMinistryofEnvironment from '../../assets/logo/ministry_of_envi.png';

// --- YOUR LOCAL ADS POSTER IMPORTS ---
import Ads from '../../assets/logo/ads-poster.png';
import Ads1 from '../../assets/logo/ads-poster1.png';

const SidebarFilters = ({ 
  selectedCategory, setSelectedCategory, 
  selectedLanguages, setSelectedLanguages,
  priceRange, setPriceRange,
  selectedRatings, setSelectedRatings,
  selectedTimes = [], setSelectedTimes,
  selectedDurations = [], setSelectedDurations,
  selectedAttractions = [], setSelectedAttractions,
  selectedAccessibility = [], setSelectedAccessibility,
  selectedOffers = [], setSelectedOffers,
  clearAllFilters 
}) => {
  // Toggle sections open/closed
  const [openSections, setOpenSections] = useState({
    categories: true,
    languages: true,
    timeOfDay: true,
    price: true,
    durations: true,
    rating: true,
    attractions: true,
    accessibility: true,
    offers: true
  });

  // --- AUTOMATIC ADS POSTER SWITCHER ---
  // Array linking your local asset imports
  const adsList = [Ads, Ads1];
  
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adsList.length);
    }, 10000); // Changes every 10 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, [adsList.length]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Reusable toggle for arrays
  const handleToggle = (value, currentList, setter) => {
    if (currentList.includes(value)) {
      setter(currentList.filter(item => item !== value));
    } else {
      setter([...currentList, value]);
    }
  };

  const categories = ["All", "Attractions", "Tours", "Day Trips", "Outdoor Activities", "Concert & Shows", "Food & Drinks"];

  return (
    <div className="filter-sidebar">
      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('categories')}>
          <h4>Categories types</h4>
          {openSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.categories && (
          <ul className="category-list">
            {categories.map((cat) => (
              <li 
                key={cat} 
                className={selectedCategory === cat ? "active-cat" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
            <button className="see-more-btn">See more</button>
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('languages')}>
          <h4>Languages</h4>
          <span className="info-wrapper" data-tooltip="Filters to see tours in the language(s) of your choice.">
            <FiInfo className="info-trigger" />
          </span>
          {openSections.languages ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.languages && (
          <ul className="checkbox-list">
            {["English", "Khmer", "Chinese", "French"].map(lang => (
              <li key={lang}>
                <label className="custom-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => handleToggle(lang, selectedLanguages, setSelectedLanguages)}
                  />
                  <span className="checkmark"></span>
                  {lang}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('timeOfDay')}>
          <h4>Time of Day</h4>
          {openSections.timeOfDay ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.timeOfDay && (
          <ul className="checkbox-list">
            {["Morning", "Afternoon", "Evening"].map(time => (
              <li key={time}>
                <label className="custom-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedTimes.includes(time)}
                    onChange={() => handleToggle(time, selectedTimes, setSelectedTimes)}
                  />
                  <span className="checkmark"></span>
                  {time}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('price')}>
          <h4>Price</h4>
          {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.price && (
          <div className="price-filter-container">
            <p className="price-label">$0 - ${priceRange[1]}+</p>
            <input 
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="modern-range-slider"
            />
          </div>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('durations')}>
          <h4>Durations</h4>
          {openSections.durations ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.durations && (
          <ul className="checkbox-list">
            {["Up to 1 hours", "1 to 4 hours", "4 hours to 1 day", "1 to 3 days", "3+ days"].map(dur => (
              <li key={dur}>
                <label className="custom-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedDurations.includes(dur)}
                    onChange={() => handleToggle(dur, selectedDurations, setSelectedDurations)}
                  />
                  <span className="checkmark"></span>
                  {dur}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('rating')}>
          <h4>Traveller Rating</h4>
          {openSections.rating ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.rating && (
          <ul className="rating-filter-list">
            {[5, 4, 3, 2].map((num) => (
              <li key={num} onClick={() => handleToggle(num, selectedRatings, setSelectedRatings)}>
                <input type="checkbox" checked={selectedRatings.includes(num)} readOnly />
                <div className="green-dots-row">
                  {"●".repeat(num)}
                  <span className="grey">{"●".repeat(5 - num)}</span>
                  <span className="rating-plus-text">{num === 5 ? "" : "& up"}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('attractions')}>
          <h4>Popular Attractions</h4>
          {openSections.attractions ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.attractions && (
          <ul className="checkbox-list">
            {["Kampong Phluk Floating Village", "Tonle Sap Lake", "Kampong Phluk", "Phnom Kulen National Park"].map(attr => (
              <li key={attr}>
                <label className="custom-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedAttractions.includes(attr)}
                    onChange={() => handleToggle(attr, selectedAttractions, setSelectedAttractions)}
                  />
                  <span className="checkmark"></span>
                  {attr}
                </label>
              </li>
            ))}
            <button className="see-more-btn">Show all</button>
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('accessibility')}>
          <h4>Accessibility</h4>
          {openSections.accessibility ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.accessibility && (
          <ul className="checkbox-list">
            {["Wheelchair accessible", "Stroller accessible", "Service animal allowed", "Infant seats available"].map(acc => (
              <li key={acc}>
                <label className="custom-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedAccessibility.includes(acc)}
                    onChange={() => handleToggle(acc, selectedAccessibility, setSelectedAccessibility)}
                  />
                  <span className="checkmark"></span>
                  {acc}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-block">
        <div className="filter-header" onClick={() => toggleSection('offers')}>
          <h4>Special Offers</h4>
          {openSections.offers ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {openSections.offers && (
          <ul className="checkbox-list">
            {["Likely to Sell Out", "Special Offers"].map(offer => (
              <li key={offer}>
                <label className="custom-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedOffers.includes(offer)}
                    onChange={() => handleToggle(offer, selectedOffers, setSelectedOffers)}
                  />
                  <span className="checkmark"></span>
                  {offer}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-footer-content">
          <button className="clear-filters-btn-sidebar" onClick={clearAllFilters}>
            Clear all filters
          </button>
          <div className="partner-logos">
             <img src={logoWildlife} alt="Partner 1" />
             <img src={logoEcoFinance} alt="Partner 2" />
             <img src={logoMinistryofEnvironment} alt="Partner 3" />
             {/* Switches local poster imports directly based on timer index */}
             <img src={adsList[currentAdIndex]} alt="Advertisement" />
          </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
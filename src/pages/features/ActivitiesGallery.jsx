import React, { useState, useRef } from 'react';
import { FiChevronUp, FiChevronDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import '../../styles/packages/activitiesgallery.css';

// Importing assets
import ecoCamping from '../../../src/assets/adventures/eco_camping.jpg';
import jungleTrekking from '../../../src/assets/adventures/jungle_trekking.jpg';
import kayakTour from '../../../src/assets/adventures/kayak_tour.jpg';
import riverCruise from '../../../src/assets/adventures/river_cruise.jpg';
import villageCycling from '../../../src/assets/adventures/village_cycling.jpg';
import wildlifeSafari from '../../../src/assets/adventures/wildlife_safari.jpg';

const ActivitiesGallery = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState('All'); // Initial state set to 'All'
  const scrollRef = useRef(null);

  const categories = [
    'Bike Tours',
    'Nature & Wildlife Tours',
    'Boat Tours',
    '4WD, ATV, & Off Road'
  ];

  const items = [
    { src: villageCycling, title: 'Village Cycling', category: 'Bike Tours' },
    { src: jungleTrekking, title: 'Jungle Trekking', category: 'Nature & Wildlife Tours' },
    { src: ecoCamping, title: 'Eco Camping', category: 'Nature & Wildlife Tours' },
    { src: wildlifeSafari, title: 'Wildlife Safari', category: 'Nature & Wildlife Tours' },
    { src: riverCruise, title: 'River Cruise', category: 'Boat Tours' },
    { src: kayakTour, title: 'Kayak Tour', category: 'Boat Tours' },
  ];

  /**
   * UPDATED FILTERING LOGIC
   * If selected is 'All', return the full items array.
   * Otherwise, filter items by the category name.
   */
  const filteredItems = selected === 'All' 
    ? items 
    : items.filter(item => item.category === selected);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="activities-outer-container">
      <div className="activities-flex-wrapper">

        <div className="activities-text-side">
          {/* Header group toggles the menu */}
          <div className="activities-header-group" onClick={() => setIsOpen(!isOpen)}>
            <h2 className="activities-heading">The best activities captures</h2>
            {isOpen ? <FiChevronUp className="toggle-icon" /> : <FiChevronDown className="toggle-icon" />}
          </div>

          <div className={`activities-collapsible ${isOpen ? 'open' : 'closed'}`}>
            <ul className="activities-nav-list">
              {categories.map((name) => (
                <li
                  key={name}
                  className={selected === name ? 'active-item' : ''}
                  onClick={() => setSelected(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
            
            <div className="activities-footer-row">
              {/* SEE ALL LOGIC: Click sets selected to 'All' */}
              <a 
                href="#all" 
                className={`activities-see-all ${selected === 'All' ? 'active-item' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected('All');
                }}
              >
                See all
              </a>
              
              <div className="nav-arrows">
                 <button className="nav-circle" onClick={() => scroll('left')}>
                   <FiArrowLeft />
                 </button>
                 <button className="nav-circle" onClick={() => scroll('right')}>
                   <FiArrowRight />
                 </button>
              </div>
            </div>
          </div>
        </div>

        <div className="activities-scroller" ref={scrollRef}>
          {filteredItems.map((item, idx) => (
            <div className="activity-img-card" key={idx}>
              <img 
                src={item.src} 
                alt={item.title} 
                onError={(e) => { e.target.src = "https://via.placeholder.com/240"; }} 
              />
            </div>
          ))}
          {filteredItems.length === 0 && (
            <p className="no-items">No captures for this category yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ActivitiesGallery;
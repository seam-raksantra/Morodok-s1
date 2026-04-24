import React, { useState, useRef } from 'react';
import { FiChevronUp, FiChevronDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import '../../styles/packages/activitiesgallery.css';

// Importing assets
import jungle from '../../../src/assets/adventures/off_road.jpg';
import jungle_1 from '../../../src/assets/adventures/off_road_1.jpg';
import riverCruise from '../../../src/assets/adventures/boat_tour.jpg';
import riverCruise_1 from '../../../src/assets/adventures/boat_tour_1.jpg';
import riverCruise_2 from '../../../src/assets/adventures/boat_tour_2.jpg';
import villageCycling from '../../../src/assets/adventures/cycling.jpg';
import villageCycling_1 from '../../../src/assets/adventures/cycling_1.jpg';
import villageCycling_2 from '../../../src/assets/adventures/cycling_2.jpg';
import wildlifeSafari from '../../../src/assets/adventures/nature.jpg';
import wildlifeSafari_1 from '../../../src/assets/adventures/nature_1.jpg';
import wildlifeSafari_2 from '../../../src/assets/adventures/wildlife.jpg';
import wildlifeSafari_3 from '../../../src/assets/adventures/wildlife_1.jpg';
import wildlifeSafari_4 from '../../../src/assets/adventures/wildlife_2.jpg';

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
    { src: villageCycling_1, title: 'Village Cycling 1', category: 'Bike Tours' },
    { src: villageCycling_2, title: 'Village Cycling 2', category: 'Bike Tours' },
    { src: jungle, title: 'Jungle Trekking', category: '4WD, ATV, & Off Road' },
    { src: jungle_1, title: 'Jungle Trekking 1', category: '4WD, ATV, & Off Road' },
    { src: wildlifeSafari, title: 'Wildlife Safari', category: 'Nature & Wildlife Tours' },
    { src: wildlifeSafari_1, title: 'Wildlife Safari 1', category: 'Nature & Wildlife Tours' },
    { src: wildlifeSafari_2, title: 'Wildlife Safari 2', category: 'Nature & Wildlife Tours' },
    { src: wildlifeSafari_3, title: 'Wildlife Safari 3', category: 'Nature & Wildlife Tours' },
    { src: wildlifeSafari_4, title: 'Wildlife Safari 4', category: 'Nature & Wildlife Tours' },
    { src: riverCruise, title: 'River Cruise', category: 'Boat Tours' },
    { src: riverCruise_1, title: 'River Cruise 1', category: 'Boat Tours' },
    { src: riverCruise_2, title: 'River Cruise 2', category: 'Boat Tours' },
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
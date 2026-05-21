import React, { useRef, useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import '../../styles/packagedetails/tourdestination.css';

const TourDestination = ({ tour }) => {
  const scrollRef = useRef(null);

  // Tracks which province card is currently active/clicked
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Set the first province from the tour data as default on load
  useEffect(() => {
    if (tour?.destinations && tour.destinations.length > 0) {
      setSelectedDestination(tour.destinations[0]);
    }
  }, [tour]);

  if (!tour || !tour.destinations || tour.destinations.length === 0) {
    return null;
  }

  const handleNextScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300, 
        behavior: 'smooth'
      });
    }
  };

  const searchQuery = selectedDestination ? `${selectedDestination.title}, Cambodia` : 'Cambodia';
  const encodedLocation = encodeURIComponent(searchQuery);
  const dynamicMapEmbedUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="destination-outer" id="TourDestination">
      <div className="destination-content">
        <div className="dest-header">
          <h2>Destination</h2>
          <p>Click on any province card below to display its interactive map</p>
        </div>

        <div className="dest-slider-wrapper">
          <div className="dest-scroll-container" ref={scrollRef}>
            {tour.destinations.map((dest, index) => {
              const isSelected = selectedDestination?.title === dest.title;

              return (
                <div 
                  key={index} 
                  className={`dest-cards ${isSelected ? 'active-cards' : ''}`}
                  onClick={() => setSelectedDestination(dest)}
                >
                  <div className="dest-img-holder">
                    <img 
                      src={`/dest/${dest.image_url}`} 
                      alt={dest.title} 
                      onError={(e) => { e.target.src = '/dest/default.jpg'; }}
                    />
                  </div>
                  <h3 className="dest-name" style={{ color: isSelected ? '#00aa6c' : 'inherit', marginTop: '8px' }}>
                    {dest.title}
                  </h3>
                </div>
              );
            })}
          </div>
          
          <button className="dest-next-btn" onClick={handleNextScroll} aria-label="Next destination">
            <FiArrowRight />
          </button>
        </div>

        <div className="dest-map-box" style={{ width: '100%', height: '450px', marginTop: '25px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <iframe 
            title={`Map of ${searchQuery}`}
            src={dynamicMapEmbedUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default TourDestination;
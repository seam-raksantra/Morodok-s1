import React from 'react';
import { X, MapPin, Clock, Gauge, Calendar, CheckCircle } from 'lucide-react';
import '../styles/destination/destDetails.css';

const DestinationsDetails = ({ destination, onClose }) => {
  if (!destination) return null;

  const imagePath = new URL(`/src/assets/destinations/${destination.image_url}.jpg`, import.meta.url).href;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div 
          className="modal-banner" 
          style={{ backgroundImage: `url(/src/assets/destinations/${destination.image_url}.jpg)` }} 
        />
        
        <div className="modal-scroll-body">
          <div className="modal-info-header">
            <h2 className="modal-dest-title">{destination.name}</h2>
            <div className="modal-dest-location">
              <MapPin size={18} /> <span>{destination.location}</span>
            </div>
          </div>
          
          <p className="modal-dest-text">{destination.description}</p>

          <div className="modal-stats-container">
            <div className="stat-card-sage">
              <Clock size={24} />
              <div className="stat-label-small">Duration</div>
              <div className="stat-result-bold">{destination.duration}-3 Days</div>
            </div>
            <div className="stat-card-sage">
              <Gauge size={24} />
              <div className="stat-label-small">Difficulty</div>
              <div className="stat-result-bold">{destination.difficulty_type}</div>
            </div>
            <div className="stat-card-sage">
              <Calendar size={24} />
              <div className="stat-label-small">Best Time</div>
              <div className="stat-result-bold">Aug - Dec</div>
            </div>
          </div>

          <div className="modal-highlights-wrapper">
            <h3 className="modal-section-h3">Highlight</h3>
            <div className="modal-highlights-grid">
              <div className="h-list-item"><CheckCircle size={20} /> Prasat Thom Pyramid</div>
              <div className="h-list-item"><CheckCircle size={20} /> Jungle Temples</div>
              <div className="h-list-item"><CheckCircle size={20} /> Ancient Carvings</div>
              <div className="h-list-item"><CheckCircle size={20} /> Wildlife Spotting</div>
            </div>
          </div>

          <button className="modal-primary-btn" onClick={() => window.location.href = '/trips'}>Plan Your Visit</button>
        </div>
      </div>
    </div>
  );
};

export default DestinationsDetails;
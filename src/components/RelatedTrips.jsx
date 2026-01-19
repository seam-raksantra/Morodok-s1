import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin } from 'lucide-react';

const RelatedTrips = ({ currentTripId, location }) => {
  const [relatedTrips, setRelatedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trips`);
        if (response.ok) {
          const allTrips = await response.json();
          // Filter by location and exclude current trip
          const filtered = allTrips.filter(t => 
            t.location === location && t.id !== parseInt(currentTripId)
          );
          setRelatedTrips(filtered);
        }
      } catch (err) {
        console.error("Error fetching related trips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location) fetchRelated();
  }, [currentTripId, location]);

  if (loading) return null;

  return (
    <div className="related-section">
      <h2 className="related-title">Related Destinations in {location}</h2>
      
      {relatedTrips.length > 0 ? (
        <div className="trips-grid">
          {relatedTrips.map((r) => (
            <div className="trip-card" key={r.id}>
              <div 
                className="trip-card-img" 
                style={{ backgroundImage: `url(/src/assets/trips/${r.image_url}.jpg)` }}
              >
                <span className={`difficulty-badge ${r.difficulty_type?.toLowerCase()}`}>
                  {r.difficulty_type}
                </span>
              </div>
              <div className="trip-card-body">
                <h3>{r.name}</h3>
                <div className="trip-card-location">
                  <MapPin size={14} /> {r.location}
                </div>
                <p className="trip-card-description">
                  {r.description.substring(0, 110)}...
                </p>
                <div className="trip-card-meta">
                  <span><Clock size={16} /> {r.duration} Day{r.duration > 1 ? 's' : ''}</span>
                  <span><Users size={16} /> Max {r.num_people} people</span>
                </div>
                <div className="trip-card-footer">
                  <div className="trip-card-price">
                    <span className="price-from">From</span>
                    <span className="price-amount">${Math.round(r.price)}</span>
                  </div>
                  <button 
                    className="trip-details-btn" 
                    onClick={() => {
                      navigate(`/trip/${r.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-related-destinations">
          <p>There's no Related Destination.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedTrips;
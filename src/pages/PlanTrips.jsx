import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Users } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/trips/planTrips.css';

const PlanTrips = () => {
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeDuration, setActiveDuration] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('http://localhost:5000/api/trips')
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(err => console.error("Error fetching trips:", err));
  }, []);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDuration = activeDuration === "All" || 
      (activeDuration === "1-2 Days" && trip.duration <= 2) ||
      (activeDuration === "4-7 Days" && trip.duration >= 4 && trip.duration <= 7) ||
      (activeDuration === "8+ Days" && trip.duration >= 8);

    const matchesDifficulty = activeDifficulty === "All" || 
      trip.difficulty_type === activeDifficulty;

    return matchesSearch && matchesDuration && matchesDifficulty;
  });

  const getImageUrl = (trip) => {
    return `/src/assets/trips/${trip.image_url}.jpg`; 
  };

  return (
    <div className="trips-page-container">
      <Header />

      <section className="trips-hero">
        <div className="trips-hero-overlay">
          <div className="trips-hero-content">
            <h1 className="trips-hero-title">Curated Eco-Adventures</h1>
            <p className="trips-hero-para">
              Discover thoughtfully designed sustainable journeys that connect you 
              with Cambodia's hidden treasures while supporting local communities.
            </p>

            <div className="trips-search-wrapper">
              <div className="trips-search-bar">
                <div className="search-input-group">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="search for available trips packages"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="search-submit-btn">Search</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trips-filter-bar">
        <div className="filter-container">
          <div className="filter-group">
            <span className="filter-label">Duration:</span>
            <div className="filter-pills">
              {["All", "1-2 Days", "4-7 Days", "8+ Days"].map(opt => (
                <button 
                  key={opt}
                  className={activeDuration === opt ? "active" : ""}
                  onClick={() => setActiveDuration(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Difficulty:</span>
            <div className="filter-pills">
              {["All", "Easy", "Moderate", "Hard"].map(opt => (
                <button 
                  key={opt}
                  className={activeDifficulty === opt ? "active" : ""}
                  onClick={() => setActiveDifficulty(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trips-main-content">
        <div className="trips-grid">
          {filteredTrips.map((trip) => (
            <div className="trip-card" key={trip.id}>
              <div className="trip-card-img" style={{ 
                backgroundImage: `url(${getImageUrl(trip)})` 
              }}>
                <span className={`difficulty-badge ${trip.difficulty_type?.toLowerCase()}`}>
                  {trip.difficulty_type}
                </span>
              </div>
              
              <div className="trip-card-body">
                <h3>{trip.name}</h3>
                <div className="trip-card-location">
                  <MapPin size={14} /> {trip.location}
                </div>
                <p className="trip-card-description">
                  {trip.description.substring(0, 110)}...
                </p>
                
                <div className="trip-card-meta">
                  <span><Clock size={16} /> {trip.duration} Day{trip.duration > 1 ? 's' : ''}</span>
                  <span><Users size={16} /> Max {trip.num_people} people</span>
                </div>
                
                <div className="trip-card-footer">
                  <div className="trip-card-price">
                    <span className="price-from">From</span>
                    <span className="price-amount">${Math.round(trip.price)}</span>
                  </div>
                  <button className="trip-details-btn" onClick={() => navigate(`/trip/${trip.id}`)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanTrips;
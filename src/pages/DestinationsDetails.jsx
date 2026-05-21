import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Gauge, Calendar, CheckCircle, 
  ArrowLeft, Share2, Heart, Star, Compass, Info,
  ShieldCheck, Leaf, Users, ArrowRight
} from 'lucide-react';
import '../styles/destination/destDetails.css';

const DestinationsDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchDestinationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:5000/api/destinations/${id}`);
        
        if (!response.ok) {
          throw new Error('This destination could not be retrieved or does not exist.');
        }
        
        const data = await response.json();
        setDestination(data);
        
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const savedFavs = localStorage.getItem(`fav_destinations_${parsedUser.email}`);
          if (savedFavs) {
            const favsObj = JSON.parse(savedFavs);
            setIsFavorited(!!favsObj[id]);
          }
        }
      } catch (err) {
        console.error("Error loading destination details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestinationData();
    }
  }, [id]);

  const handleToggleFavorite = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert("Please login to save your favorite destinations!");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    const favKey = `fav_destinations_${parsedUser.email}`;
    const savedFavs = localStorage.getItem(favKey) ? JSON.parse(localStorage.getItem(favKey)) : {};
    
    const updatedFavs = { ...savedFavs, [id]: !isFavorited };
    localStorage.setItem(favKey, JSON.stringify(updatedFavs));
    setIsFavorited(!isFavorited);
  };

  const getTimelineData = () => {
    if (destination?.itinerary && destination.itinerary.length > 0) {
      return destination.itinerary;
    }

    const durationDays = parseInt(destination?.duration) || 1;
    const fallbackItineraries = [
      {
        day: 1,
        title: `Arrival & Hidden Exploration`,
        desc: `Arrive at ${destination?.name || 'destination'}, meet with community representatives, establish your base camp or lodge setup, and head out for an initial introductory trek across scenic local trails.`
      },
      {
        day: 2,
        title: `Deep Immersion & Cultural Horizons`,
        desc: `Wake up early for a spectacular sunrise. Spend the afternoon exploring primary regional wonders, deep jungle pathways, or historic landmarks while discussing ancestral lore with local conservation guides.`
      },
      {
        day: 3,
        title: `Panoramic Vantage & Departure Run`,
        desc: `Hike up to the highest local elevated point for unforgettable sweeping panoramic photos. Return to the community hub to support craft artisans before arranging return eco-transports.`
      }
    ];

    return fallbackItineraries.slice(0, durationDays);
  };

  if (loading) {
    return (
      <div className="dest-details-loader">
        <div className="spinner"></div>
        <p>Immersing your destination layout...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="dest-details-error">
        <h3>{error || "Destination Not Found"}</h3>
        <button className="back-home-btn" onClick={() => navigate('/destinations')}>
          Return to Explorations
        </button>
      </div>
    );
  }

  const dynamicTimeline = getTimelineData();

  return (
    <div className="modern-dest-page-wrapper">
      
      {/* 1. TOP UTILITY ACTION BAR */}
      <div className="dest-action-nav">
        <button className="nav-circle-btn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={18} />
          <span>Back to Destinations</span>
        </button>
        <div className="nav-action-group">
          <button className="nav-circle-btn" aria-label="Share">
            <Share2 size={18} />
          </button>
          <button 
            className={`nav-circle-btn heart-btn ${isFavorited ? 'active' : ''}`} 
            onClick={handleToggleFavorite}
            aria-label="Save to favorites"
          >
            <Heart size={18} fill={isFavorited ? "#ff4b4b" : "none"} color={isFavorited ? "#ff4b4b" : "currentColor"} />
          </button>
        </div>
      </div>

      {/* 2. HEADER META INTRO */}
      <header className="dest-main-header">
        <h1 className="dest-hero-title">{destination.name}</h1>
        <div className="dest-meta-row">
          <div className="meta-item-badge location">
            <MapPin size={15} />
            <span>{destination.location}</span>
          </div>
          <div className="meta-item-badge review">
            <Star size={15} fill="#ffb100" color="#ffb100" />
            <span className="rating-score">{destination.rating || '4.8'}</span>
            <span className="count-sub">({destination.reviews_count || 24} reviews)</span>
          </div>
        </div>
      </header>

      {/* 3. ASSET GRID GALLERY */}
      <section className="dest-mosaic-gallery">
        <div className="gallery-main-hero">
          <img 
            src={`/src/assets/destinations/${destination.image_url}.jpg`} 
            alt={`${destination.name} primary`} 
          />
        </div>
        
        <div className="gallery-sub-grid">
          <div className="sub-img-wrap">
            <img 
              src={`/src/assets/destinations/${destination.image_url}_1.jpg`} 
              alt={`${destination.name} perspective views`}
              onError={(e) => { e.target.src = `/src/assets/destinations/${destination.image_url}.jpg` }}
            />
          </div>
          <div className="sub-img-wrap">
            <img 
              src={`/src/assets/destinations/${destination.image_url}_2.jpg`} 
              alt={`${destination.name} scenic close-up`} 
              onError={(e) => { e.target.src = `/src/assets/destinations/${destination.image_url}.jpg` }}
            />
          </div>
        </div>
      </section>

      {/* 4. SPLIT INFRASTRUCTURE LAYOUT */}
      <div className="dest-split-container">
        
        {/* LEFT COLUMN: PRIMARY CONTENT */}
        <main className="dest-primary-details">
          
          {/* STATS STRIP */}
          <div className="dest-features-strip">
            <div className="feature-pill">
              <div className="pill-icon-wrap"><Clock size={18} /></div>
              <div className="pill-content">
                <span className="pill-title">Duration</span>
                <span className="pill-value">{destination.duration} {destination.duration === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>
            <div className="feature-pill">
              <div className="pill-icon-wrap"><Gauge size={18} /></div>
              <div className="pill-content">
                <span className="pill-title">Difficulty</span>
                <span className="pill-value">{destination.difficulty_type || 'Easy'}</span>
              </div>
            </div>
            <div className="feature-pill">
              <div className="pill-icon-wrap"><Calendar size={18} /></div>
              <div className="pill-content">
                <span className="pill-title">Best Season</span>
                <span className="pill-value">{destination.best_time || 'Aug - Dec'}</span>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* OVERVIEW SECTION */}
          <section className="details-section-block">
            <h2 className="section-subtitle-modern">Overview</h2>
            <p className="description-prose">{destination.description}</p>
          </section>

          <hr className="section-divider" />

          {/* HIGHLIGHTS SECTION */}
          <section className="details-section-block">
            <h2 className="section-subtitle-modern">Expedition Highlights</h2>
            <div className="highlights-modern-grid">
              {destination.highlights && destination.highlights.length > 0 ? (
                destination.highlights.map((highlight, index) => (
                  <div className="modern-h-card" key={index}>
                    <CheckCircle size={18} className="h-check-icon" />
                    <span>{highlight}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="modern-h-card"><CheckCircle size={18} className="h-check-icon" /> <span>Pristine Natural Landscapes</span></div>
                  <div className="modern-h-card"><CheckCircle size={18} className="h-check-icon" /> <span>Authentic Local Heritage</span></div>
                  <div className="modern-h-card"><CheckCircle size={18} className="h-check-icon" /> <span>Off-the-Beaten-Path Trails</span></div>
                  <div className="modern-h-card"><CheckCircle size={18} className="h-check-icon" /> <span>Photographic Vantage Points</span></div>
                </>
              )}
            </div>
          </section>

          {/* SUGGESTED ROUTE TIMELINE */}
          {dynamicTimeline.length > 0 && (
            <>
              <hr className="section-divider" />
              <section className="details-section-block">
                <h2 className="section-subtitle-modern">Suggested Route Timeline</h2>
                <div className="itinerary-timeline">
                  {dynamicTimeline.map((step, idx) => (
                    <div className="timeline-node-item" key={idx}>
                      <div className="node-marker-axis">
                        <div className="node-dot"><Compass size={14} /></div>
                        {idx !== dynamicTimeline.length - 1 && <div className="node-line-connector"></div>}
                      </div>
                      <div className="node-text-payload">
                        <span className="node-day-label">Day {step.day || idx + 1}</span>
                        <h4 className="node-step-title">{step.title}</h4>
                        <p className="node-step-desc">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>

        {/* RIGHT COLUMN: STICKY PLANNER CARD */}
        <aside className="dest-sticky-sidebar">
          <div className="sticky-planner-card">
            <div className="card-pricing-header">
              <span className="planner-badge">{destination.destination_type || 'Hidden Gem'}</span>
            </div>
            
            <div className="planner-notice-box">
              <Info size={16} className="notice-info-icon" />
              <p>Tailor your experience to {destination.name} with local eco-transports and certified community guides.</p>
            </div>

            <button 
              className="planner-action-btn-primary" 
              onClick={() => navigate('/trips')}
            >
              Plan Your Visit
            </button>
            
            <p className="card-footer-guarantee">
              *Secure custom travel options through your Account dashboard interface logs.
            </p>
          </div>
        </aside>
      </div>

      {/* ==========================================================================
         5. INTEGRATED SPECIFIC CONTEXTUAL FOOTER BLOCK
         ========================================================================== */}
      <footer className="dest-details-bespoke-footer">
        <div className="footer-pledge-card">
          <div className="pledge-header-row">
            <div className="badge-icon-shield"><ShieldCheck size={22} /></div>
            <h3>The Sustainable Exploration Pledge</h3>
          </div>
          <p className="pledge-essay">
            Paths leading to <strong>{destination.name}</strong> traverse critical ecosystem corridors and local heritage properties. 
            We are dedicated to low-impact conservation travel models. 10% of generated community booking funds are sent directly 
            to wildlife monitoring systems and native flora restoration projects.
          </p>
          <div className="pledge-pillars-row">
            <div className="pillar-item">
              <Leaf size={16} className="p-icon" />
              <span>Leave No Trace Dynamics</span>
            </div>
            <div className="pillar-item">
              <Users size={16} className="p-icon" />
              <span>Direct Community Fair-Pay</span>
            </div>
          </div>
        </div>

        <div className="footer-links-matrix">
          <div className="matrix-column">
            <h4>Navigate</h4>
            <button onClick={() => navigate('/destinations')} className="matrix-link">Explore Map Glimpses</button>
            <button onClick={() => navigate('/trips')} className="matrix-link">Active Curated Tracks</button>
          </div>
          <div className="matrix-column">
            <h4>Support Hub</h4>
            <a href="#safety" className="matrix-link">Safety Guidelines</a>
            <a href="#regulations" className="matrix-link">Eco-Regulations</a>
          </div>
          <div className="matrix-column-cta">
            <h4>Ready to Proceed?</h4>
            <p>Save this blueprint to your personal profile dashboard tracking log.</p>
            <button className="matrix-mini-cta-btn" onClick={handleToggleFavorite}>
              <span>{isFavorited ? "Saved in Favorites" : "Add to Saved Log"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="footer-copyright-strip">
          <span>&copy; {new Date().getFullYear()} Cambodia Hidden Gems Project. Ecosystem Logs Secured.</span>
        </div>
      </footer>

    </div>
  );
};

export default DestinationsDetails;
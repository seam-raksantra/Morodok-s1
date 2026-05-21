import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Gauge, ArrowUpRight, Loader2, Landmark, Tent, Palmtree, Mountain, Heart, Map, Sparkles, Filter } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/destination/destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Destinations');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [favorites, setFavorites] = useState({});
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const urlProvince = queryParams.get('province');

  const filters = [
    { name: 'All Destinations', icon: <Landmark size={15} /> },
    { name: 'Ancient Temples', icon: <Landmark size={15} /> },
    { name: 'Natural Wonder', icon: <Palmtree size={15} /> },
    { name: 'Local Community', icon: <Tent size={15} /> },
    { name: 'Mountain', icon: <Mountain size={15} /> }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      const favKey = `fav_destinations_${parsedUser.email}`;
      const savedFavs = localStorage.getItem(favKey);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    }

    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations');
        if (!response.ok) throw new Error('Failed to load destinations');
        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const toggleFavorite = (id) => {
    if (!user) {
      alert("Please login to save your favorite destinations!");
      return;
    }
    setFavorites(prev => {
      const newFavs = { ...prev, [id] : !prev[id] };
      localStorage.setItem(`fav_destinations_${user.email}`, JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const filteredData = useMemo(() => {
    return destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All Destinations' || dest.destination_type === activeFilter;
      const matchesProvince = !urlProvince || dest.location.toLowerCase().includes(urlProvince.toLowerCase());

      return matchesSearch && matchesFilter && matchesProvince;
    });
  }, [destinations, searchQuery, activeFilter, urlProvince]);

  return (
    <div className="modern-explore-viewport">
      <Header />

      {/* DYNAMIC METRIC HERO SECTION */}
      <section className="modern-hero-hub">
        <div className="hero-radial-glow"></div>
        <div className="hero-central-payload">
          <div className="hero-badge-pill">
            <Sparkles size={13} className="sparkle-accent" />
            <span>{urlProvince ? `Province Profile Log` : `Ecosystem Curations`}</span>
          </div>
          
          <h1 className="hero-title-headline">
            {urlProvince ? (
              <>Uncover <span className="gradient-text">{urlProvince}</span></>
            ) : (
              <>Cambodia’s <span className="gradient-text">Hidden Gems</span></>
            )}
          </h1>
          
          <p className="hero-paragraph-lead">
            {urlProvince 
              ? `Isolating cataloged low-impact trail logs, community habitats, and architectural relics discovered across ${urlProvince}.`
              : "Access an interactive registry of localized, community-managed ecosystems and structural remnants bypassing commercial corridors."}
          </p>

          {/* FLOAT FLOATING SEARCH BAR ASSEMBLY */}
          <div className="modern-search-capsule-wrapper">
            <div className="search-composite-dock">
              <Search size={20} className="dock-search-icon" />
              <input
                type="text"
                placeholder="Query name, community cluster, or coordinates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="dock-action-submit-btn">Filter Registry</button>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING STICKY FILTER SYSTEM STRIP */}
      <nav className="modern-filter-dock-bar">
        <div className="dock-bar-inner">
          <div className="dock-meta-indicator">
            <Filter size={14} />
            <span>Active Registry ({filteredData.length})</span>
          </div>
          <div className="dock-pills-scroll-rail">
            {filters.map(f => (
              <button
                key={f.name}
                className={`dock-pill-btn ${activeFilter === f.name ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(f.name)}
              >
                {f.icon}
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT DISPLAY REGISTRY */}
      <section className="modern-grid-display-canvas">
        {loading ? (
          <div className="canvas-loading-state">
            <Loader2 className="global-canvas-spinner" size={32} />
            <p>Decoding localized destination records...</p>
          </div>
        ) : error ? (
          <div className="canvas-status-fallback error-box">{error}</div>
        ) : filteredData.length > 0 ? (
          <div className="modern-asymmetrical-bento-grid">
            {filteredData.map((item) => (
              <article 
                className="modern-bento-card" 
                key={item.id} 
                onClick={() => navigate(`/destinations/${item.id}`)}
              >
                {/* Image asset component frame */}
                <div className="bento-image-viewport">
                  <img 
                    src={`/src/assets/destinations/${item.image_url}.jpg`} 
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="bento-card-shading-gradient"></div>
                  
                  {/* Top floating badges inside thumbnail */}
                  <span className="bento-type-badge">{item.destination_type || 'Eco Trail'}</span>
                  
                  <button 
                    className={`bento-fav-action-circle ${favorites[item.id] ? 'is-favorited' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    aria-label="Toggle Save Tracking"
                  >
                    <Heart 
                      size={16} 
                      fill={favorites[item.id] ? "#ff4d4d" : "none"} 
                      color={favorites[item.id] ? "#ff4d4d" : "#ffffff"} 
                    />
                  </button>

                  {/* Built-in glass-pill statistics footer overlay */}
                  <div className="bento-glass-stats-overlay">
                    <div className="glass-stat-item">
                      <Clock size={13} />
                      <span>{item.duration} {item.duration === 1 ? 'Day' : 'Days'}</span>
                    </div>
                    <div className="glass-stat-divider"></div>
                    <div className="glass-stat-item">
                      <Gauge size={13} />
                      <span>{item.difficulty_type || 'Moderate'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content Text Payload Box */}
                <div className="bento-text-payload">
                  <header className="bento-card-header">
                    <h3>{item.name}</h3>
                    <div className="bento-card-location-row">
                      <MapPin size={13} className="loc-pin" /> 
                      <span>{item.location}</span>
                    </div>
                  </header>
                  <p className="bento-card-prose-excerpt">{item.description}</p>
                  <div className="bento-card-action-trigger">
                    <span>Inspect Topography</span>
                    <ArrowUpRight size={15} className="trigger-arrow" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="modern-empty-state-card">
            <div className="empty-state-icon-avatar">
              <Map size={36} strokeWidth={1.25} />
            </div>
            <h3>No Active Logs Registered</h3>
            <p>No eco-destinations matching "{urlProvince || activeFilter}" are current indexed in this localized sector map view.</p>
            <button className="empty-state-reset-cta" onClick={() => navigate('/destinations')}>
              Re-initialize Global View
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Clock, Gauge, ArrowUpRight, Loader2, Landmark, Tent, Palmtree, Mountain, Heart, Map } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import DestinationsDetails from './DestinationsDetails';
import '../styles/destination/destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Destinations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDest, setSelectedDest] = useState(null);
  
  const [favorites, setFavorites] = useState({});
  const [user, setUser] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlProvince = queryParams.get('province');

  const filters = [
    { name: 'All Destinations', icon: <Landmark size={14} /> },
    { name: 'Ancient Temples', icon: <Landmark size={14} /> },
    { name: 'Natural Wonder', icon: <Palmtree size={14} /> },
    { name: 'Local Community', icon: <Tent size={14} /> },
    { name: 'Mountain', icon: <Mountain size={14} /> }
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
      const newFavs = { ...prev, [id]: !prev[id] };
      localStorage.setItem(`fav_destinations_${user.email}`, JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const filteredData = useMemo(() => {
    return destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All Destinations' || dest.destination_type === activeFilter;
      
      const matchesProvince = !urlProvince || 
        dest.location.toLowerCase().includes(urlProvince.toLowerCase());

      return matchesSearch && matchesFilter && matchesProvince;
    });
  }, [destinations, searchQuery, activeFilter, urlProvince]);

  return (
    <div className="dest-page-wrapper">
      <Header />

      <section className="dest-hero">
        <div className="dest-hero-overlay">
          <div className="dest-hero-content">
            <span className="dest-hero-sub">
               {urlProvince ? `Exploring ${urlProvince}` : "Discover Cambodia's Best Kept Secrets"}
            </span>
            <h1 className="dest-hero-title">
              {urlProvince ? urlProvince : "Hidden Destinations"}
            </h1>
            <p className="dest-hero-para">
              {urlProvince 
                ? `Showing unique hidden gems specifically located in ${urlProvince} province.`
                : "Explore pristine landscapes, ancient temples, and authentic communities, far from the tourist trails."}
            </p>

            <div className="dest-search-wrapper">
              <div className="dest-search-bar">
                <div className="search-input-group">
                  <Search size={22} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
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

      <section className="dest-filter-bar">
        <div className="filter-container">
          <span className="filter-label">Filter by Category:</span>
          <div className="filter-pills">
            {filters.map(f => (
              <button
                key={f.name}
                className={activeFilter === f.name ? 'active' : ''}
                onClick={() => setActiveFilter(f.name)}
              >
                {f.icon} {f.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="dest-grid-container">
        {loading ? (
          <div className="dest-status"><Loader2 className="spinner" /></div>
        ) : error ? (
          <div className="dest-status error">{error}</div>
        ) : filteredData.length > 0 ? (
          <div className="dest-grid">
            {filteredData.map((item) => (
              <div className="dest-card" key={item.id} onClick={() => setSelectedDest(item)}>
                <div 
                  className="dest-card-image" 
                  style={{ backgroundImage: `url(/src/assets/destinations/${item.image_url}.jpg)` }}
                >
                  <div 
                    className="fav-icon-wrapper" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart 
                      size={18} 
                      fill={favorites[item.id] ? "#ff4d4d" : "none"} 
                      color={favorites[item.id] ? "#ff4d4d" : "#333"} 
                    />
                  </div>
                </div>

                <div className="dest-card-body">
                  <h3>{item.name}</h3>
                  <div className="dest-card-location">
                    <MapPin size={14} /> {item.location}
                  </div>
                  <p className="dest-card-description">{item.description}</p>
                  <div className="dest-card-footer">
                    <div className="dest-card-stats">
                      <span><Clock size={14} /> {item.duration} {item.duration === 1 ? 'Day' : 'Days'}</span>
                      <span><Gauge size={14} /> {item.difficulty_type}</span>
                    </div>
                    <div className="dest-card-btn">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-dest-found">
            <div className="no-dest-icon">
              <Map size={48} strokeWidth={1.5} />
            </div>
            <h2>No destinations for "{urlProvince || activeFilter}" yet.</h2>
            <p>We're still exploring! Please check back soon or try another province.</p>
            <button className="reset-filter-btn" onClick={() => navigate('/destinations')}>
              View All Destinations
            </button>
          </div>
        )}
      </section>

      <DestinationsDetails 
        destination={selectedDest} 
        onClose={() => setSelectedDest(null)} 
      />

      <Footer />
    </div>
  );
};

export default Destinations;
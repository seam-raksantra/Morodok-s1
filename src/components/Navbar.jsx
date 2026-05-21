import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, User, MapPin } from 'lucide-react';
import '../styles/navbar.css';
import logoImage from '../assets/logo/morodok-logo.jpg';

const provincesList = [
  "Phnom Penh", "Siem Reap", "Preah Sihanouk", "Kampot", "Kep", 
  "Battambang", "Koh Kong", "Mondulkiri", "Ratanakiri", "Kampong Cham",
  "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kandal", "Kratie",
  "Oddar Meanchey", "Pailin", "Preah Vihear", "Prey Veng", "Pursat",
  "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum", "Banteay Meanchey"
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [destinations, setDestinations] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations'); 
        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();

    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const provinceCounts = useMemo(() => {
    const counts = {};
    provincesList.forEach(p => counts[p] = 0);

    destinations.forEach(dest => {
      if (!dest.location) return;
      const matchedProvince = provincesList.find(p => 
        dest.location.toLowerCase().includes(p.toLowerCase())
      );
      if (matchedProvince) counts[matchedProvince] += 1;
    });
    return counts;
  }, [destinations]);

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className={`modern-nav-shell stacked-layout ${scrolled ? 'has-scrolled' : ''}`}>
      
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="nav-announcement-ticker">
        <span>Free eco-guide mapping parameters on matching bookings over USD $50</span>
      </div>

      <div className="nav-container-inner stacked-grid">
        
        <div className="nav-top-row single-focus">
          
          <div className="nav-row-left-spacer"></div>

          <div className="nav-brand-logo centered-stack" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
            <img src={logoImage} alt="Morodok Eco Logo" className="brand-logo-img" />
            {/* <span className="brand-name-text">Morodok <span>Eco</span></span> */}
          </div>

          <div className="nav-auth-cluster row-right-icons">
            {user ? (
              <Link 
                to={user.role === 'admin' ? "/admin" : "/account"} 
                className="nav-account-profile-pill"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="avatar-placeholder-circle">
                  <User size={13} />
                </div>
                <span>My Hub</span>
              </Link>
            ) : (
              <>
                <button className="auth-action-login-btn" onClick={() => navigate('/login')}>Sign In</button>
                <button className="auth-action-signup-btn mini-capsule" onClick={() => navigate('/signup')}>Join Us</button>
              </>
            )}
            
            {/* Mobile menu trigger */}
            <button className="mobile-toggle-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ROW 2: LINK NAVIGATION STRIP & CUSTOM DROPDOWN LIST */}
        <div className={`nav-interactive-wrapper row-links-strip ${isMenuOpen ? 'is-open' : ''}`}>
          <nav className="nav-links-deck center-justified">
            
            <Link to="/destinations" className={`nav-link-item ${isActivePath('/destinations') ? 'active-route' : ''}`} onClick={() => setIsMenuOpen(false)}>
              All Eco-Spots
            </Link>

            {/* HIGHLY CUSTOM PROVINCES LIST EXPANSION MENU */}
            <div className="dropdown-interactive-trigger">
              <span className="nav-link-item cursor-pointer">
                <span>Provinces</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </span>
              
              {/* BEAUTIFUL COMPACT PROVINCES DROPDOWN */}
              <div className="lush-provinces-dropdown-menu">
                <div className="dropdown-scroll-container">
                  {[...provincesList].sort().map((province) => {
                    const count = provinceCounts[province];
                    return (
                      <Link 
                        key={province} 
                        to={`/destinations?province=${province}`}
                        className={`province-dropdown-item ${count === 0 ? 'is-empty-node' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="item-label-group">
                          <MapPin size={13} className="item-pin-icon" />
                          <span className="province-item-name">{province}</span>
                        </div>
                        {count > 0 && <span className="province-item-count">{count}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <Link to="/trips" className={`nav-link-item ${isActivePath('/trips') ? 'active-route' : ''}`} onClick={() => setIsMenuOpen(false)}>
              Plan Trips
            </Link>
            <Link to="/packages" className={`nav-link-item ${isActivePath('/packages') ? 'active-route' : ''}`} onClick={() => setIsMenuOpen(false)}>
              Packages
            </Link>
            <Link to="/sustainability" className={`nav-link-item ${isActivePath('/sustainability') ? 'active-route' : ''}`} onClick={() => setIsMenuOpen(false)}>
              Sustainability
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
};

export default Header;
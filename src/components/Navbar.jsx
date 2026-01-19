import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logoImage from '../assets/logo/morodok-logo.png';

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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations'); 
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const provinceCounts = useMemo(() => {
    const counts = {};
    provincesList.forEach(p => counts[p] = 0);

    destinations.forEach(dest => {
      const matchedProvince = provincesList.find(p => 
        dest.location.toLowerCase().includes(p.toLowerCase())
      );
      if (matchedProvince) {
        counts[matchedProvince] += 1;
      }
    });
    return counts;
  }, [destinations]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logoImage} alt="Morodok Eco Logo" className="logo-image" />
        Morodok Eco
      </div>

      <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="bar"></span><span className="bar"></span><span className="bar"></span>
      </div>

      <div className={`nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
        <nav className="nav">
          <div className="dropdown-trigger">
            <Link to="/destinations" className="nav-link">Destinations</Link>
            
            <div className="mega-menu-fullwidth">
              <div className="mega-menu-container">
                <div className="mega-menu-header">
                  <h3>Explore Cambodia</h3>
                  <p>Discover {destinations.length} destinations across the Kingdom</p>
                </div>
                
                <div className="province-grid">
                  {[...provincesList].sort().map((province) => {
                    const count = provinceCounts[province];
                    return (
                      <Link 
                        key={province} 
                        to={`/destinations?province=${province}`}
                        className={`province-card ${count === 0 ? 'zero-count' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="province-name">{province}</span>
                        <span className="count-tag">{count}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/trips" onClick={() => setIsMenuOpen(false)}>Plan Trips</Link>
          <Link to="/sustainability" onClick={() => setIsMenuOpen(false)}>Sustainable</Link>
        </nav>
        
        <div className="auth-buttons">
          {user ? (
            <Link to={user.role === 'admin' ? "/admin" : "/account"} className="account-btn">My Account</Link>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
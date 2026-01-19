import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main-content">
            <div className="footer-newsletter">
              <h2 className="footer-title">STAY CONNECTED</h2>
              <p className="footer-subtitle">
                Receive updates on new hidden destinations and sustainable travel tips
              </p>
              <div className="footer-input-wrapper">
                <input 
                  type="email" 
                  placeholder="Your emails address" 
                  className="footer-input"
                />
                <button className="footer-subscribe-btn">
                  Subscribe &rarr;
                </button>
              </div>
            </div>

            <div className="footer-links-column">
              <h3 className="column-header">EXPLORE</h3>
              <ul className="footer-list">
                <li><a href="/destinations">Destinations</a></li>
                <li><a href="/trips">Trips</a></li>
                <li><a href="/guide">Travel Guide</a></li>
                <li><a href="/sustainability">Sustainability</a></li>
                <li><a href="/about">About Us</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="column-header">CONTACT</h3>
              <ul className="contact-list">
                <li className="bold-text">+855 23 456 789</li>
                <li className="bold-text">morodok.eco@kh.com</li>
                <li className="spacer"></li>
                <li className="column-header small-header" style={{ color: '#8a9a8a' }}>Visit Us</li>
                <li style={{ color: '#B7B2B2' }}>Phnom Penh, Cambodia</li>
                <li style={{ color: '#B7B2B2' }}>Sustainable Tourism Office</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div className="social-links">
              <a href="https://www.facebook.com/share/1GEty1ZS1j/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <span className="dot"></span>
              <a href="https://www.instagram.com/seam_raksan?igsh=Y2Nqd3p2cTJnOWk0" target="_blank" rel="noopener noreferrer">Instagram</a>
              <span className="dot"></span>
              <a href="https://t.me/san2shine" target="_blank" rel="noopener noreferrer">Telegram</a>
            </div>

            <div className="copyright">
              © 2025 Cambodia Hidden Places. Committed to Sustainable Tourism.
            </div>

            <div className="legal-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <span className="dot"></span>
              <a href="/terms">Term of Use</a>
            </div>
          </div>
    </footer>
  );
};

export default Footer;
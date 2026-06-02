import React from 'react';
import { Phone, MapPin, Send, Facebook, Instagram } from 'lucide-react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="lush-footer-container">
      
      <div className="footer-top-strip">
        <div className="payment-badges-wrap">
          <span className="strip-label">We accept</span>
          <div className="badge-mock-aba">ABA</div>
          <div className="badge-mock-khqr">KHQR</div>
        </div>
        <div className="strip-copyright">
          Copyright © 1995–{new Date().getFullYear()} Cambodia Hidden Places. All Rights Reserved.
        </div>
      </div>

      <div className="footer-action-banner">
        <div className="banner-left-intro">
          <h2>Do you need help ?</h2>
          <p>Receive updates on hidden destinations or contact our sustainable travel support desk directly.</p>
        </div>
        <div className="banner-right-options">
          <div className="banner-contact-pill">
            <div className="pill-icon-circle"><Phone size={18} /></div>
            <div className="pill-text-stack">
              <span className="pills-title">Customer Support</span>
              <span className="pills-value">+855 23 456 789</span>
            </div>
          </div>
          <div className="banner-contact-pill">
            <div className="pill-icon-circle"><MapPin size={18} /></div>
            <div className="pill-text-stack">
              <span className="pills-title">Our Office</span>
              <span className="pills-value">Phnom Penh, KH</span>
            </div>
          </div>
          <div className="banner-contact-pill">
            <div className="pill-icon-circle"><Send size={18} /></div>
            <div className="pill-text-stack">
              <span className="pills-title">Telegram</span>
              <span className="pills-value">t.me/san2shine</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-base-grid">
        <div className="base-grid-column brand-bio-summary">
          <h3 className="brand-logo-text">Explo<span>rime</span></h3>
          <p className="brand-paragraph">
            Your one-stop sustainable travel ecosystem hub. Discover undocumented locations, book low-impact routes, and leave a lasting green legacy. Straight to your travel journal.
          </p>
        </div>

        <div className="base-grid-column">
          <h4>Explore Now</h4>
          <ul className="base-links-list">
            <li><a href="/destinations">Destinations</a></li>
            <li><a href="/trips">Curated Trips</a></li>
            <li><a href="/guide">Travel Blueprint Guides</a></li>
            <li><a href="/sustainability">Our Carbon Footprint</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        <div className="base-grid-column">
          <h4>My Account Interface</h4>
          <ul className="base-links-list">
            <li><a href="/profile">Personal Profile</a></li>
            <li><a href="/trips">Track Travel Orders</a></li>
            <li><a href="/privacy-policy">Privacy Policy Protocols</a></li>
            <li><a href="/terms">Terms of Service Legalities</a></li>
          </ul>
        </div>

        <div className="base-grid-column">
          <h4>Stay Connected</h4>
          <div className="social-media-circles-row">
            <a href="https://www.facebook.com/share/1GEty1ZS1j/" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Facebook">
              <Facebook size={16} fill="currentColor" />
            </a>
            <a href="https://www.instagram.com/seam_raksan?igsh=Y2Nqd3p2cTJnOWk0" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://t.me/san2shine" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Telegram">
              <Send size={16} fill="currentColor" />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
import React from 'react';
import { Leaf, Users, ShieldCheck, Home, Map, MapPin, Instagram, Send } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/home/homepage.css'; 

const BACKGROUND_IMAGE_URL = '../src/assets/banner/mountianHill.jpg'; 
const CTA_IMAGE_URL = '../src/assets/banner/sunSet.jpg';

const Homepage = () => {
  const features = [
    { icon: <Leaf size={18} />, label: 'Carbon Neutral' },
    { icon: <Users size={18} />, label: 'Local Guides' },
    { icon: <ShieldCheck size={18} />, label: 'Conservation' },
    { icon: <Home size={18} />, label: 'Cultural Respect' },
    { icon: <Map size={18} />, label: 'Off-Path' },
  ];

  return (
    <div className="hp-main-wrapper">
      <section className="hp-hero" style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}>
        <Header />
        <div className="hp-hero-content">
          <div className="hp-tagline">Sustainable Travel * Authentic Cambodia</div>
          <h1>Discover Cambodia's<br/>Secret Sanctuaries</h1>
          <p>Journey beyond the crowds to pristine forests, hidden temples, and authentic villages where nature and culture remain untouched.</p>
        </div>
      </section>

      <section className="hp-mission">
        <div className="hp-container">
          <span className="hp-section-label">OUR MISSION</span>
          <h2 className="hp-mission-title">Preserving Paradise<br/>Through Responsible<br/> Exploration</h2>
          
          <div className="hp-mission-description">
            <p>We believe that tourism should enrich both travelers and local communities while protecting Cambodia's extraordinary natural heritage. Every journey we curate supports conservation efforts and empowers indigenous guides.</p>
            <p>Our carefully selected destinations remain pristine because we limit visitor numbers, follow strict environmental protocols, and ensure that tourism revenue directly benefits the communities who protect these sacred places.</p>
          </div>

          <div className="hp-feature-pills">
            {features.map((item, index) => (
              <div key={index} className="hp-pill">
                {item.icon} <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-destinations">
        <div className="hp-dest-header">
          <div className="hp-dest-title-group">
            <span className="hp-cursive">Hidden</span>
            <h2>DESTINATIONS</h2>
          </div>
          <p className="hp-dest-text">
            Each destination is chosen for its ecological significance, cultural authenticity, and minimal tourist impact. We work with local communities to ensure sustainable access to these remarkable places.
          </p>
        </div>

        <div className="hp-bento-grid">
          <div className="hp-bento-main" style={{ backgroundImage: `url('../src/assets/images/kohKer.png')` }}>
            <div className="hp-card-overlay">
              <h3>Koh Ker Temple</h3>
              <div className="hp-location"><MapPin size={14} /> Siem Reap Province</div>
            </div>
          </div>
          <div className="hp-bento-stack">
            <div className="hp-bento-item" style={{ backgroundImage: `url('../src/assets/images/tonleSap.jpg')` }}>
              <div className="hp-card-overlay">
                <span className="hp-badge">Floating Communities</span>
                <h3>Tonle Sap Lake Villages</h3>
              </div>
            </div>
            <div className="hp-bento-item" style={{ backgroundImage: `url('../src/assets/images/cardamomMountains.jpg')` }}>
              <div className="hp-card-overlay">
                <span className="hp-badge">Mountain Trails</span>
                <h3>Cardamom Mountains</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="hp-center-btn" onClick={() => window.location.href = '/destinations'}>
          <button className="hp-btn-explore">Explore All Destinations</button>
        </div>
      </section>

      <section className="hp-testimonial-sec">
        <div className="hp-testimonial-card">
          <div className="hp-testimonial-img" style={{ backgroundImage: `url('../src/assets/logo/image1.jpg')` }}></div>
          
          <div className="hp-testimonial-body">
            <span className="hp-quote-icon">“</span>
            <p className="hp-testimonial-text">
              "This journey showed me Cambodia's soul - not through crowds, but through quiet forests and village stories. 
              Our guide Sophea shared his family's connection to the land, and I understood why preserving these places matters so deeply."
            </p>
            
            <div className="hp-author">
              <h4>Raksantra Seam</h4>
              <p>Eco-Traveler, Cambodia</p>
            </div>
            
            <button className="hp-btn-readmore">Read More</button>
          </div>
        </div>
      </section>

      <section className="hp-cta-section">
        <div className="hp-cta-container">
          <div className="hp-cta-image" style={{ backgroundImage: `url(${CTA_IMAGE_URL})` }}>
            <div className="hp-cta-image-text">
              <p>Start your journey</p>
              <h2>Plan your sustainable adventure</h2>
            </div>
          </div>
          
          <div className="hp-cta-content">
            <h2>Ready to Explore Responsibly?</h2>
            <p>
              Begin your journey to Cambodia's hidden treasures. Our team will craft a 
              personalized itinerary that honors both your adventure spirit and our 
              commitment to sustainability.
            </p>
            <button className="hp-btn-trips" onClick={() => window.location.href = '/trips'}>
              Begin Planning &rarr;
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Homepage;
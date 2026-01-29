import React, { useRef } from 'react';
import { Leaf, Users, ShieldCheck, Home, Map, MapPin, Instagram, Send, ArrowLeft, ArrowRight, Clock, Compass } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/home/homepage.css'; 

const BACKGROUND_IMAGE_URL = '../src/assets/banner/mountianHill.jpg'; 
const CTA_IMAGE_URL = '../src/assets/banner/sunSet.jpg';

const Homepage = () => {
  const scrollRef = useRef(null);

  const features = [
    { icon: <Leaf size={18} />, label: 'Carbon Neutral' },
    { icon: <Users size={18} />, label: 'Local Guides' },
    { icon: <ShieldCheck size={18} />, label: 'Conservation' },
    { icon: <Home size={18} />, label: 'Cultural Respect' },
    { icon: <Map size={18} />, label: 'Off-Path' },
  ];

  const adventures = [
    { id: 1, title: "Mangrove Kayaking", time: "4 Hours", level: "Easy", price: "$45", img: "../src/assets/adventures/kayak_tour.jpg" },
    { id: 2, title: "Jungle Trekking", time: "6 Hours", level: "Moderate", price: "$65", img: "../src/assets/adventures/jungle_trekking.jpg" },
    { id: 3, title: "Village Cycling Tour", time: "5 Hours", level: "Easy", price: "$50", img: "../src/assets/adventures/village_cycling.jpg" },
    { id: 4, title: "Wildlife Safari", time: "8 Hours", level: "Easy", price: "$90", img: "../src/assets/adventures/wildlife_safari.jpg" },
    { id: 5, title: "Cooking Workshop", time: "3 Hours", level: "Moderate", price: "$40", img: "../src/assets/adventures/cooking_workshop.jpg" },
    { id: 6, title: "Eco Camping", time: "7 Hours", level: "Hard", price: "$75", img: "../src/assets/adventures/eco_camping.jpg" },
    { id: 7, title: "River Cruise", time: "2 Hours", level: "Easy", price: "$30", img: "../src/assets/adventures/river_cruise.jpg" },
  ];

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = 340;
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

      <section className="hp-adventures-sec">
        <div className="hp-adventures-container">
          
          <div className="hp-adventures-info">
            <span className="hp-label-badge">CURATED EXPERIENCES</span>
            <h2 className="hp-adventures-title">Immersive Eco Adventures</h2>
            <p className="hp-adventures-description">
              Join our carefully crafted eco-tours that blend adventure with sustainability. 
              Each experience supports local communities while showcasing Cambodia's incredible natural beauty.
            </p>
            <div className="hp-nav-buttons">
              <button className="hp-nav-btn" onClick={() => scroll('left')}><ArrowLeft size={20} /></button>
              <button className="hp-nav-btn active" onClick={() => scroll('right')}><ArrowRight size={20} /></button>
            </div>
          </div>

          <div className="hp-adventures-carousel" ref={scrollRef}>
            {adventures.map((adv) => (
              <div className="hp-adventure-card" key={adv.id}>
                <div className="hp-card-img" style={{ backgroundImage: `url(${adv.img})` }}></div>
                <div className="hp-card-content">
                  <h3>{adv.title}</h3>
                  <div className="hp-card-meta">
                    <span><Clock size={14} /> {adv.time}</span>
                    <span><Compass size={14} /> {adv.level}</span>
                  </div>
                  <div className="hp-card-footer">
                    <span className="hp-price">{adv.price}</span>
                    <a href="#" className="hp-learn-more">Learn More &rarr;</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-gallery-sec">
        <div className="hp-gallery-container">
          <div className="hp-gallery-header">
            <span className="hp-gallery-label">VISUAL STORIES</span>
            <h2 className="hp-gallery-title">Captured Moments</h2>
          </div>

          <div className="hp-gallery-grid">
            {[
              { id: 1, title: "Angkor Sunrise", class: "hp-tall", img: "../src/assets/gallery/angkor_sunrise.jpg" },
              { id: 2, title: "Wildlife Encounter", class: "", img: "../src/assets/gallery/wildlife_encounter.jpg" },
              { id: 3, title: "Mekong Sunset", class: "", img: "../src/assets/gallery/mekong_sunset.jpg" },
              { id: 4, title: "Island Paradise", class: "", img: "../src/assets/gallery/islend_paradise.jpg" },
              { id: 5, title: "Ancient Wisdom", class: "", img: "../src/assets/gallery/ancient_wisdom.jpg" },
              { id: 6, title: "Jungle Falls", class: "", img: "../src/assets/gallery/jungle_falls.jpg" },
              { id: 7, title: "Emerald Fields", class: "", img: "../src/assets/gallery/emerald_fields.jpg" }
            ].map((item) => (
              <div 
                key={item.id}
                className={`hp-gallery-item ${item.class}`} 
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <div className="hp-item-overlay">
                  <p>{item.title}</p>
                  <div className="hp-overlay-icon"><Compass size={24} /></div>
                </div>
              </div>
            ))}
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
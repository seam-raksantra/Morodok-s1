import React from 'react';
import { Plane, Landmark, Info, ShieldCheck, Briefcase } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/guide/travelGuide.css';

const IMAGE_URL = '../src/assets/images/gettingAround.jpg';
const IMAGE1_URL = '../src/assets/images/trips.jpg';
const IMAGE2_URL = '../src/assets/images/landHigh.jpg';

const TravelGuide = () => {
  return (
    <div className="guide-page-wrapper">
      <Header />

      <section className="guide-hero">
        <div className="guide-hero-overlay">
          <div className="guide-hero-content">
            <h1 className="guide-hero-title">Travel Guide</h1>
            <p className="guide-hero-para">
              Everything you need to know for an authentic and sustainable journey 
              through Cambodia's hidden treasures.
            </p>
          </div>
        </div>
      </section>
      
      <section className="guide-nav-section">
        <div className="guide-nav-container">
          <button className="guide-nav-pill active"> 
            <Plane size={18} /> Trip Planning
          </button>
          <button className="guide-nav-pill active"> 
            <Landmark size={18} /> Culture & Customs
          </button>
          <button className="guide-nav-pill active"> 
            <Info size={18} /> Practical Info
          </button>
          <button className="guide-nav-pill active"> 
            <ShieldCheck size={18} /> Health & Safety
          </button>
          <button className="guide-nav-pill active"> 
            <Briefcase size={18} /> Packing Tips
          </button>
        </div>
      </section>

      <section className="guide-main-content">
        <h2 className="section-main-title">Planning Your Journey</h2>

        <div className="guide-article-row">
          <div className="article-image">
            <img src={IMAGE1_URL} alt="Best Time to Visit" />
          </div>
          <div className="article-text">
            <h3>Best Time to Visit</h3>
            <p>
              The dry season (November to April) offers the most comfortable weather 
              for exploring Cambodia's hidden places. November to February provides 
              cooler temperatures, while March to April can be hot but perfect for 
              beach destinations. The wet season (May to October) brings lush 
              landscapes and fewer tourists, ideal for those seeking solitude.
            </p>
          </div>
        </div>

        <div className="guide-article-row reverse">
          <div className="article-image">
            <img src={IMAGE2_URL} alt="How Long to Stay" />
          </div>
          <div className="article-text">
            <h3>How Long to Stay</h3>
            <p>
              We recommend at least 7-10 days to truly experience Cambodia's hidden 
              gems. This allows time to explore ancient temples, connect with local 
              communities, and immerse yourself in nature without rushing. For a 
              comprehensive journey including multiple regions, consider 2-3 weeks.
            </p>
          </div>
        </div>

        <div className="guide-article-row">
          <div className="article-image">
            <img src={IMAGE_URL} alt="Getting Around" />
          </div>
          <div className="article-text">
            <h3>Getting Around</h3>
            <p>
              Our eco-friendly transportation options include electric tuk-tuks in 
              cities, bicycles for countryside exploration, and shared minivans for 
              longer distances. We partner with local drivers who know the hidden 
              routes and can share insider knowledge about the areas you're visiting.
            </p>
          </div>
        </div>

        <div className="info-cta-card">
          <div className="cta-icon">💡</div>
          <h4>Need More Information?</h4>
          <p>Our team is here to help you plan the perfect sustainable journey through Cambodia's hidden places. Get in touch with any questions!</p>
          <button className="cta-read-more">Read More</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TravelGuide;
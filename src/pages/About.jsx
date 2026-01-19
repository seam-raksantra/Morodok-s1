import React from 'react';
import { Heart, ShieldCheck, Users, Leaf, Lightbulb, Share2, Compass, Home, Globe } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/about/about.css';

const OUR_STORY_IMAGE = '/src/assets/images/ourStory.jpg';

const About = () => {
  return (
    <div className="about-page-wrapper">
      <Header />

      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Discovering Cambodia <br /> Together</h1>
            <p>From passion of our story community mission we help each traveler dedicated sharing Cambodia hidden treasures sustainability.</p>
          </div>
        </div>
      </section>

      <section className="our-story-section">
        <div className="sus-container">
          <div className="story-top-content">
            <div className="story-main-text">
              <h2>Our Story</h2>
              <p>
                Cambodia Hidden Places was born from a simple realization: while millions of 
                tourists visit Angkor Wat each year, countless other extraordinary places 
                in Cambodia remain virtually unknown to the outside world.
              </p>
              <p>
                Founded in 2020 by a group of Cambodian conservationists and international 
                travel experts, we set out to create a new kind of tourism - one that 
                benefits local communities, protects natural habitats, and offers 
                travelers truly authentic experiences.
              </p>
              <p>
                Today, we work with over 50 local communities across Cambodia, from the 
                Cardamom Mountains to the Mekong Delta, creating sustainable tourism 
                opportunities that preserve culture and nature while providing 
                meaningful livelihoods.
              </p>
            </div>
            <div className="story-main-image-wrapper">
              <img src={OUR_STORY_IMAGE} alt="Woman looking at temple" />
            </div>
          </div>

          <div className="story-highlight-grid">
            <div className="highlight-card">
              <h3>2020</h3>
              <h4>Founded</h4>
              <p>Started with 3 destinations and a vision to change how people experience Cambodia.</p>
            </div>
            <div className="highlight-card">
              <h3>50+</h3>
              <h4>Communities</h4>
              <p>Partnering with local villages to create sustainable tourism opportunities.</p>
            </div>
            <div className="highlight-card">
              <h3>100%</h3>
              <h4>Committed</h4>
              <p>To sustainable practices and positive impact on Cambodia's environment and people.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-impact-dark">
        <div className="sus-container">
          <div className="sus-header-center white-text">
            <h2>Our Impact in Numbers</h2>
            <p>The values that guide our journey and shape every experience we create.</p>
          </div>
          <div className="about-values-grid">
            <div className="value-card">
              <div className="value-icon-box"><Heart size={20} /></div>
              <h3>Authenticity</h3>
              <p>Genuine experiences that connect you with the real Cambodia.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box"><ShieldCheck size={20} /></div>
              <h3>Responsibility</h3>
              <p>Ensuring our tours have a positive impact on both environment and local communities.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box"><Users size={20} /></div>
              <h3>Community First</h3>
              <p>Supporting local businesses and empowering community members.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box"><Leaf size={20} /></div>
              <h3>Conservation</h3>
              <p>Dedicated to preserving Cambodia's natural beauty and wildlife.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box"><Lightbulb size={20} /></div>
              <h3>Innovation</h3>
              <p>Continuously finding new ways to make travel more sustainable.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-box"><Share2 size={20} /></div>
              <h3>Transparency</h3>
              <p>Open and honest communication about our practices and impact.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <div className="sus-container">
          <div className="sus-header-center">
            <h2>Meet Our Team</h2>
            <p>A diverse group of passionate experts dedicated to your Cambodian adventure.</p>
          </div>
          <div className="team-grid">
            {[ 
                { name: "Raksantra Seam", role: "Director of Operations" },
                { name: "Sophea Chea", role: "Founder/CEO" },
                { name: "Sreymom Phan", role: "Community Relations Manager" },
                { name: "James Chen", role: "Conservation Specialist" },
                { name: "Channary Sak", role: "Cultural Heritage Advisor" },
                { name: "Emma Thompson", role: "Sustainable Tour Coordinator" }
            ].map((member, i) => (
              <div key={i} className="team-card">
                <div className="team-img-placeholder">
                   <Users size={60} color="#ccc" />
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">Dedicated to providing excellence in our specific field of expertise.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-partners-dark">
        <div className="sus-container">
          <div className="sus-header-center white-text">
            <h2>Our Partners</h2>
            <p>We collaborate with leading organizations to maximize our positive impact</p>
          </div>
          <div className="partners-grid-about">
            <div className="partner-card">
                <Compass size={30} className="partner-icon" />
                <h3>Conservation Organizations</h3>
                <p>Wildlife Alliance, Fauna & Flora International, and Conservation International help us protect endangered species and their habitats.</p>
            </div>
            <div className="partner-card">
                <Home size={30} className="partner-icon" />
                <h3>Local Communities</h3>
                <p>Over 50 village cooperatives and community-based tourism initiatives across Cambodia are our most important partners.</p>
            </div>
            <div className="partner-card">
                <Users size={30} className="partner-icon" />
                <h3>Government Agencies</h3>
                <p>Ministry of Tourism and Ministry of Environment support our sustainable tourism initiatives and conservation efforts.</p>
            </div>
            <div className="partner-card">
                <Globe size={30} className="partner-icon" />
                <h3>International Networks</h3>
                <p>Members of Global Sustainable Tourism Council and Responsible Travel, ensuring we meet international best practices.</p>
            </div>
          </div>
          <div className="about-cta">
             <p>Interested in partnering with us to promote sustainable tourism in Cambodia?</p>
             <button className="white-get-in-touch">Get in touch</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
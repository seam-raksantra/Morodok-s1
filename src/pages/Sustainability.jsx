import React from "react";
import { Leaf, Users, PawPrint, Recycle, Music, Droplets, CheckCircle, Home, Trees } from 'lucide-react';
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import '../styles/sustainability/sustainability.css';

const COOPERATION_IMAGE = "/src/assets/images/cooperation.png";
const NATUREL_TRAVEL_IMAGE = "/src/assets/images/neutralTravel.jpg";
const COMMUNITY_EMPOWERMENT_IMAGE = "/src/assets/images/communityEmpowerment.jpg";
const WILDLIFE_CONSERVATION_IMAGE = "/src/assets/images/wildlifeConservation.jpg";
const WAST_COMMITMENT_IMAGE = "/src/assets/images/WasteCommitment.jpg";
const CULTURAL_PRESERVATION_IMAGE = "/src/assets/images/culturalPreservation.jpg";
const WATER_CONSERVATION_IMAGE = "/src/assets/images/waterConservation.png";
const HAND_PLANT_IMAGE = "/src/assets/images/handPlant.jpg";

const Sustainability = () => {
    return(
        <div className="sus-page-wrapper">
            <Header />
            <section className="sus-hero">
                <div className="sus-hero-overlay">
                    <div className="sus-hero-content">
                        <h1 className="sus-hero-title">Our Commitment to <br /> Sustainable Tourism</h1>
                        <p className="sus-hero-para">
                            Protecting Cambodia's natural wonders and empowering local
                            communities through responsible travel adventures.
                        </p>
                    </div>
                </div>
            </section>

            <section className="sus-mission-section">
                <div className="sus-mission-container">
                    <div className="sus-mission-text">
                        <h2>Our Mission</h2>
                        <p>We believe that tourism should be a force for good. Our mission is to preserve Cambodia's cultural heritage while protecting the rich biodiversity that makes our country unique. Every journey we design helps fund local conservation and education programs.</p>
                        <p>We are not just showing you Cambodia; we are helping to protect it for future generations.</p>
                    </div>
                    <div className="sus-mission-image">
                        <img src={COOPERATION_IMAGE} alt="Mission" />
                    </div>
                </div>
            </section>

            <section className="sus-initiatives">
                <div className="sus-container">
                    <div className="sus-header-center">
                        <h2>Our Sustainability Initiatives</h2>
                        <p>Concrete actions we take every day to ensure Cambodia's environment and people thrive.</p>
                    </div>

                    <div className="initiatives-grid">
                        <div className="init-card">
                            <div className="init-img-wrapper">
                                <img src={NATUREL_TRAVEL_IMAGE} alt="Nature" />
                                <div className="init-icon-badge"><Leaf size={20} /></div>
                            </div>
                            <div className="init-body">
                                <h3>Carbon Neutral Travel</h3>
                                <p>We offset 100% of our carbon footprint by supporting local reforestation projects in the Cardamom Mountains.</p>
                            </div>
                        </div>

                        <div className="init-card">
                            <div className="init-img-wrapper">
                                <img src={COMMUNITY_EMPOWERMENT_IMAGE} alt="Community" />
                                <div className="init-icon-badge"><Users size={20} /></div>
                            </div>
                            <div className="init-body">
                                <h3>Community Empowerment</h3>
                                <p>80% of our tour revenue stays within the local villages, supporting schools and small businesses.</p>
                            </div>
                        </div>

                        <div className="init-card">
                            <div className="init-img-wrapper">
                                <img src={WILDLIFE_CONSERVATION_IMAGE} alt="Wildlife" />
                                <div className="init-icon-badge"><PawPrint size={20} /></div>
                            </div>
                            <div className="init-body">
                                <h3>Wildlife Conservation</h3>
                                <p>We partner with local wildlife sanctuaries to protect endangered species and their habitats.</p>
                            </div>
                        </div>

                        <div className="init-card">
                            <div className="init-img-wrapper">
                                <img src={WAST_COMMITMENT_IMAGE} alt="Waste" />
                                <div className="init-icon-badge"><Recycle size={20} /></div>
                            </div>
                            <div className="init-body">
                                <h3>Zero Waste Commitment</h3>
                                <p>We eliminate single-use plastics and provide reusable bottles for all our travelers.</p>
                            </div>
                        </div>

                        <div className="init-card">
                            <div className="init-img-wrapper">
                                <img src={CULTURAL_PRESERVATION_IMAGE} alt="Cultural" />
                                <div className="init-icon-badge"><Music size={20} /></div>
                            </div>
                            <div className="init-body">
                                <h3>Cultural Preservation</h3>
                                <p>We work with local artisans to preserve traditional crafts through authentic exchange programs.</p>
                            </div>
                        </div>

                        <div className="init-card">
                            <div className="init-img-wrapper">
                                <img src={WATER_CONSERVATION_IMAGE} alt="Water" />
                                <div className="init-icon-badge"><Droplets size={20} /></div>
                            </div>
                            <div className="init-body">
                                <h3>Water Conservation</h3>
                                <p>Our partner accommodations use rainwater harvesting and water-efficient systems.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sus-impact-section-wrapper">
                <div className="sus-container">
                    <div className="sus-header-center white-text">
                        <h2>Our Impact Numbers</h2>
                        <p>Measurable results from our commitment to sustainable tourism since 2018.</p>
                    </div>
                    <div className="impact-grid">
                        <div className="impact-item">
                            <Trees size={30} />
                            <h4>12,500+</h4>
                            <p>Trees Planted</p>
                        </div>
                        <div className="impact-item">
                            <Home size={30} />
                            <h4>400+</h4>
                            <p>Local Families Supported</p>
                        </div>
                        <div className="impact-item">
                            <Leaf size={30} />
                            <h4>95%</h4>
                            <p>Carbon Offset Achieved</p>
                        </div>
                        <div className="impact-item">
                            <CheckCircle size={30} />
                            <h4>8</h4>
                            <p>Conservation Projects</p>
                        </div>
                        <div className="impact-item">
                            <Users size={30} />
                            <h4>2,300+</h4>
                            <p>Responsible Travelers</p>
                        </div>
                        <div className="impact-item">
                            <PawPrint size={30} />
                            <h4>15</h4>
                            <p>Protected Habitats</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sus-ongoing">
                <div className="sus-mission-container reverse">
                    <div className="sus-mission-image">
                        <img src={HAND_PLANT_IMAGE} alt="Hand nurturing a small plant" />
                    </div>

                    <div className="sus-mission-text">
                        <h2 className="ongoing-title">Our Ongoing <br /> Commitment</h2>
                        <p className="ongoing-description">
                            Sustainability isn't a destination - it's a continuous journey of 
                            improvement and innovation. We're constantly seeking new ways to 
                            reduce our environmental impact and increase our positive 
                            contribution to Cambodia's communities.
                        </p>

                        <div className="commitment-checklist">
                            <div className="checklist-item">
                                <div className="check-icon-wrapper">
                                    <CheckCircle size={24} className="check-icon" />
                                </div>
                                <div className="item-content">
                                    <h3>Annual Sustainability Audits</h3>
                                    <p>Independent third-party verification of our environmental and social impact</p>
                                </div>
                            </div>

                            <div className="checklist-item">
                                <div className="check-icon-wrapper">
                                    <CheckCircle size={24} className="check-icon" />
                                </div>
                                <div className="item-content">
                                    <h3>Local Guide Training Programs</h3>
                                    <p>Comprehensive training for local guides on eco-friendly practices and cultural sensitivity</p>
                                </div>
                            </div>

                            <div className="checklist-item">
                                <div className="check-icon-wrapper">
                                    <CheckCircle size={24} className="check-icon" />
                                </div>
                                <div className="item-content">
                                    <h3>Plastic-Free Supply Chain Goal 2026</h3>
                                    <p>Working with all partners to eliminate single-use plastics from every step of our journeys</p>
                                </div>
                            </div>
                        </div>

                        <button className="sus-action-btn-large">Join Our Sustainable Journey</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
export default Sustainability;
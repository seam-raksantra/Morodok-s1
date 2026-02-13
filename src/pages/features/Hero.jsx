import React, { useState } from 'react';
import '../../styles/packages/hero.css';

import imgDestination from '../../assets/banner/destination-banner.jpg';
import imgTravelGuide from '../../assets/banner/travelGuide.jpg';
import imgSunSet from '../../assets/banner/sunSet.jpg';
import imgForest from '../../assets/banner/forest.jpg';
import imgAngkorWat from '../../assets/banner/angkorWat.jpg';
import imgCardamomForest from '../../assets/banner/cardamomForest.jpg';

const Hero = () => {
  const images = [imgDestination, imgTravelGuide, imgSunSet, imgForest, imgAngkorWat, imgCardamomForest];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section 
      className="hero-container" 
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${images[currentIndex % images.length]})` }}
    >
      <button className="carousel-arrow left-arrow" onClick={prevSlide}>
        <span className="arrow-svg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
      </button>

      <button className="carousel-arrow right-arrow" onClick={nextSlide}>
        <span className="arrow-svg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </button>

      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Hero;
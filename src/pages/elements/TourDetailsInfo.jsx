import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiClock, FiCalendar, FiCheck, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';
import '../../styles/packagedetails/tourdetailsinfo.css';

const TourDetailsInfo = ({ tour }) => {
  if (!tour) return null;

  const [openSection, setOpenSection] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleSection = (sectionKey) => {
    setOpenSection(openSection === sectionKey ? null : sectionKey);
  };

  const descriptionLimit = 250;
  const fullText = tour.description || '';
  const shouldTruncate = fullText.length > descriptionLimit;
  
  const displayedText = (shouldTruncate && !isExpanded) 
    ? `${fullText.substring(0, descriptionLimit)}...` 
    : fullText;

  const scrollToSectionId = (targetId, tabName) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 60;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(tabName);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      const sections = [
        { name: 'overview', id: 'tour-overview-section' },
        { name: 'details', id: 'tour-details-section' },
        { name: 'destination', id: 'TourDestination' },
        { name: 'operator', id: 'AboutOperator' },
        { name: 'reviews', id: 'ReviewsSection' }
      ];

      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const includedItems = tour.features?.filter(item => item.is_included === 1) || [];
  const notIncludedItems = tour.features?.filter(item => item.is_included === 0) || [];

  return (
    <div className="tour-details-container">
      <nav className="details-tabs">
        <button 
          className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => scrollToSectionId('tour-overview-section', 'overview')}
        >
          Overviews
        </button>
        <button 
          className={`tab-item ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => scrollToSectionId('tour-details-section', 'details')}
        >
          Details
        </button>
        <button 
          className={`tab-item ${activeTab === 'destination' ? 'active' : ''}`}
          onClick={() => scrollToSectionId('TourDestination', 'destination')}
        >
          Destination
        </button>
        <button 
          className={`tab-item ${activeTab === 'operator' ? 'active' : ''}`}
          onClick={() => scrollToSectionId('AboutOperator', 'operator')}
        >
          Operator
        </button>
        <button 
          className={`tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => scrollToSectionId('ReviewsSection', 'reviews')}
        >
          Reviews
        </button>
      </nav>

      <div id="tour-overview-section">
        <section className="details-section">
          <h2 className="section-title">About</h2>
          <p className="description-text">
            {displayedText}
            {shouldTruncate && (
              <span 
                className="read-more" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? ' Read less' : ' Read more'}
              </span>
            )}
          </p>

          <div className="quick-meta">
            <div className="meta-item">
              <FiUsers className="meta-icon" />
              <span>Ages {tour.age_range || '0-99'}, max of {tour.group_size || 15} per group</span>
            </div>
            <div className="meta-item">
              <FiClock className="meta-icon" />
              <span>Duration: {tour.duration_text}</span>
            </div>
            <div className="meta-item">
              <FiCalendar className="meta-icon" />
              <span>Start time: Check availability</span>
            </div>
          </div>
        </section>
      </div>

      <hr className="divider" />

      <div id="tour-details-section" className="accordion-wrapper">
        
        <div className="accordion-item">
          <button className="accordion-header" onClick={() => toggleSection('highlights')}>
            <span>Highlights</span>
            {openSection === 'highlights' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openSection === 'highlights' && (
            <div className="accordion-content">
              <section className="details-section" style={{ border: 'none', padding: '0', margin: '0' }}>
                <button 
                  className="destination-link"
                  onClick={() => scrollToSectionId('TourDestination', 'destination')}
                >
                  See destination
                </button>
              </section>
            </div>
          )}
        </div>

        <div className="accordion-item">
          <button className="accordion-header" onClick={() => toggleSection('included')}>
            <span>What's included</span>
            {openSection === 'included' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openSection === 'included' && (
            <div className="accordion-content">
              <section className="inclusion-grid" style={{ padding: '0', gridTemplateColumns: '1fr' }}>
                <div className="inclusion-column">
                  <ul>
                    {includedItems.map((item, i) => (
                      <li key={i}>
                        <FiCheck className="check-icon" /> {item.feature_label}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="accordion-item">
          <button className="accordion-header" onClick={() => toggleSection('not-included')}>
            <span>What's not included</span>
            {openSection === 'not-included' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openSection === 'not-included' && (
            <div className="accordion-content">
              <section className="inclusion-grid" style={{ padding: '0', gridTemplateColumns: '1fr' }}>
                <div className="inclusion-column">
                  <ul>
                    {notIncludedItems.map((item, i) => (
                      <li key={i}>
                        <FiCheck className="not-check-icon" /> {item.feature_label}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          )}
        </div>

        {tour.sections && tour.sections.length > 0 && (
          tour.sections.map((sec, index) => (
            <div key={index} className="accordion-item">
              <button className="accordion-header" onClick={() => toggleSection(index)}>
                <span>{sec.section_title}</span>
                {openSection === index ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openSection === index && (
                <div className="accordion-content">
                  <p>{sec.section_content}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default TourDetailsInfo;
import React from 'react';
import '../../styles/packages/trustbar.css';

import logoWorld from '../../assets/logo/world-travel.jpg';
import logoCnn from '../../assets/logo/cnn-travel.jpg';
import logoMinistry from '../../assets/logo/ministry-tourism.jpg';
import logoTrips from '../../assets/logo/tripadvisor.jpg';
import logoGlobe from '../../assets/logo/globe-travel.jpg';
import logoFutureTourism from '../../assets/logo/future-of-tourism.jpg';
import logoTheLongRun from '../../assets/logo/the-long-run.jpg';
import logoDestinAsian from '../../assets/logo/destin-asain.jpg';
import logoAsiaLife from '../../assets/logo/asia-life.jpg';

const TrustBar = () => {
  const logos = [
    { name: 'World Travel', url: logoWorld },
    { name: 'CNN', url: logoCnn },
    { name: 'Ministry of Tourism', url: logoMinistry },
    { name: 'Trips', url: logoTrips },
    { name: 'Globe Travel', url: logoGlobe },
    { name: 'Future of Tourism', url: logoFutureTourism },
    { name: 'The Long Run', url: logoTheLongRun },
    { name: 'DestinAsian', url: logoDestinAsian },
    { name: 'Asia Life', url: logoAsiaLife }
  ];

  return (
    <section className="trust-bar">
      <div className="logo-slider">
        <div className="logo-track">
          {logos.map((logo, index) => (
            <div key={`first-${index}`} className="logo-item">
              <img src={logo.url} alt={logo.name} />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div key={`second-${index}`} className="logo-item">
              <img src={logo.url} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
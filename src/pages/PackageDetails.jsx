import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import PackageHeaderGrid from './elements/PackageHeaderGrid';
import TourDetailsInfo from './elements/TourDetailsInfo';
import TourDestination from './elements/TourDestination';
import AboutOperator from './elements/AboutOperator';
import BookingForm from './elements/BookingForm';
import ReviewsSection from './elements/ReviewsSection';
import '../styles/packagedetails/details-layout.css';

const ListingPageDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tours/${id}`);
        const result = await response.json();
        if (result.success) {
          setTour(result.data);
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourData();
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!tour) return <div className="error-state">Tour not found!</div>;

  return (
    <div className="details-page-wrapper">
      <main className="details-main-content">
        <PackageHeaderGrid tour={tour} />
        <TourDetailsInfo tour={tour} />
        <div id="TourDestination">
          <TourDestination tour={tour} />
        </div>
        <div id="AboutOperator">
          <AboutOperator tour={tour} />
        </div>
        <BookingForm tour={tour} />
        <div id="ReviewsSection">
          <ReviewsSection tour={tour} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListingPageDetails;
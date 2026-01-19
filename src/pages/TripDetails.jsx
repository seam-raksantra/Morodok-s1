import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, CheckCircle2, Info, ArrowLeft, Calendar } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/tripDetails/tripDetails.css';

import RelatedTrips from '../components/RelatedTrips';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [numTravelers, setNumTravelers] = useState(0);
  const [highlightsData, setHighlightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    startDate: '',
    specialRequests: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      const token = localStorage.getItem('token'); 
      
      try {
        const [tripRes, highlightsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/trips/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/tripshighlights/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!tripRes.ok || !highlightsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const tripJson = await tripRes.json();
        const highlightsJson = await highlightsRes.json();

        setTrip(tripJson);
        setHighlightsData(highlightsJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (numTravelers === 0) {
      alert("Please select the number of travelers.");
      return;
    }

    const token = localStorage.getItem('token'); 
    if (!token) {
      alert("Your session has expired. Please log in again.");
      navigate('/login');
      return;
    }

    const bookingPayload = {
      trip_id: id,
      full_name: formData.full_name,
      email: formData.email,
      contact_phone: formData.phone,
      num_people: numTravelers,
      started_date: formData.startDate,
      special_requests: formData.specialRequests,
      total_price: numTravelers * trip.price,
      status: 'pending'
    };

    try {
      console.log("Submitting booking...", bookingPayload);
      
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(bookingPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Server Success Response:", result);

        const finalBookingId = result.id || result.insertId || result.bookingId || "PENDING";

        navigate('/payment', { 
          state: { 
            bookingId: finalBookingId, 
            amount: bookingPayload.total_price,
            tripName: trip.name,
            customerName: formData.full_name,
          } 
        });
      } else if (response.status === 401) {
        alert("Unauthorized: Please login again.");
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error("Server Error Data:", errorData);
        alert(`Booking Error: ${errorData.message || 'Failed to submit'}`);
      }
    } catch (err) {
      console.error("Network/System Error:", err);
      alert("Server error. Please check if your backend is running.");
    }
  };

  if (loading) return <div className="loading">Loading Trip Details...</div>;
  if (!trip) return <div className="loading">Trip not found.</div>;

  const formatList = (value) => {
    if (!value || typeof value !== "string") return [];
    return value
      .replace(/\r\n/g, "\n")
      .split(/\n|\./)
      .map(item => item.trim())
      .filter(item => item.length > 3);
  };

  const highlights = formatList(highlightsData?.trips_highlights);
  const inclusions = formatList(highlightsData?.whats_include);
  const bestSeason = highlightsData?.best_season || "November - March";

  return (
    <div className="view-details-page">
      <Header />
      <main className="details-main-content">
        <div className="details-container">
          <Link to="/trips" className="back-link-btn">
             <ArrowLeft size={16} /> Back to Trip
          </Link>

          <div className="top-info-layout">
            <div className="visual-placeholder">
              <img src={`/src/assets/trips/${trip.image_url}.jpg`} alt={trip.name} />
            </div>
            <div className="text-content-side">
              <h1 className="main-package-title">{trip.name}</h1>
              <p className="package-description">{trip.description}</p>
              <div className="horizontal-badges">
                <span className="status-badge">{trip.difficulty_type}</span>
                <span className="meta-item"><Clock size={18} /> {trip.duration} Days / {trip.duration - 1} Nights</span>
                <span className="meta-item"><Users size={18} /> Max {trip.num_people} people</span>
              </div>
              <div className="price-display">
                <span className="from-label">From:</span>
                <span className="price-amount">${Math.round(trip.price)}</span>
              </div>
              <div className="season-banner">
                <Calendar size={18} /> <strong>Best Season:</strong> {bestSeason}
              </div>
            </div>
          </div>

          <div className="highlights-grid">
            <div className="list-col">
              <h3>Trip Highlights</h3>
              <ul className="icon-list">
                {highlights.length > 0 ? highlights.map((item, index) => (
                  <li key={index}><CheckCircle2 size={20} /> {item}</li>
                )) : <li>No highlights available.</li>}
              </ul>
            </div>
            <div className="list-col">
              <h3>What's Included</h3>
              <ul className="icon-list">
                {inclusions.length > 0 ? inclusions.map((item, index) => (
                  <li key={index}><CheckCircle2 size={20} /> {item}</li>
                )) : <li>No inclusions available.</li>}
              </ul>
            </div>
          </div>

          <div className="booking-section-header">
            <h2 className="booking-title">Book this Package Now</h2>
          </div>
          
          <div className="booking-layout-grid">
            <div className="booking-form-card">
              <form className="booking-form-internal" onSubmit={handleSubmit}>
                <div className="form-double-row">
                  <div className="field-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="full_name"
                      placeholder="Enter your full name" 
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="field-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-double-row">
                  <div className="field-group">
                    <label>Phone number *</label>
                    <input 
                      type="text" 
                      name="phone"
                      placeholder="Enter your phone number" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="field-group">
                    <label>Number of Travelers *</label>
                    <select 
                        required 
                        value={numTravelers || ""} 
                        onChange={(e) => setNumTravelers(Number(e.target.value))}
                    >
                        <option value="">select number pax</option>
                        {Array.from({ length: trip.num_people || 10 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'person' : 'people'}
                            </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label>Preferred Start Date *</label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="field-group">
                  <label>Special Requests or Dietary Requirements</label>
                  <textarea 
                    name="specialRequests"
                    placeholder="Let me know if you have any special requirements..." 
                    rows="4"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    maxLength="500"
                  ></textarea>
                  <div className="char-count">{formData.specialRequests.length}/500 characters</div>
                </div>

                <div className="important-info-box">
                  <h4>Important Information</h4>
                  <ul>
                    <li><CheckCircle2 size={16} /> A deposit of 30% is required to confirm your booking.</li>
                    <li><CheckCircle2 size={16} /> Free cancellation up to 14 days before departure.</li>
                    <li><CheckCircle2 size={16} /> We will contact you within 24 hours to confirm availability.</li>
                  </ul>
                </div>

                <button type="submit" className="submit-booking-btn">Submit Booking Request</button>
              </form>
            </div>

            <aside className="summary-sidebar">
              <div className="summary-card">
                <h3>Trip Summary</h3>
                <div className="summary-thumb">
                   <img src={`/src/assets/trips/${trip.image_url}.jpg`} alt="" />
                </div>
                <h4 className="summary-title">{trip.name}</h4>
                <div className="summary-meta">
                   <div className="summary-meta-item"><Clock size={16} /> {trip.duration} Days / {trip.duration - 1} Nights</div>
                   <div className="summary-meta-item"><Users size={16} /> Max {trip.num_people} people</div>
                </div>
                <div className="summary-badge">{trip.difficulty_type}</div>
                <div className="summary-pricing">
                  <div className="price-row">
                    <span>Price per person</span>
                    <span>${Math.round(trip.price)}</span>
                  </div>
                  <div className="price-row">
                    <span>Number of travelers</span>
                    <span>{numTravelers > 0 ? `${numTravelers} Pax` : "__ Pax"}</span>
                  </div>
                  <div className="price-total">
                    <span>Total</span>
                    <span>
                        {numTravelers > 0 
                            ? `$${(numTravelers * trip.price).toLocaleString()}` 
                            : "——"}
                    </span>
                  </div>
                </div>
                <div className="booking-notice">
                  <Info size={20} className="info-icon" />
                  <p>This is a booking request. Final price may vary based on availability and specific requirements.</p>
                </div>
              </div>
            </aside>
          </div>
          <RelatedTrips currentTripId={id} location={trip.location} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripDetails;
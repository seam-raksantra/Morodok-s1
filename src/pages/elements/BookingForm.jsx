import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { IoTimeOutline, IoPeopleOutline, IoCalendarOutline, IoChevronDownOutline, IoRemoveOutline, IoAddOutline } from 'react-icons/io5';
import '../../styles/packagedetails/bookingform.css';

const BookingForm = ({ tour }) => {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const travelerDropdownRef = useRef(null);

  // DEBUG: Monitor incoming parent data context
  useEffect(() => {
    console.log("DEBUG: BookingForm received this tour data:", tour);
  }, [tour]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    travelers: 1,
    startDate: '',
    specialRequests: ''
  });

  const [isTravelerDropdownOpen, setIsTravelerDropdownOpen] = useState(false);

  // Click outside listener for traveler dropdown closing control
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (travelerDropdownRef.current && !travelerDropdownRef.current.contains(event.target)) {
        setIsTravelerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unitPrice = tour?.prices || tour?.base_price || 0;
  const totalPrice = formData.travelers * unitPrice;
  
  const imgName = tour?.thumbnail || tour?.image_url;
  const imagePath = imgName 
    ? `/packages/${imgName}.jpg` 
    : `/packages/default.jpg`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateTravelersCount = (amount) => {
    const maxLimit = tour?.max_people || 10;
    setFormData(prev => {
      const updatedCount = prev.travelers + amount;
      if (updatedCount >= 1 && updatedCount <= maxLimit) {
        return { ...prev, travelers: updatedCount };
      }
      return prev;
    });
  };

  const handleCustomCalendarClick = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to book this package.");
      navigate('/login');
      return;
    }

    const bookingPayload = {
      trip_id: tour?.id || tour?.tour_id, 
      full_name: formData.full_name,
      email: formData.email,
      contact_phone: formData.phone,
      num_people: formData.travelers,
      started_date: formData.startDate,
      special_requests: formData.specialRequests,
      total_price: totalPrice,
      status: 'pending'
    };

    try {
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
        navigate('/payment', { 
          state: { 
            bookingId: result.id || result.insertId || result.bookingId, 
            amount: totalPrice,
            tripName: tour?.title,
            customerName: formData.full_name,
          } 
        });
      } else {
        const errorData = await response.json();
        alert(`Booking Error: ${errorData.message || 'Failed to request reservation.'}`);
      }
    } catch (err) {
      console.error("Booking submission link error:", err);
      alert("Server error connecting to booking endpoints.");
    }
  };

  if (!tour) return <div className="loading-placeholder">Loading booking details...</div>;

  return (
    <section className="booking-section">
      <h2 className="booking-main-title">Book this Package Now</h2>
      
      <div className="booking-container">
        {/* Left Side: Form */}
        <div className="booking-form-card">
          <form className="booking-grid" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name *</label>
              <input type="text" name="full_name" required placeholder="Enter your full name" onChange={handleInputChange} />
            </div>
            
            <div className="input-group">
              <label>Email Address *</label>
              <input type="email" name="email" required placeholder="Enter your email" onChange={handleInputChange} />
            </div>
            
            <div className="input-group">
              <label>Phone number *</label>
              <input type="text" name="phone" required placeholder="Enter your phone number" onChange={handleInputChange} />
            </div>
            
            {/* --- RECONSTRUCTED MODERN TRAVELERS PICKER --- */}
            <div className="input-group modern-custom-select-wrapper" ref={travelerDropdownRef}>
              <label>Number of Travellers *</label>
              <div 
                className={`modern-custom-select-trigger ${isTravelerDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsTravelerDropdownOpen(!isTravelerDropdownOpen)}
              >
                <div className="trigger-left-content">
                  <IoPeopleOutline className="trigger-icon" />
                  <span>{formData.travelers} {formData.travelers === 1 ? 'Person' : 'People'}</span>
                </div>
                <IoChevronDownOutline className="trigger-chevron" />
              </div>

              {isTravelerDropdownOpen && (
                <div className="modern-custom-dropdown-panel">
                  <div>
                    <span className="panel-label-title">Travelers</span>
                    <span className="panel-label-subtitle">Max {tour?.max_people || 10} people allowed</span>
                  </div>
                  
                  <div className="panel-counter-controls">
                    <button 
                      type="button"
                      className="counter-btn"
                      onClick={() => updateTravelersCount(-1)}
                      disabled={formData.travelers <= 1}
                    >
                      <IoRemoveOutline />
                    </button>
                    <span className="counter-value-display">{formData.travelers}</span>
                    <button 
                      type="button"
                      className="counter-btn"
                      onClick={() => updateTravelersCount(1)}
                      disabled={formData.travelers >= (tour?.max_people || 10)}
                    >
                      <IoAddOutline />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* --- RECONSTRUCTED MODERN DATE PICKER --- */}
            <div className="input-group full-width">
              <label>Check available date & time*</label>
              <div className="modern-datepicker-container" onClick={handleCustomCalendarClick}>
                <input 
                  type="date" 
                  name="startDate" 
                  ref={dateInputRef}
                  required 
                  onChange={handleInputChange} 
                />
                <IoCalendarOutline className="calendar-left-overlay-icon" />
              </div>
            </div>
            
            <div className="input-group full-width">
              <label>Special Requests or Dietary Requirements</label>
              <textarea 
                name="specialRequests" 
                placeholder="Let me know if you have any special requirements...." 
                onChange={handleInputChange}
                maxLength="500"
              ></textarea>
              <span className="char-count">{formData.specialRequests.length}/500 characters</span>
            </div>

            <div className="important-info-box">
              <h4>Important Information</h4>
              <ul>
                <li><AiOutlineCheckCircle className="icon-green" /> A deposit of 30% is required to confirm your booking</li>
                <li><AiOutlineCheckCircle className="icon-green" /> Free cancellation up to 14 days before departure</li>
                <li><AiOutlineCheckCircle className="icon-green" /> We will contact you within 24 hours to confirm availability</li>
              </ul>
            </div>

            <button type="submit" className="reserve-btn">Reserve Now</button>
          </form>
        </div>

        {/* Right Side: Summary Sidebar */}
        <aside className="summary-sidebar">
          <h3>Trip Summary</h3>
          <div className="summary-card">
            <img 
              src={imagePath} 
              alt={tour?.title} 
              className="summary-img" 
              onError={(e) => { 
                console.log("Image failed to load:", imagePath);
                e.target.src = '/packages/default.jpg'; 
              }}
            />
            
            <div className="summary-details">
              <h4>{tour?.title || "Tour Title"}</h4>
              <div className="summary-meta">
                <span><IoTimeOutline /> {tour?.duration_text || tour?.duration_category}</span>
                <span><IoPeopleOutline /> Max {tour?.max_people || 10} people</span>
              </div>

              <div className="difficulty-badge">{tour?.difficulty_type || tour?.difficulty || 'Easy'}</div>

              <div className="price-row">
                <span>Price per person</span>
                <strong>${Math.round(unitPrice)}</strong>
              </div>
              <div className="price-row">
                <span>Number of travelers</span>
                <span>{formData.travelers} Pax</span>
              </div>
              <div className="total-row">
                <span>Total:</span>
                <span className="total-price">${totalPrice.toLocaleString()}</span>
              </div>

              <div className="booking-notice">
                <AiOutlineInfoCircle />
                <p>This is a booking request. Final price may vary based on availability.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default BookingForm;
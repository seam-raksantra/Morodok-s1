import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ArrowLeft, Lock, Calendar, User, CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/payment/payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, tripName, customerName } = location.state || {};
  
  // --- States ---
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardName: customerName || '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    if (!bookingId) navigate('/trips');
    window.scrollTo(0, 0);
  }, [bookingId, navigate]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token'); 

      const response = await fetch('http://localhost:5000/api/bookings/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          bookingId: bookingId,
          paymentMethod: paymentMethod
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/booking-success', { 
          state: { 
            bookingId, 
            tripName, 
            amount, 
            method: paymentMethod 
          } 
        });
      } else {
        throw new Error(data.message || "Could not confirm payment with server.");
      }

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingId) return null;

  return (
    <div className="payment-view">
      <Header />
      
      {isProcessing && (
        <div className="payment-processing-overlay">
          <div className="processing-content">
            <Loader2 className="spinner-icon" size={48} />
            <h3>Processing Secure Payment</h3>
            <p>Verifying your transaction and updating your booking...</p>
          </div>
        </div>
      )}

      <div className="payment-hero-bg"></div>
      
      <main className="payment-main-container">
        <div className="payment-content-wrapper">
          
          <section className="payment-form-column">
            <button onClick={() => navigate(-1)} className="payment-back-control" disabled={isProcessing}>
              <ArrowLeft size={18} /> <span>Back to Booking Details</span>
            </button>

            <div className="payment-card-box">
              <div className="card-box-header">
                <h2>Secure Checkout</h2>
                <p>Booking Reference: <span className="ref-text">#{bookingId}</span></p>
              </div>

              <div className="payment-tabs">
                <button 
                  type="button"
                  className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                  disabled={isProcessing}
                >
                  <CreditCard size={18} />
                  <span>Cards</span>
                </button>
                <button 
                  type="button"
                  className={`tab-btn ${paymentMethod === 'bakong' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('bakong')}
                  disabled={isProcessing}
                >
                  <Smartphone size={18} />
                  <span>Bakong KHQR</span>
                </button>
                <button 
                  type="button"
                  className={`tab-btn ${paymentMethod === 'ewallet' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('ewallet')}
                  disabled={isProcessing}
                >
                  <CheckCircle size={18} />
                  <span>E-Wallets</span>
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="checkout-form">
                
                {paymentMethod === 'card' && (
                  <div className="method-content fade-in">
                    <div className="vendor-logos">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                    </div>
                    <div className="checkout-field">
                      <label><User size={14} /> Cardholder Name</label>
                      <input 
                        type="text" 
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Name on card" 
                        required 
                      />
                    </div>
                    <div className="checkout-field">
                      <label><CreditCard size={14} /> Card Number</label>
                      <div className="input-rel">
                        <input 
                          type="text" 
                          name="cardNumber"
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000" 
                          required 
                        />
                        <Lock size={16} className="input-icon-right" />
                      </div>
                    </div>
                    <div className="checkout-row">
                      <div className="checkout-field">
                        <label><Calendar size={14} /> Expiration</label>
                        <input 
                          type="text" 
                          name="expiry"
                          onChange={handleInputChange}
                          placeholder="MM / YY" 
                          required 
                        />
                      </div>
                      <div className="checkout-field">
                        <label>CVC</label>
                        <input 
                          type="password" 
                          name="cvc"
                          onChange={handleInputChange}
                          placeholder="***" 
                          maxLength="3" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bakong' && (
                  <div className="method-content bakong-section fade-in">
                    <div className="qr-placeholder">
                        <div className="mock-qr">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BakongPay" alt="Bakong QR" />
                        </div>
                        <p>Scan to pay with any Cambodian Bank app</p>
                    </div>
                    <ul className="bakong-features">
                      <li>• Instant KHQR payment</li>
                      <li>• Secure via National Bank of Cambodia</li>
                    </ul>
                  </div>
                )}

                {paymentMethod === 'ewallet' && (
                  <div className="method-content fade-in">
                    <div className="ewallet-options">
                      <div className="wallet-card">
                        <input type="radio" name="wallet" id="paypal" defaultChecked />
                        <label htmlFor="paypal">PayPal</label>
                      </div>
                      <div className="wallet-card">
                        <input type="radio" name="wallet" id="applepay" />
                        <label htmlFor="applepay">Apple Pay</label>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="payment-confirm-btn" disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="spinner-small" size={18} />
                  ) : (
                    paymentMethod === 'bakong' ? 'Confirm Transfer' : `Pay $${amount?.toLocaleString()}`
                  )}
                </button>
              </form>

              <div className="security-trust-badge">
                <ShieldCheck size={20} />
                <span>Encrypted 256-bit SSL Connection</span>
              </div>
            </div>
          </section>

          <aside className="payment-summary-column">
            <div className="summary-sticky-card">
              <h3>Trip Summary</h3>
              <div className="summary-trip-info">
                <span className="summary-trip-tag">Selected Package</span>
                <h4>{tripName}</h4>
              </div>
              <div className="summary-bill">
                <div className="bill-item"><span>Reservation for</span><span>{customerName}</span></div>
                <div className="bill-item"><span>Subtotal</span><span>${amount?.toLocaleString()}</span></div>
                <div className="bill-item"><span>Fees</span><span>$0.00</span></div>
                <div className="bill-total">
                  <span>Grand Total</span>
                  <span className="total-price-green">${amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
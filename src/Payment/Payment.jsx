import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ArrowLeft, Lock, Calendar, User, CheckCircle, Smartphone, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/payment/payment.css';

// Dynamically scale API routes depending on execution contexts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, tripName, customerName } = location.state || {};
  
  // --- States ---
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifyingManually, setIsVerifyingManually] = useState(false);
  const [bakongQrString, setBakongQrString] = useState('');
  const [isLoadingBakongQr, setIsLoadingBakongQr] = useState(false);
  
  // --- Expiration & Timer States ---
  const [qrExpired, setQrExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState('02:00');

  const [formData, setFormData] = useState({
    cardName: customerName || '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Reference hooks to track loops cleanly across state rerenders
  const pollingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }
    window.scrollTo(0, 0);

    // Completely dismantle active processes if user abandons the checkout view
    return () => {
      stopBakongPolling();
      stopCountdown();
    };
  }, [bookingId, navigate]);

  useEffect(() => {
    if (paymentMethod === 'bakong') {
      fetchRealBakongQR();
    } else {
      stopBakongPolling();
      stopCountdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod]);

  // --- Real Network Handlers ---

  const fetchRealBakongQR = async () => {
    setIsLoadingBakongQr(true);
    setQrExpired(false);
    setTimeLeft('02:00');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/generate-bakong-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId, amount })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setBakongQrString(data.qrString);
        
        // Start synchronous countdown text renderer and status loop tracking blocks
        startCountdown(data.expiresAt);
        startBakongPolling();
      } else {
        throw new Error(data.message || "Failed to generate dynamic KHQR.");
      }
    } catch (err) {
      console.error("Bakong Generation Error:", err);
      alert("Could not load Bakong QR: " + err.message);
      setPaymentMethod('card'); // Fall back gracefully
    } finally {
      setIsLoadingBakongQr(false);
    }
  };

  // Visual Countdown Timer logic matching expiration timestamps
  const startCountdown = (expiryTimestamp) => {
    stopCountdown(); // Safety wipe

    countdownIntervalRef.current = setInterval(() => {
      const difference = expiryTimestamp - Date.now();

      if (difference <= 0) {
        stopCountdown();
        stopBakongPolling();
        setQrExpired(true);
        setTimeLeft('00:00');
      } else {
        const totalSeconds = Math.floor(difference / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);
  };

  const startBakongPolling = () => {
    stopBakongPolling(); // Safety wipe

    const token = localStorage.getItem('token');

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/check-bakong-status/${bookingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // If backend reports the transaction has hit its strict timeline wall, stop processing
          if (data.qrExpired) {
            stopBakongPolling();
            stopCountdown();
            setQrExpired(true);
            return;
          }

          // REDIRECT IMMEDIATELY ON TRUE PAY CONFIRMATION
          if (data.paymentCleared) {
            stopBakongPolling();
            stopCountdown();
            
            navigate('/booking-success', { 
              state: { bookingId, tripName, amount, method: 'Bakong KHQR' } 
            });
          }
        }
      } catch (error) {
        console.error("Error polling Bakong status:", error);
      }
    }, 2500); 
  };

  /**
   * Manual verification checking step bypassing the real-time background listener intervals
   * Triggers deep checks matching your backend fallback ledger routines
   */
  const handleManualBakongVerification = async () => {
    if (isVerifyingManually) return;
    setIsVerifyingManually(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/verify-bakong-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId })
      });

      const data = await response.json();

      if (response.ok && data.success && data.status === 'Paid') {
        stopBakongPolling();
        stopCountdown();
        navigate('/booking-success', { 
          state: { bookingId, tripName, amount, method: 'Bakong KHQR (Manual Verification)' } 
        });
      } else {
        alert(data.message || "Payment records are still matching pending cycles. Please authorize with your banking app or scan the code again.");
      }
    } catch (err) {
      console.error("Manual Validation System Error:", err);
      alert("Verification server connection timed out. Please try again.");
    } finally {
      setIsVerifyingManually(false);
    }
  };

  const stopBakongPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const stopCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // 1. If it's Bakong, bypass standard form actions (handled independently by sockets/polling buttons)
    if (paymentMethod === 'bakong') return; 

    // 2. MOCK VISA / CARD PAYMENT FLOW Interceptor
    if (paymentMethod === 'card') {
      setIsProcessing(true);
      
      // Simulate fake network latency before advancing to success window
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/booking-success', { 
          state: { 
            bookingId, 
            tripName, 
            amount, 
            method: 'Visa / Credit Card (Mock)' 
          } 
        });
      }, 1500);
      
      return; // Absolute exit to avoid triggering real live endpoints
    }

    // 3. LIVE FALLBACK FLOWS (e.g. Production configurations / Custom systems)
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${API_BASE_URL}/api/bookings/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ bookingId: bookingId, paymentMethod: paymentMethod }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/booking-success', { 
          state: { bookingId, tripName, amount, method: paymentMethod } 
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
            <Loader2 className="spinner-icon animate-spin" size={48} />
            <h3>Processing Secure Payment</h3>
            <p>Verifying your transaction and updating your booking status...</p>
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
                  <CreditCard size={18} /> <span>Cards</span>
                </button>
                <button 
                  type="button"
                  className={`tab-btn ${paymentMethod === 'bakong' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('bakong')}
                  disabled={isProcessing}
                >
                  <Smartphone size={18} /> <span>Bakong KHQR</span>
                </button>
                <button 
                  type="button"
                  className={`tab-btn ${paymentMethod === 'ewallet' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('ewallet')}
                  disabled={isProcessing}
                >
                  <CheckCircle size={18} /> <span>E-Wallets</span>
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="checkout-form">
                
                {paymentMethod === 'card' && (
                  <div className="method-content fade-in">
                    <div className="vendor-logos">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" alt="Visa" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                    </div>
                    <div className="checkout-field">
                      <label><User size={14} /> Cardholder Name</label>
                      <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder="Name on card" required />
                    </div>
                    <div className="checkout-field">
                      <label><CreditCard size={14} /> Card Number</label>
                      <div className="input-rel">
                        <input type="text" name="cardNumber" onChange={handleInputChange} placeholder="0000 0000 0000 0000" required />
                        <Lock size={16} className="input-icon-right" />
                      </div>
                    </div>
                    <div className="checkout-row">
                      <div className="checkout-field">
                        <label><Calendar size={14} /> Expiration</label>
                        <input type="text" name="expiry" onChange={handleInputChange} placeholder="MM / YY" required />
                      </div>
                      <div className="checkout-field">
                        <label>CVC</label>
                        <input type="password" name="cvc" onChange={handleInputChange} placeholder="***" maxLength="3" required />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bakong' && (
                  <div className="method-content bakong-section fade-in">
                    <div className="qr-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {isLoadingBakongQr ? (
                        <div className="mock-qr-loading" style={{ padding: '40px 0', textAlign: 'center' }}>
                          <Loader2 className="spinner-small animate-spin" size={32} />
                          <p style={{ marginTop: '10px', fontSize: '13px', color: '#4b5563' }}>Generating KHQR Payload...</p>
                        </div>
                      ) : qrExpired ? (
                        <div className="qr-timeout-wrapper" style={{ padding: '24px 16px', background: '#fef2f2', border: '1px dashed #ef4444', borderRadius: '12px', textAlign: 'center', width: '100%', maxWidth: '280px' }}>
                          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 8px' }} />
                          <h4 style={{ color: '#991b1b', margin: '0 0 4px', fontSize: '15px', fontWeight: '600' }}>QR Code Expired</h4>
                          <p style={{ fontSize: '12px', color: '#7f1d1d', margin: '0 0 14px' }}>For security, this checkout session has timed out.</p>
                          <button type="button" onClick={fetchRealBakongQR} style={{ padding: '8px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)' }}>
                            Regenerate QR Code
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mock-qr">
                            {bakongQrString ? (
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bakongQrString)}`} alt="Official Bakong KHQR" />
                            ) : (
                              <p style={{ color: 'red' }}>Failed to render checkout QR code.</p>
                            )}
                          </div>
                          
                          <div className="timer-badge" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', background: '#fef2f2', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>Expires in: {timeLeft}</span>
                          </div>
                        </>
                      )}
                      
                      {!qrExpired && (
                        <p className="qr-instruction-text" style={{ fontWeight: '500', marginTop: '12px', fontSize: '13px', color: '#374151' }}>
                          {isLoadingBakongQr ? 'Please wait...' : 'Scan to pay with any Cambodian Bank app'}
                        </p>
                      )}
                    </div>
                    
                    <ul className="bakong-features" style={{ width: '100%', paddingLeft: '0', listStyle: 'none', marginTop: '16px' }}>
                      <li>• Instant KHQR payment synchronization</li>
                      <li>• Secure transactions via National Bank of Cambodia</li>
                      {!qrExpired && <li style={{ color: '#2563eb', fontWeight: '600' }}>• Waiting for your phone confirmation step...</li>}
                    </ul>

                    {/* MANUAL VERIFICATION INJECTED AS A ROBUST FAILSAFE TRIGGER */}
                    {!qrExpired && !isLoadingBakongQr && (
                      <button 
                        type="button"
                        onClick={handleManualBakongVerification}
                        disabled={isVerifyingManually}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', marginTop: '15px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        {isVerifyingManually ? (
                          <>
                            <Loader2 className="spinner-small animate-spin" size={16} />
                            <span>Querying National Bank Ledger...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={16} />
                            <span>Verify My Payment Manually</span>
                          </>
                        )}
                      </button>
                    )}
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

                {paymentMethod !== 'bakong' ? (
                  <button type="submit" className="payment-confirm-btn" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="spinner-small animate-spin" size={18} /> : `Pay $${amount?.toLocaleString()}`}
                  </button>
                ) : (
                  !qrExpired && (
                    <div className="bakong-polling-status-bar" style={{ textAlign: 'center', padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '13px', color: '#1e40af', fontWeight: '500', marginTop: '10px' }}>
                      ⚡ Monitoring your account for incoming transfers...
                    </div>
                  )
                )}
              </form>

              <div className="security-trust-badge">
                <ShieldCheck size={20} /> <span>Encrypted 256-bit SSL Connection</span>
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
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingCart, Heart, LogOut, Camera, Calendar, Phone, MapPin, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/account/myAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [imagePreview, setImagePreview] = useState(null);
  
  // States for Favourites
  const [myFavs, setMyFavs] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // --- Added: States for Bookings ---
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [formData, setFormData] = useState({
    dob: '',
    phone: '',
    address: ''
  });

  // 1. Load Profile Data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      const permanentKey = `profile_data_${parsedUser.email}`;
      const savedData = localStorage.getItem(permanentKey);
      
      if (savedData) {
        const mergedData = JSON.parse(savedData);
        setUser(mergedData);
        setImagePreview(mergedData.profilePic || null);
        setFormData({
          dob: mergedData.dob || '',
          phone: mergedData.phone || '',
          address: mergedData.address || ''
        });
      } else {
        setUser(parsedUser);
        if (parsedUser.profilePic) setImagePreview(parsedUser.profilePic);
        setFormData({
          dob: parsedUser.dob || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || ''
        });
      }
    }
  }, [navigate]);

  // 2. Load and Filter Favourites
  useEffect(() => {
    const loadFavourites = async () => {
      if (activeTab === 'favourites' && user) {
        setLoadingFavs(true);
        try {
          const res = await fetch('http://localhost:5000/api/destinations');
          const data = await res.json();
          setAllDestinations(data);

          const favKey = `fav_destinations_${user.email}`;
          const savedFavs = JSON.parse(localStorage.getItem(favKey) || '{}');
          const favIds = Object.keys(savedFavs).filter(id => savedFavs[id]);
          const filtered = data.filter(d => favIds.includes(d.id.toString()));
          setMyFavs(filtered);
        } catch (err) {
          console.error("Error loading favourites:", err);
        } finally {
          setLoadingFavs(false);
        }
      }
    };
    loadFavourites();
  }, [activeTab, user]);

  // --- 3. Added: Load Booking History ---
  useEffect(() => {
    const loadBookings = async () => {
      if (activeTab === 'bookings' && user) {
        setLoadingBookings(true);
        const token = localStorage.getItem('token');
        try {
          const res = await fetch('http://localhost:5000/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Filter bookings specifically for the logged-in user email
            const myBookings = data.filter(b => b.email === user.email);
            setBookings(myBookings);
          }
        } catch (err) {
          console.error("Error loading bookings:", err);
        } finally {
          setLoadingBookings(false);
        }
      }
    };
    loadBookings();
  }, [activeTab, user]);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData, profilePic: imagePreview };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    const permanentKey = `profile_data_${user.email}`;
    localStorage.setItem(permanentKey, JSON.stringify(updatedUser));
    alert("Profile information saved!");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="account-page">
        <div className="account-container">
          
          <aside className="account-sidebar">
            <h1 className="sidebar-title">My Account</h1>
            <nav className="sidebar-nav">
              <button className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
                <span className="icon-circle user-bg"><User size={20} /></span> My Personal Information
              </button>
              
              <button className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                <span className="icon-circle cart-bg"><ShoppingCart size={20} /></span> Booking History
              </button>
              
              <button className={`nav-item ${activeTab === 'favourites' ? 'active' : ''}`} onClick={() => setActiveTab('favourites')}>
                <span className="icon-circle heart-bg"><Heart size={20} /></span> My Favourites
              </button>
              
              <button className="nav-item logout-btn" onClick={handleLogout}>
                <span className="icon-circle logout-bg"><LogOut size={20} /></span> Log Out
              </button>
            </nav>
          </aside>

          <main className="account-main-content">
            {activeTab === 'personal' && (
              <div className="personal-info-card">
                <h2 className="section-title">My Personal Information</h2>
                <div className="profile-header">
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                  <div className="avatar-wrapper" onClick={handleImageClick}>
                    <div className="avatar-placeholder">
                      {imagePreview ? <img src={imagePreview} alt="Profile" className="profile-img-preview" /> : <div className="empty-avatar-init">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>}
                    </div>
                    <button className="camera-btn" type="button"><Camera size={16} /></button>
                  </div>
                  <div className="profile-summary">
                    <p><strong>Full Name:</strong> {user.name}</p>
                    <p><strong>Email Address:</strong> {user.email}</p>
                  </div>
                </div>

                <div className="details-section">
                  <h3 className="sub-title">Personal Details</h3>
                  <hr className="divider" />
                  <div className="details-grid">
                    <div className="details-meta">
                      <p>Optional to fill your personal details here to show more about you!</p>
                    </div>
                    <div className="details-form">
                      <div className="input-group">
                        <label>Your Date of Birth</label>
                        <div className="input-with-icon">
                          <input type="text" name="dob" placeholder="DD/MM/YYYY" value={formData.dob} onChange={handleInputChange} />
                          <Calendar className="input-icon" size={16} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Your Contact Number</label>
                        <div className="input-with-icon">
                          <input type="text" name="phone" placeholder="Contact number" value={formData.phone} onChange={handleInputChange} />
                          <Phone className="input-icon" size={16} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Your Current Address</label>
                        <div className="input-with-icon">
                          <input type="text" name="address" placeholder="Home address" value={formData.address} onChange={handleInputChange} />
                          <MapPin className="input-icon" size={16} />
                        </div>
                      </div>
                      <button className="save-btn" onClick={handleSave}>SAVE</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="personal-info-card">
                <h2 className="section-title">Booking History</h2>
                {loadingBookings ? (
                  <p>Loading your trips...</p>
                ) : bookings.length > 0 ? (
                  <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {bookings.map((booking) => (
                      <div key={booking.id} className="booking-item-card" style={{ border: '1px solid #eee', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ background: '#f0f7ff', padding: '10px', borderRadius: '10px', color: '#007bff' }}>
                            <Calendar size={24} />
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 5px 0' }}>Booking #{booking.id}</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Date: {new Date(booking.started_date).toLocaleDateString()}</p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#333', fontWeight: 'bold' }}>Total: ${booking.total_price}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '5px', 
                            padding: '5px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            background: booking.status === 'confirmed' ? '#e6f4ea' : '#fff4e5',
                            color: booking.status === 'confirmed' ? '#1e7e34' : '#b45d00'
                          }}>
                            {booking.status === 'confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <ShoppingCart size={48} className="empty-icon" />
                    <p>You haven't booked any trips yet.</p>
                    <button className="browse-btn" onClick={() => navigate('/trips')}>Explore Trips</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favourites' && (
              <div className="personal-info-card">
                <h2 className="section-title">My Favourites</h2>
                {loadingFavs ? (
                  <p>Loading your saved places...</p>
                ) : myFavs.length > 0 ? (
                  <div className="favs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {myFavs.map(item => (
                      <div key={item.id} className="fav-mini-card" style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', background: '#fff' }}>
                        <div style={{ height: '140px', backgroundImage: `url(/src/assets/destinations/${item.image_url}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ padding: '15px' }}>
                          <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                            <MapPin size={12} style={{ marginRight: '4px' }} /> {item.location}
                          </div>
                          <button onClick={() => navigate('/destinations')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', borderRadius: '8px', border: '1px solid #007bff', background: 'transparent', color: '#007bff', cursor: 'pointer' }}>
                            View Details <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Heart size={48} className="empty-icon" />
                    <p>Your wishlist is currently empty.</p>
                    <button className="browse-btn" onClick={() => navigate('/destinations')}>Find Places to Love</button>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAccount;
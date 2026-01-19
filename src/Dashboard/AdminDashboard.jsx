import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, ShoppingCart, MapPin,
  Users, Eye, DollarSign, Search, X, Trash2, Camera, Edit,
  ChevronLeft, ChevronRight, Image as ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import '../styles/dashboard/admin.css';
import '../styles/dashboard/pagination.css';
import '../styles/dashboard/adminpages.css';

import Sidebar from '../components/Sidebar';
import Messages from './pages/Messages';
import Reviews from './pages/Reviews';
import PromoCodes from './pages/PromoCodes';
import ModalMessage from '../components/ModalMessage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openMenus, setOpenMenus] = useState({ tour: true, user: false, marketing: false });
  const [adminUser, setAdminUser] = useState(null);
  
  const [bookingFilter, setBookingFilter] = useState('Week'); 
  const [chartData, setChartData] = useState({ views: [], bookingsTimeline: [] });
  
  const [stats, setStats] = useState({ users: 0, bookings: 0, destinations: 0, profit: 0 });
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  // --- PAGINATION STATES ---
  const [currentPageBookings, setCurrentPageBookings] = useState(1);
  const [currentPageDestinations, setCurrentPageDestinations] = useState(1);
  const [currentPageTrips, setCurrentPageTrips] = useState(1);
  const itemsPerPage = 5;

  // Detail Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailType, setDetailType] = useState('');

  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '', duration: '', difficulty_type: '', location: '', price: '', description: '', num_people: '', destination_type: ''
  });

  const [bookingFormData, setBookingFormData] = useState({
    trip_id: '', full_name: '', email: '', contact_phone: '', num_people: '', started_date: '', special_requests: '', status: 'pending'
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setAdminUser(userData);

    const fetchAllAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        const [statsRes, bookingRes, destRes, tripRes, userRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/admin-stats', { headers }),
          fetch('http://localhost:5000/api/bookings', { headers }), 
          fetch('http://localhost:5000/api/destinations', { headers }),
          fetch('http://localhost:5000/api/trips', { headers }),
          fetch('http://localhost:5000/api/users/all-users', { headers }) 
        ]);

        const sData = await statsRes.json();
        const bData = await bookingRes.json();
        const dData = await destRes.json();
        const tData = await tripRes.json();
        const uData = await userRes.json();

        const processBookingTimeline = (allBookings, filter) => {
          const counts = {};
          allBookings.forEach(b => {
            const date = new Date(b.booked_at || b.created_at);
            let label;
            if (filter === 'Day') label = date.toLocaleTimeString([], { hour: '2-digit' });
            else if (filter === 'Month') label = date.toLocaleString('default', { month: 'short' });
            else label = date.toLocaleDateString([], { weekday: 'short' });
            counts[label] = (counts[label] || 0) + 1;
          });
          return Object.keys(counts).map(key => ({ day: key, sales: counts[key] }));
        };

        setChartData({ 
          views: sData.revenueData ? sData.revenueData.map(item => ({
            name: item.name,
            uniqueViews: item.views || 0
          })) : [], 
          bookingsTimeline: processBookingTimeline(Array.isArray(bData) ? bData : [], bookingFilter)
        });

        setStats({
            users: sData.totals.users,
            destinations: sData.totals.destinations,
            profit: sData.totals.profit,
            bookings: sData.totals.bookings || 0,
            totalViews: sData.totals.totalViews || 0 
        });

        setBookings(Array.isArray(bData) ? bData : []); 
        setDestinations(Array.isArray(dData) ? dData : []);
        setTrips(Array.isArray(tData) ? tData : []);
        setUsers(Array.isArray(uData) ? uData : []);
      } catch (err) { console.error("Dashboard Load Error:", err); } finally { setLoading(false); }
    };
    fetchAllAdminData();
  }, [activeTab, bookingFilter]);

  // --- REUSABLE PAGINATION COMPONENT ---
  const PaginationControls = ({ current, total, onPageChange }) => {
    const totalPages = Math.ceil(total / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-wrapper">
        <span>
          Showing {((current - 1) * itemsPerPage) + 1} to {Math.min(current * itemsPerPage, total)} of {total} entries
        </span>
        <div className="pagination-btn">
          <button 
            disabled={current === 1}
            onClick={() => onPageChange(current - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            disabled={current === totalPages}
            onClick={() => onPageChange(current + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRowClick = (item, type) => {
    setSelectedItem(item);
    setDetailType(type);
    setShowDetailModal(true);
  };

  const handleEditOpen = (e, item, type) => {
    e.stopPropagation(); 
    setIsEditing(true);
    setEditId(item.id);
    if (type === 'booking') {
      setBookingFormData({
        trip_id: item.trip_id,
        full_name: item.full_name,
        email: item.email,
        contact_phone: item.contact_phone,
        num_people: item.num_people,
        special_requests: item.special_requests,
        started_date: item.started_date ? item.started_date.split('T')[0] : '',
        status: item.status || 'pending'
      });
      setShowBookingModal(true);
    } else {
      setFormData({
        name: item.name,
        duration: item.duration,
        difficulty_type: item.difficulty_type,
        location: item.location,
        price: item.price || '',
        description: item.description,
        num_people: item.num_people || item.number_of_people,
        destination_type: item.destination_type || ''
      });
      setImagePreview(item.image ? `http://localhost:5000/${item.image}` : null);
      setShowAddModal(true);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'destinations' ? 'destinations' : 'trips';
    const data = new FormData();
    if (imageFile) data.append('image', imageFile);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const url = isEditing ? `http://localhost:5000/api/${endpoint}/${editId}` : `http://localhost:5000/api/${endpoint}`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if(res.ok) { 
        setShowAddModal(false); 
        setIsEditing(false);
        setModal({
          open: true,
          title: 'Success',
          message: isEditing ? 'Saved successfully!' : 'Created successfully!',
          type: 'success',
          showConfirm: true,
          onConfirm: () => setModal({ ...modal, open: false })
        });
        window.location.reload(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const selectedTrip = trips.find(t => t.id === parseInt(bookingFormData.trip_id));
    const totalPrice = selectedTrip ? selectedTrip.price * bookingFormData.num_people : 0;

    const payload = {
      trip_id: parseInt(bookingFormData.trip_id),
      full_name: bookingFormData.full_name,
      email: bookingFormData.email,
      contact_phone: bookingFormData.contact_phone,
      num_people: parseInt(bookingFormData.num_people),
      started_date: bookingFormData.started_date,
      total_price: totalPrice,
      status: bookingFormData.status,
      special_requests: bookingFormData.special_requests
    };

    try {
      const url = isEditing ? `http://localhost:5000/api/bookings/${editId}` : 'http://localhost:5000/api/bookings';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, { 
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        setShowBookingModal(false);
        setIsEditing(false);
        setModal({
          open: true,
          title: 'Success',
          message: isEditing ? 'Booking updated successfully!' : 'Booking created successfully!',
          type: 'success',
          showConfirm: true,
          onConfirm: () => setModal({ ...modal, open: false })
        });
        window.location.reload();
      }
    } catch (err) { console.error(err); }
  };
  
  const updateBookingStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) window.location.reload();
    } catch (err) { console.error(err); }
  };

  const handleDelete = (e, id, type) => {
    if (e) e.stopPropagation();

    setModal({
      open: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this record? This cannot be undone.',
      type: 'info',
      onConfirm: async () => {
        const token = localStorage.getItem('token');
        let endpoint = type || activeTab;
        if (endpoint === 'accounts') endpoint = 'users';

        try {
          const res = await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();

          if (res.ok) {
            if (endpoint === 'bookings') setBookings(prev => prev.filter(item => item.id !== id));
            if (endpoint === 'destinations') setDestinations(prev => prev.filter(item => item.id !== id));
            if (endpoint === 'trips') setTrips(prev => prev.filter(item => item.id !== id));
            if (endpoint === 'users') setUsers(prev => prev.filter(item => item.id !== id));

            setModal({
              open: true,
              title: 'Deleted',
              message: 'Record deleted successfully!',
              type: 'success',
              showConfirm: true,
              onConfirm: () => setModal({ ...modal, open: false })
            });
          } else {
            setModal({
              open: true,
              title: 'Error',
              message: data.message || 'Could not delete item',
              type: 'error',
              showConfirm: true,
              onConfirm: () => setModal({ ...modal, open: false })
            });
          }
        } catch (err) {
          console.error(err);
          setModal({
            open: true,
            title: 'Server Error',
            message: 'Failed to delete record.',
            type: 'error',
            showConfirm: true,
            onConfirm: () => setModal({ ...modal, open: false })
          });
        }
      }
    });
  };

  const createPromoCode = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/api/promocodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create promo code');
      }

      const newPromo = await res.json();

      setPromoCodes(prev => [newPromo, ...prev]);
    } catch (error) {
      console.error('Create promo code error:', error);
      alert('Could not create promo code');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : "A";

  const DestinationTable = ({ data }) => {
    const currentData = data.slice((currentPageDestinations - 1) * itemsPerPage, currentPageDestinations * itemsPerPage);
    return (
      <div className="table-responsive">
        <table className="admin-data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Location</th><th>Type</th><th>Duration</th><th>Difficulty</th><th>Action</th></tr>
          </thead>
          <tbody>
            {currentData.map(item => (
              <tr key={item.id} onClick={() => handleRowClick(item, 'destination')} style={{cursor: 'pointer'}}>
                <td>#{item.id}</td><td>{item.name}</td>
                <td>{item.location}</td><td>{item.destination_type || 'N/A'}</td><td>{item.duration}</td>
                <td>{item.difficulty_type}</td>
                <td className="action-cell">
                  <button className="btn-edit-icon" onClick={(e) => handleEditOpen(e, item, 'dest')}><Edit size={18} /></button>
                  <button className="btn-delete-icon" onClick={(e) => handleDelete(e, item.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls current={currentPageDestinations} total={data.length} onPageChange={setCurrentPageDestinations} />
      </div>
    );
  };

  const TripTable = ({ data }) => {
    const currentData = data.slice((currentPageTrips - 1) * itemsPerPage, currentPageTrips * itemsPerPage);
    return (
      <div className="table-responsive">
        <table className="admin-data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Duration</th><th>Difficulty</th><th>Location</th><th>Price</th><th>People</th><th>Action</th></tr>
          </thead>
          <tbody>
            {currentData.map(item => (
              <tr key={item.id} onClick={() => handleRowClick(item, 'trip')} style={{cursor: 'pointer'}}>
                <td>#{item.id}</td><td>{item.name}</td><td>{item.duration}</td><td>{item.difficulty_type}</td>
                <td>{item.location}</td><td>${item.price}</td><td>{item.num_people || item.number_of_people}</td>
                <td className="action-cell">
                  <button className="btn-edit-icon" onClick={(e) => handleEditOpen(e, item, 'trip')}><Edit size={18} /></button>
                  <button className="btn-delete-icon" onClick={(e) => handleDelete(e, item.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls current={currentPageTrips} total={data.length} onPageChange={setCurrentPageTrips} />
      </div>
    );
  };

  const UserAccountTable = ({ data }) => (
    <div className="table-responsive">
      <table className="admin-data-table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {data.map(u => (
            <tr key={u.id}>
              <td>#{u.id}</td><td>{u.name}</td><td>{u.email}</td>
              <td><span className="status-badge confirmed">{u.role}</span></td>
              <td><button className="btn-delete-icon" onClick={(e) => handleDelete(e, u.id, 'accounts')}><Trash2 size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const PasswordTable = ({ data }) => (
    <div className="table-responsive">
      <table className="admin-data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Password Hash</th><th>Status</th></tr></thead>
        <tbody>
          {data.map(u => (
            <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td style={{fontFamily:'monospace'}}>...............</td><td><span className="status-badge confirmed">Encrypted</span></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMenus={openMenus}
        setOpenMenus={setOpenMenus}
        stats={stats}
        handleLogout={handleLogout}
      />

      <main className="admin-main">
        <header className="admin-top-nav">
          <div className="nav-profile-area">
            <span className="admin-name-label">{adminUser?.name || 'Admin'}</span>
            <div className="profile-circle">{getInitials(adminUser?.name)}</div>
          </div>
        </header>

        <div className="admin-body">
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card card-blue">
                <div className="card-icon"><Eye size={22}/></div>
                <div className="card-info">
                    <span className="count">
                    {stats.totalViews >= 1000 
                        ? `${(stats.totalViews / 1000).toFixed(1)}k` 
                        : stats.totalViews || 0}
                    </span>
                    <span className="label">Total View</span>
                </div>
                </div>
                <div className="stat-card card-green"><div className="card-icon"><ShoppingCart size={22}/></div><div className="card-info"><span className="count">{stats.bookings}</span><span className="label">Total Booking</span></div></div>
                <div className="stat-card card-purple"><div className="card-icon"><Users size={22}/></div><div className="card-info"><span className="count">{stats.users}</span><span className="label">Total User</span></div></div>
                <div className="stat-card card-yellow"><div className="card-icon"><MapPin size={22}/></div><div className="card-info"><span className="count">{stats.destinations}</span><span className="label">Total Destinations</span></div></div>
                <div className="stat-card card-orange"><div className="card-icon"><DollarSign size={22}/></div><div className="card-info"><span className="count">${Number(stats.profit).toLocaleString()}</span><span className="label">Total Profit</span></div></div>
              </div>

              <div className="charts-flex">
                <div className="chart-container main-chart">
                  <div className="chart-header">
                    <h3>Unique Website Visitors</h3>
                    <div className="legend-dots">
                      <span className="dot blue"></span> Traffic Growth
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={chartData.views} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="uniqueViewGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#64748b', fontSize: 12}}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#64748b', fontSize: 12}}
                        />
                        <Tooltip 
                          cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '10px' }}
                        />
                        <Area 
                          type="stepAfter"
                          dataKey="uniqueViews" 
                          stroke="#6366f1" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#uniqueViewGradient)" 
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-container side-chart">
                  <div className="chart-header">
                    <h3>Conversion rate</h3>
                    <div className="time-filters">
                      {['Day', 'Week', 'Month'].map((filter) => (
                        <span 
                          key={filter} 
                          className={bookingFilter === filter ? 'active' : ''} 
                          onClick={() => setBookingFilter(filter)} 
                          style={{cursor: 'pointer', padding: '4px 8px', borderRadius: '4px'}}
                        >
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData.bookingsTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11}}
                      />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                      <Bar 
                        dataKey="sales" 
                        fill="#8b5cf6" 
                        radius={[4, 4, 0, 0]} 
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bookings' && (
            <div className="admin-content-header-area">
              <div className="breadcrumb">User Booking &gt; List</div>
              <div className="content-title-row"><h2>User Booking</h2><button className="btn-primary-blue" onClick={() => {setIsEditing(false); setShowBookingModal(true);}}>New Booking</button></div>
              <div className="data-card">
                <div className="table-controls"><div className="search-wrapper"><Search size={16} className="search-icon" /><input type="text" placeholder="Search" /></div></div>
                <div className="table-body-content">
                  {bookings.length === 0 ? (
                    <div className="no-data-state"><div className="empty-icon-circle"><X size={24} /></div><p>No Booking yet</p></div>
                  ) : (
                    <div className="table-responsive">
                      <table className="admin-data-table">
                        <thead><tr><th>ID</th><th>Customer</th><th>Trip ID</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>{bookings.map(b => (
                          <tr key={b.id} onClick={() => handleRowClick(b, 'booking')} style={{cursor: 'pointer'}}>
                            <td>#{b.id}</td><td>{b.full_name}</td><td>{b.trip_id}</td><td>${Number(b.total_price).toLocaleString()}</td><td>{new Date(b.booked_at || b.created_at).toLocaleDateString()}</td>
                            <td><span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                            <td className="action-cell">
                              <button className="btn-edit-icon" onClick={(e) => handleEditOpen(e, b, 'booking')}><Edit size={18} /></button>
                              <button className="btn-delete-icon" onClick={(e) => handleDelete(e, b.id, 'bookings')}><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))}</tbody>
                      </table>
                      <PaginationControls 
                        current={currentPageBookings} 
                        total={bookings.length} 
                        onPageChange={setCurrentPageBookings} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="admin-content-header-area">
              <div className="breadcrumb">User Information &gt; User Accounts</div>
              <div className="content-title-row"><h2>User Accounts</h2></div>
              <div className="data-card"><UserAccountTable data={users} /></div>
            </div>
          )}

          {activeTab === 'passwords' && (
            <div className="admin-content-header-area">
              <div className="breadcrumb">User Information &gt; Passwords</div>
              <div className="content-title-row"><h2>Security</h2></div>
              <div className="data-card"><PasswordTable data={users} /></div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="admin-content-header-area">
              <div className="breadcrumb">Tour Places &gt; Destinations</div>
              <div className="content-title-row"><h2>Destinations</h2><button className="btn-primary" onClick={() => {setIsEditing(false); setShowAddModal(true);}}>Add New</button></div>
              <div className="data-card"><DestinationTable data={destinations} /></div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="admin-content-header-area">
              <div className="breadcrumb">Tour Places &gt; Trips</div>
              <div className="content-title-row"><h2>Destinations Trip</h2><button className="btn-primary" onClick={() => {setIsEditing(false); setShowAddModal(true);}}>Add New</button></div>
              <div className="data-card"><TripTable data={trips} /></div>
            </div>
          )}

          {activeTab === 'messages' && (
            <Messages
              messages={messages}
              onDelete={id => handleDelete(null, id, 'messages')}
            />
          )}

          {activeTab === 'reviews' && (
            <Reviews
              reviews={reviews}
              onApprove={id => updateReviewStatus(id)}
              onDelete={id => handleDelete(null, id, 'reviews')}
            />
          )}

          {activeTab === 'coupons' && (
            <PromoCodes
              promoCodes={promoCodes}
              onCreate={createPromoCode}
              onDelete={id => handleDelete(null, id, 'promocodes')}
            />
          )}
        </div>
      </main>

      {showDetailModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '700px', padding: '0', overflow: 'hidden' }}>
            
            <div style={{ 
              background: detailType === 'booking' ? '#7c7cfc' : '#1e1e26', 
              padding: '30px', 
              color: 'white',
              position: 'relative'
            }}>
              <X 
                className="close-icon" 
                onClick={() => setShowDetailModal(false)} 
                style={{ position: 'absolute', top: '20px', right: '20px', color: 'rgba(255,255,255,0.7)' }} 
              />
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '5px' }}>
                System Record #{selectedItem.id}
              </p>
              <h2 style={{ margin: 0, fontSize: '24px' }}>
                {detailType === 'booking' ? `Booking: ${selectedItem.full_name}` : selectedItem.name}
              </h2>
            </div>

            <div style={{ padding: '30px' }}>
              {detailType === 'booking' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Customer Email</label>
                      <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500 }}>{selectedItem.email}</span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Contact Phone</label>
                      <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500 }}>{selectedItem.contact_phone}</span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Booking Date</label>
                      <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500 }}>{new Date(selectedItem.booked_at || selectedItem.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Total Payment</label>
                      <span style={{ fontSize: '20px', color: '#10b981', fontWeight: 700 }}>${Number(selectedItem.total_price).toLocaleString()}</span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Status</label>
                      <span className={`status-badge ${selectedItem.status?.toLowerCase()}`}>{selectedItem.status}</span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Travelers</label>
                      <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500 }}>{selectedItem.num_people} Persons</span>
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Special Instructions</label>
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>{selectedItem.special_requests || 'No special requirements provided by the customer.'}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
                  <div style={{ width: '250px' }}>
                    {selectedItem.image ? (
                      <img 
                        src={`http://localhost:5000/${selectedItem.image}`} 
                        alt="Preview" 
                        style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '250px', background: '#f1f5f9', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Location</label>
                        <span style={{ fontWeight: 600 }}>{selectedItem.location}</span>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Duration</label>
                        <span style={{ fontWeight: 600 }}>{selectedItem.duration}</span>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Difficulty</label>
                        <span className={`diff-tag ${selectedItem.difficulty_type?.toLowerCase()}`}>{selectedItem.difficulty_type}</span>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{detailType === 'trip' ? 'Price' : 'Type'}</label>
                        <span style={{ fontWeight: 600, color: detailType === 'trip' ? '#7c7cfc' : 'inherit' }}>
                          {detailType === 'trip' ? `$${selectedItem.price}` : (selectedItem.destination_type || 'N/A')}
                        </span>
                      </div>
                    </div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Full Description</label>
                    <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '14px', color: '#64748b', lineHeight: '1.6', paddingRight: '10px' }}>
                      {selectedItem.description}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ padding: '20px 30px', background: '#f8fafc' }}>
              <button className="btn-cancel" style={{ background: '#fff', border: '1px solid #e2e8f0' }} onClick={() => setShowDetailModal(false)}>Close</button>
              <button className="btn-save" onClick={(e) => { setShowDetailModal(false); handleEditOpen(e, selectedItem, detailType === 'destination' ? 'dest' : detailType); }}>
                Edit Record
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit' : 'Add New'} {activeTab === 'destinations' ? 'Destination' : 'Trip'}</h3>
              <X className="close-icon" onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={handleAdd} className="admin-modal-form">
              <div className="image-upload-wrapper" style={{marginBottom: '20px', textAlign: 'center'}}>
                <div className="image-dropzone" onClick={() => fileInputRef.current.click()} style={{border: '2px dashed #ccc', padding: '20px', borderRadius: '10px', cursor: 'pointer'}}>
                  {imagePreview ? <img src={imagePreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px'}} /> : <div style={{color: '#666'}}><Camera size={30} /><p>Click to upload image</p></div>}
                </div>
                <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
              </div>
              <div className="form-grid">
                <input type="text" value={formData.name} placeholder="Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="text" value={formData.duration} placeholder="Duration" required onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                <input type="text" value={formData.difficulty_type} placeholder="Difficulty Type" required onChange={(e) => setFormData({...formData, difficulty_type: e.target.value})} />
                <input type="text" value={formData.location} placeholder="Location" required onChange={(e) => setFormData({...formData, location: e.target.value})} />
                {activeTab === 'destinations' ? <input type="text" value={formData.destination_type} placeholder="Destination Type" required onChange={(e) => setFormData({...formData, destination_type: e.target.value})} /> : <input type="number" value={formData.price} placeholder="Price" required onChange={(e) => setFormData({...formData, price: e.target.value})} />}
                <input type="number" value={formData.num_people} placeholder="Number of People" required onChange={(e) => setFormData({...formData, num_people: e.target.value})} />
                <textarea value={formData.description} placeholder="Description" style={{gridColumn: 'span 2'}} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="modal-footer"><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Booking' : 'New Manual Booking'}</h3>
              <X className="close-icon" onClick={() => setShowBookingModal(false)} />
            </div>
            <form onSubmit={handleBookingSubmit} className="admin-modal-form">
              <div className="form-grid">
                <select value={bookingFormData.trip_id} required onChange={(e) => setBookingFormData({...bookingFormData, trip_id: e.target.value})}>
                  <option value="">Select Trip</option>
                  {trips.map(t => <option key={t.id} value={t.id}>{t.name} (${t.price})</option>)}
                </select>
                <input type="text" value={bookingFormData.full_name} placeholder="Full Name" required onChange={(e) => setBookingFormData({...bookingFormData, full_name: e.target.value})} />
                <input type="email" value={bookingFormData.email} placeholder="Email Address" required onChange={(e) => setBookingFormData({...bookingFormData, email: e.target.value})} />
                <input type="text" value={bookingFormData.contact_phone} placeholder="Phone Number" required onChange={(e) => setBookingFormData({...bookingFormData, contact_phone: e.target.value})} />
                <input type="number" value={bookingFormData.num_people} placeholder="Number of Travellers" required min="1" onChange={(e) => setBookingFormData({...bookingFormData, num_people: e.target.value})} />
                <input type="date" value={bookingFormData.started_date} placeholder="Preferred Start Date" required onChange={(e) => setBookingFormData({...bookingFormData, started_date: e.target.value})} />
                {isEditing && (
                  <select value={bookingFormData.status} onChange={(e) => setBookingFormData({...bookingFormData, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
                <textarea value={bookingFormData.special_requests} placeholder="Special Requests" style={{gridColumn: 'span 2'}} onChange={(e) => setBookingFormData({...bookingFormData, special_requests: e.target.value})}></textarea>
              </div>
              <div className="modal-footer"><button type="submit" className="btn-primary">{isEditing ? 'Update Booking' : 'Create Booking'}</button></div>
            </form>
          </div>
        </div>
      )}

      <ModalMessage 
        open={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, open: false })}
        onConfirm={modal.onConfirm}
      />

    </div>
  );
};

export default AdminDashboard;
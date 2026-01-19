import React from 'react';
import {
  LayoutDashboard, ShoppingCart, MapPin, Map,
  Users, Key, ChevronDown, MessageSquare,
  Star, Ticket, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
  activeTab,
  setActiveTab,
  openMenus,
  setOpenMenus,
  stats,
  handleLogout
}) => {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <img src="/src/assets/logo/morodok-logo.png" alt="Logo" />
        <span>Morodok Eco</span>
      </div>

      <nav className="admin-nav">
        <div
          className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} /> <span>Dashboard</span>
        </div>

        <div
          className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <ShoppingCart size={20} />
          <span>User Booking</span>
          <span className="badge">{stats.bookings}</span>
        </div>

        <div
          className={`menu-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={20} /> 
          <span>Messages</span>
        </div>

        <div
          className="menu-section-header"
          onClick={() =>
            setOpenMenus({ ...openMenus, tour: !openMenus.tour })
          }
        >
          <span>Tour Places</span>
          <ChevronDown size={14} className={!openMenus.tour ? 'rotate' : ''} />
        </div>

        {openMenus.tour && (
          <div className="submenu">
            <div
              className={`menu-item ${activeTab === 'destinations' ? 'active' : ''}`}
              onClick={() => setActiveTab('destinations')}
            >
              <MapPin size={18} /> Destinations
            </div>

            <div
              className={`menu-item ${activeTab === 'trips' ? 'active' : ''}`}
              onClick={() => setActiveTab('trips')}
            >
              <Map size={18} /> Destinations Trip
            </div>
          </div>
        )}

        <div
          className="menu-section-header"
          onClick={() =>
            setOpenMenus({ ...openMenus, user: !openMenus.user })
          }
        >
          <span>User Information</span>
          <ChevronDown size={14} className={!openMenus.user ? 'rotate' : ''} />
        </div>

        {openMenus.user && (
          <div className="submenu">
            <div
              className={`menu-item ${activeTab === 'accounts' ? 'active' : ''}`}
              onClick={() => setActiveTab('accounts')}
            >
              <Users size={18} /> User Accounts
            </div>

            <div
              className={`menu-item ${activeTab === 'passwords' ? 'active' : ''}`}
              onClick={() => setActiveTab('passwords')}
            >
              <Key size={18} /> Passwords
            </div>
          </div>
        )}

        <div
          className="menu-section-header"
          onClick={() =>
            setOpenMenus({ ...openMenus, marketing: !openMenus.marketing })
          }
        >
          <span>Marketing</span>
          <ChevronDown size={14} className={!openMenus.marketing ? 'rotate' : ''} />
        </div>

        {openMenus.marketing && (
          <div className="submenu">
            <div
              className={`menu-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <Star size={18} /> Reviews
            </div>

            <div
              className={`menu-item ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <Ticket size={18} /> Promo Codes
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          <div
            className="menu-item logout-btn"
            onClick={handleLogout}
            style={{ color: '#fb7185' }}
          >
            <LogOut size={20} /> <span>Logout</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
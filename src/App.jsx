import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Destinations from './pages/Destinations';
import DestinationsDetails from './pages/DestinationsDetails';
import PlanTrips from './pages/PlanTrips';
import TravelGuide from './pages/TravelGuide';
import Sustainability from './pages/Sustainability';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TripDetails from './pages/TripDetails';

import MyAccount from './pages/MyAccount';

import AdminDashboard from './Dashboard/AdminDashboard';

import Payment from './Payment/Payment';
import BookingSuccess from './Payment/BookingSuccess';

const AdminRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationsDetails />} />
        <Route path="/trips" element={<PlanTrips />} />
        <Route path="/guide" element={<TravelGuide />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path='/account' element={< MyAccount/>} />

        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import Home from './components/Home';
import SearchEvents from './components/SearchEvents';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import PaymentSuccess from './components/PaymentSuccess';
import FeedbackForm from './components/FeedbackForm';
import './output.css';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  // Not logged in -> Boot to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role permissions -> Boot back to public home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized -> Render page safely
  return children;
};

// ==========================================
// 2. MAIN APPLICATION ROUTING TABLE
// ==========================================
function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          {/* === PUBLIC ROUTES === */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/search" element={<SearchEvents />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* === ATTENDEE PROTECTED ROUTES === */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['attendee']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Unified Feedback handlers: Accommodates both general form browsing & item deep-links */}
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute allowedRoles={['attendee']}>
                <FeedbackForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feedback/:eventId" 
            element={
              <ProtectedRoute allowedRoles={['attendee']}>
                <FeedbackForm />
              </ProtectedRoute>
            } 
          />

          {/* === ORGANIZER / ADMIN PROTECTED ROUTES === */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* === FALLBACK CATCH-ALL === */}
          {/* If a user enters a completely random URL, send them back to Home safely */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
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

// ==========================================
// 1. ROBUST PROTECTED ROUTE INTERCEPTOR
// ==========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let user = null;

  try {
    const savedUser = localStorage.getItem('user');
    // Guard against stringified "undefined" or empty states
    user = savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Failed to parse user session metadata:", error);
    user = null;
  }

  // Not logged in -> Boot cleanly to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but lacks role permissions -> Boot back to public home
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
      {/* Structural Semantic Landmark Fix */}
      <main className="p-4">
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import OrganizerDashboard from './components/OrganizerDashboard';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import './output.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
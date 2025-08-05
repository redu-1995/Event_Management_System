import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/search" element={<SearchEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/feedback/:eventId" element={<FeedbackForm />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
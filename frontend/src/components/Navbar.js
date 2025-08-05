// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [authChanged, setAuthChanged] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    setAuthChanged(a => !a);
    navigate('/');
  };

  const renderNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Home</Link>
          <Link to="/events" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Browse Events</Link>
          <Link to="/search" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Search Events</Link>
          <Link to="/register" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Register</Link>
          <Link to="/login" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Login</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Home</Link>
        <Link to="/events" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Browse Events</Link>
        <Link to="/search" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Search Events</Link>
        {user.role === 'organizer' && (
          <Link to="/dashboard" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Dashboard</Link>
        )}
        {user.role === 'attendee' && (
          <Link to="/profile" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Profile</Link>
        )}
         {user.role === 'attendee' && (
          <Link to="/feedback/:eventId" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Feedback</Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition ml-2"
        >
          Logout
        </button>
      </>
    );
  };

  const renderMobileLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/events" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Browse Events</Link>
          <Link to="/search" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Search Events</Link>
          <Link to="/register" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Register</Link>
          <Link to="/login" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Login</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/events" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Browse Events</Link>
        <Link to="/search" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Search Events</Link>
        {user.role === 'organizer' && (
          <Link to="/dashboard" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
        )}
        {user.role === 'attendee' && (
          <Link to="/profile" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Profile</Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition mt-2"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl text-blue-700">🎟️</span>
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight">EventManager</span>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex md:items-center md:space-x-6 text-sm font-semibold">
          {renderNavLinks()}
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none text-blue-700"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Mobile Links */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-2 text-base font-semibold text-blue-700 bg-white rounded shadow-lg px-6 py-4">
          {renderMobileLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

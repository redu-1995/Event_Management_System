// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          🅴 {/* Replace this emoji with an actual logo if you have one */}
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/browse" className="hover:text-blue-600">Browse Events</Link>
          <Link to="/tickets" className="hover:text-blue-600">My Tickets</Link>
          <Link to="/login" className="hover:text-blue-600">Login / Register</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile / Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

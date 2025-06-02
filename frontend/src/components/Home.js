import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setProfileDropdown(false);
    };
    if (profileDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileDropdown]);

  const handleOrganizerDashboard = () => {
    setProfileDropdown(false);
    navigate('/organizer/dashboard');
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-3xl text-blue-700">🎟️</span>
            <span className="text-2xl font-extrabold text-blue-700 tracking-tight">EventManager</span>
          </div>
          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-6 text-sm font-semibold">
            <Link to="/" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Home</Link>
            <Link to="/events" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Browse Events</Link>
            <Link to="/tickets" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">My Tickets</Link>
            <Link to="/login" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Login</Link>
            <Link to="/register" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Register</Link>
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileDropdown((v) => !v)}
                className="flex items-center text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition focus:outline-none"
              >
                Profile <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-50 text-blue-700"
                    onClick={() => setProfileDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700"
                    onClick={handleOrganizerDashboard}
                  >
                    Organizer Dashboard
                  </button>
                </div>
              )}
            </div>
            <Link to="/create-event" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold shadow transition">+ Create Event</Link>
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
            <Link to="/" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/events" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Browse Events</Link>
            <Link to="/tickets" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>My Tickets</Link>
            <Link to="/login" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Register</Link>
            <Link to="/profile" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            <Link to="/create-event" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold shadow transition" onClick={() => setIsMenuOpen(false)}>+ Create Event</Link>
            {/* Organizer Dashboard Link - Mobile */}
            <button
              type="button"
              className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700"
              onClick={handleOrganizerDashboard}
            >
              Organizer Dashboard
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section with Background Image */}
      <section
        className="relative min-h-[90vh] bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center text-blue-900 text-center"
      >
        <div className="relative z-10 w-full max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-fade-slide-up">
            Discover Upcoming Events Near You
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md animate-fade-slide-up delay-200">
            From concerts to conferences – everything in one place.
          </p>
          {/* Search Bar */}
          <div className="bg-white rounded-full flex items-center shadow-lg overflow-hidden max-w-xl mx-auto animate-fade-slide-up delay-400">
            <input
              type="text"
              placeholder="🔍 Search by category or location"
              className="flex-grow px-6 py-3 text-gray-700 rounded-l-full focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-full transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center animate-fade-in-up">Upcoming Events</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="relative bg-white rounded-2xl shadow-lg border-t-4 border-blue-500 p-6 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
            >
              {/* Date Badge */}
              <span className="absolute top-0 right-0 mt-4 mr-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                25 May 2025
              </span>
              {/* Event Icon */}
              <div className="mb-4 text-4xl">🎫</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Event Title</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Name: Lorem Ipsum<br />
                Location: Addis Ababa
              </p>
              <button className="mt-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-5 py-2 rounded-full font-semibold shadow transition">
                Buy Ticket
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-12 bg-white animate-fade-in-up">
        <h2 className="text-2xl font-semibold text-center mb-6">Event Categories</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {/* Festivals */}
          <div className="group bg-gradient-to-br from-yellow-100 to-pink-100 p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300 cursor-pointer flex flex-col items-center">
            <span className="text-5xl mb-4 transition group-hover:scale-110">🎉</span>
            <h3 className="text-xl font-bold mb-2 text-pink-700">Festivals</h3>
            <p className="text-gray-600 text-sm">Experience vibrant festivals and cultural celebrations near you.</p>
          </div>
          {/* Theater */}
          <div className="group bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300 cursor-pointer flex flex-col items-center">
            <span className="text-5xl mb-4 transition group-hover:scale-110">🎭</span>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Theater</h3>
            <p className="text-gray-600 text-sm">Discover drama, comedy, and live performances in your city.</p>
          </div>
          {/* Concerts */}
          <div className="group bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300 cursor-pointer flex flex-col items-center">
            <span className="text-5xl mb-4 transition group-hover:scale-110">🎵</span>
            <h3 className="text-xl font-bold mb-2 text-green-700">Concerts</h3>
            <p className="text-gray-600 text-sm">Find live music events, gigs, and concerts for every taste.</p>
          </div>
        </div>
      </section>

      {/* Why Use the Platform */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100 text-center animate-fade-in-up">
        <h2 className="text-3xl font-extrabold mb-10 text-blue-800">Why Use the Platform?</h2>
        <div className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 border-t-4 border-blue-400">
            <span className="text-4xl mb-4">✅</span>
            <h3 className="font-bold text-lg mb-2 text-blue-700">Easy Booking</h3>
            <p className="text-gray-600 text-sm">Book your favorite events in just a few clicks with a seamless experience.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 border-t-4 border-green-400">
            <span className="text-4xl mb-4">🔐</span>
            <h3 className="font-bold text-lg mb-2 text-green-700">Secure Payments</h3>
            <p className="text-gray-600 text-sm">Your transactions are protected with industry-leading security.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 border-t-4 border-yellow-400">
            <span className="text-4xl mb-4">👥</span>
            <h3 className="font-bold text-lg mb-2 text-yellow-700">Trusted Organizers</h3>
            <p className="text-gray-600 text-sm">We partner only with verified and reputable event organizers.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 border-t-4 border-pink-400">
            <span className="text-4xl mb-4">⚡</span>
            <h3 className="font-bold text-lg mb-2 text-pink-700">Instant Confirmation</h3>
            <p className="text-gray-600 text-sm">Get your tickets and confirmation instantly after booking.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white pt-12 pb-6 mt-12 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-2xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 bg-blue-300 opacity-10 rounded-full blur-2xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 relative z-10">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-3xl">🎟️</span>
              <span className="text-xl font-extrabold tracking-tight">EventManager</span>
            </div>
            <p className="text-blue-100 text-sm">Your one-stop platform for discovering and booking the best events around you.</p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 text-blue-200">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline text-blue-100">Home</Link></li>
              <li><Link to="/events" className="hover:underline text-blue-100">Browse Events</Link></li>
              <li><Link to="/tickets" className="hover:underline text-blue-100">My Tickets</Link></li>
              <li><Link to="/create-event" className="hover:underline text-blue-100">Create Event</Link></li>
              <li><Link to="/login" className="hover:underline text-blue-100">Login</Link></li>
              <li><Link to="/register" className="hover:underline text-blue-100">Register</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-3 text-blue-200">Contact Us</h4>
            <ul className="text-sm text-blue-100 space-y-1">
              <li>Email: <a href="mailto:support@eventmanager.com" className="hover:underline">support@eventmanager.com</a></li>
              <li>Phone: <a href="tel:+251900000000" className="hover:underline">+251 900 000 000</a></li>
              <li>Addis Ababa, Ethiopia</li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-3 text-blue-200">Follow Us</h4>
            <div className="flex space-x-4 mt-2">
              {/* ...social icons as before... */}
            </div>
            <div className="mt-4 text-blue-100 text-xs">
              <p>Stay connected for updates and exclusive offers!</p>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-500 mt-8 pt-4 text-center text-xs text-blue-200">
          &copy; {new Date().getFullYear()} EventManager. All rights reserved. | 
          <span className="ml-2">Terms of Service</span> | 
          <span className="ml-2">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
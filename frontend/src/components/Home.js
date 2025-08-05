import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Navbar from './Navbar';
import BuyTicketModal from './BuyTicketModal';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [categoryEvents, setCategoryEvents] = useState({});
  const [authChanged, setAuthChanged] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    setAuthChanged(a => !a); // force re-render
    navigate('/');
  };

  // Get user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  // Helper: is event in the past?
  const isPastEvent = (event) => {
    if (!event?.date) return false;
    return new Date(event.date) < new Date().setHours(0,0,0,0);
  };

  // Fetch all events and categorize them
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events/');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setAllEvents(data);

        // Filter for upcoming events (today or future)
        const upcoming = data.filter(event => !isPastEvent(event));
        setUpcomingEvents(upcoming);

        // Group events by category
        const grouped = {};
        data.forEach(event => {
          const cat = event.category || 'Other';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(event);
        });
        setCategoryEvents(grouped);
      } catch (err) {
        setAllEvents([]);
        setUpcomingEvents([]);
        setCategoryEvents({});
      }
    };
    fetchEvents();
  }, [authChanged]);

  // Carousel auto-advance
  useEffect(() => {
    const eventsToShow = showAllEvents ? allEvents : upcomingEvents;
    if (eventsToShow.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % eventsToShow.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [upcomingEvents, allEvents, showAllEvents]);

  
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setProfileDropdown(false);
    };
    if (profileDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileDropdown]);


 const getCarouselEvents = () => {
  const eventsToShow = showAllEvents ? allEvents : upcomingEvents;
  if (eventsToShow.length === 0) return [];

  const visibleCount = Math.min(3, eventsToShow.length); 
  const events = [];

  for (let i = 0; i < visibleCount; i++) {
    events.push(eventsToShow[(carouselIndex + i) % eventsToShow.length]);
  }

  return events;
};


  // Navbar links logic (unchanged)
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
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition ml-2"
        >
          Logout
        </button>
      </>
    );
  };

  // Mobile nav links (unchanged)
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
    <div className="font-sans text-gray-800">
      <Navbar />
      {/* Hero Section */}
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
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${encodeURIComponent(searchInput)}`);
                }
              }}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-full transition"
              onClick={() => navigate(`/search?q=${encodeURIComponent(searchInput)}`)}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Toggle for Upcoming/All Events */}
      <div className="flex justify-center mt-8">
        <button
          className={`px-4 py-2 rounded-l-full font-semibold ${!showAllEvents ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
          onClick={() => { setShowAllEvents(false); setCarouselIndex(0); }}
        >
          Upcoming Events
        </button>
        <button
          className={`px-4 py-2 rounded-r-full font-semibold ${showAllEvents ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
          onClick={() => { setShowAllEvents(true); setCarouselIndex(0); }}
        >
          All Events
        </button>
      </div>

      {/* Events Carousel */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center animate-fade-in-up">
          {showAllEvents ? 'All Events' : 'Upcoming Events'}
        </h2>
        {(showAllEvents ? allEvents : upcomingEvents).length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">
            No {showAllEvents ? 'events' : 'upcoming events'} found.
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 mr-4"
                onClick={() => {
                  const eventsToShow = showAllEvents ? allEvents : upcomingEvents;
                  setCarouselIndex((prev) =>
                    prev === 0 ? eventsToShow.length - 1 : prev - 1
                  );
                }}
                aria-label="Previous Event"
              >
                &#8592;
              </button>
              <div className="flex-1 flex gap-6 justify-center">
                {getCarouselEvents().map((event, idx) => (
                  <div
                    key={event?.id || idx}
                    className="relative bg-white rounded-2xl shadow-lg border-t-4 border-blue-500 p-6 flex flex-col items-start transition-all duration-500 animate-fade-in-up min-h-[300px] w-80"
                  >
                    <span className="absolute top-0 right-0 mt-4 mr-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                      {event?.date ? new Date(event.date).toLocaleDateString() : 'No Date'}
                    </span>
                    <div className="mb-4 text-4xl">🎫</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-2">
                      {event?.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {event?.description}
                      <br />
                      <strong>Location:</strong> {event?.location}
                    </p>
                    <button
                      disabled={isPastEvent(event)}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowBuyModal(true);
                      }}
                      className="mt-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-5 py-2 rounded-full font-semibold shadow transition"
                    >
                      Buy Ticket
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 ml-4"
                onClick={() => {
                  const eventsToShow = showAllEvents ? allEvents : upcomingEvents;
                  setCarouselIndex((prev) =>
                    prev === eventsToShow.length - 1 ? 0 : prev + 1
                  );
                }}
                aria-label="Next Event"
              >
                &#8594;
              </button>
            </div>
            {/* Carousel indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {(showAllEvents ? allEvents : upcomingEvents).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${carouselIndex === idx ? 'bg-blue-600' : 'bg-blue-200'}`}
                  onClick={() => setCarouselIndex(idx)}
                  aria-label={`Go to event ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Categories with Events */}
      <section className="px-6 py-12 bg-white animate-fade-in-up">
        <h2 className="text-2xl font-semibold text-center mb-6">Event Categories</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {Object.keys(categoryEvents).length === 0 && (
            <div className="col-span-3 text-center text-gray-500">No categories found.</div>
          )}
          {Object.entries(categoryEvents).map(([category, events]) => {
           
            const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
 
            let icon = '🎫';
            if (category.toLowerCase().includes('festival')) icon = '🎉';
            else if (category.toLowerCase().includes('theater')) icon = '🎭';
            else if (category.toLowerCase().includes('concert')) icon = '🎵';
            else if (category.toLowerCase().includes('conference')) icon = '🏢';
            else if (category.toLowerCase().includes('workshop')) icon = '🛠️';
            else if (category.toLowerCase().includes('sports')) icon = '🏟️';
            else if (category.toLowerCase().includes('art')) icon = '🎨';
            else if (category.toLowerCase().includes('tech')) icon = '💻';
            else if (category.toLowerCase().includes('education')) icon = '🎓';
            else if (category.toLowerCase().includes('food')) icon = '🍽️';
            else if (category.toLowerCase().includes('charity')) icon = '🤝';
            else if (category.toLowerCase().includes('fashion')) icon = '👗';
            else if (category.toLowerCase().includes('networking')) icon = '🤝‍🧑';
            else if (category.toLowerCase().includes('business')) icon = '💼';
            else if (category.toLowerCase().includes('health')) icon = '🏥';
            else if (category.toLowerCase().includes('family')) icon = '👨‍👩‍👧‍👦';
            else if (category.toLowerCase().includes('religion')) icon = '⛪';
            else if (category.toLowerCase().includes('government')) icon = '🏛️';
            else if (category.toLowerCase().includes('community')) icon = '🌍';
            else if (category.toLowerCase().includes('other')) icon = '✨';

            return (
              <div
                key={category}
                className="group bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300 cursor-pointer flex flex-col items-center"
              >
                <span className="text-5xl mb-4 transition group-hover:scale-110">{icon}</span>
                <h3 className="text-xl font-bold mb-2 text-blue-700">{displayCategory}</h3>
                <ul className="text-gray-600 text-sm w-full mt-2 space-y-2">
                  {events.slice(0, 3).map(event => (
                    <li key={event.id} className="border-b pb-2">
                      <span className="font-semibold">{event.title}</span>
                      <span className="ml-2 text-gray-500">{event.date ? new Date(event.date).toLocaleDateString() : ''}</span>
                      <div className="text-xs">{event.location}</div>
                    </li>
                  ))}
                </ul>
                {events.length > 3 && (
                  <Link
                    to={`/search?q=${encodeURIComponent(category)}`}
                    className="mt-3 text-blue-600 hover:underline text-sm font-semibold"
                  >
                    View All
                  </Link>
                )}
                {/* Show a badge for "Other" category */}
                {category.toLowerCase() === 'other' && (
                  <span className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    Other Events
                  </span>
                )}
              </div>
            );
          })}
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
              <li><Link to="/search" className="hover:underline text-blue-100">Search Events</Link></li>
              <li><Link to="/login" className="hover:underline text-blue-100">Login</Link></li>
              <li><Link to="/register" className="hover:underline text-blue-100">Register</Link></li>
              {/* Add organizer dashboard link if needed */}
              {/* <li><Link to="/dashboard" className="hover:underline text-blue-100">Organizer Dashboard</Link></li> */}
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

      {/* Buy Ticket Modal (conditionally rendered) */}
      {showBuyModal && selectedEvent && (
        <BuyTicketModal
          event={selectedEvent}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {/* Optionally refresh tickets or events */}}
        />
      )}
    </div>
  );
};

export default Home;
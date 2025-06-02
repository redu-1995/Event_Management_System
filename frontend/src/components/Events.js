import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const sampleEvents = [
  {
    id: 1,
    title: 'Summer Music Festival',
    date: '2025-06-15',
    location: 'Addis Ababa',
    category: 'Festival',
    icon: '🎉',
    price: 200,
    popularity: 95,
    description: 'Enjoy live music, food, and fun at the biggest festival of the year!',
  },
  {
    id: 2,
    title: 'Tech Conference 2025',
    date: '2025-07-22',
    location: 'Adama',
    category: 'Conference',
    icon: '💡',
    price: 100,
    popularity: 80,
    description: 'Join industry leaders and innovators for a day of talks and networking.',
  },
  {
    id: 3,
    title: 'Jazz Night',
    date: '2025-06-30',
    location: 'Bahir Dar',
    category: 'Concert',
    icon: '🎷',
    price: 150,
    popularity: 70,
    description: 'A night of smooth jazz with top local and international artists.',
  },
  // ...add more events for pagination demo
];

const EVENTS_PER_PAGE = 3;

const Events = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('date');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filtering
  let filteredEvents = sampleEvents.filter(event =>
    (event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())) &&
    (category === '' || event.category.toLowerCase() === category.toLowerCase()) &&
    (location === '' || event.location.toLowerCase().includes(location.toLowerCase()))
  );

  // Sorting
  filteredEvents = filteredEvents.sort((a, b) => {
    if (sort === 'date') return new Date(a.date) - new Date(b.date);
    if (sort === 'popularity') return b.popularity - a.popularity;
    if (sort === 'price') return a.price - b.price;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * EVENTS_PER_PAGE,
    page * EVENTS_PER_PAGE
  );

  // Responsive: Hide menu on link click (mobile)
  const handleMenuLink = () => setIsMenuOpen(false);

  return (
    <div className="font-sans text-gray-800 bg-blue-50 min-h-screen">
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
            <Link to="/login" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Login / Register</Link>
            <Link to="/profile" className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition">Profile</Link>
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
            <Link to="/" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={handleMenuLink}>Home</Link>
            <Link to="/events" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={handleMenuLink}>Browse Events</Link>
            <Link to="/tickets" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={handleMenuLink}>My Tickets</Link>
            <Link to="/login" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={handleMenuLink}>Login / Register</Link>
            <Link to="/profile" className="hover:bg-blue-50 px-3 py-2 rounded transition" onClick={handleMenuLink}>Profile</Link>
            <Link to="/create-event" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold shadow transition" onClick={handleMenuLink}>+ Create Event</Link>
          </div>
        )}
      </nav>

      {/* Search, Filter, Sort Bar */}
      <div className="max-w-4xl mx-auto mb-8 mt-8 flex flex-col md:flex-row gap-4 items-center bg-white rounded-xl shadow-lg p-6">
        <input
          type="text"
          placeholder="🔍 Search events"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          <option value="concert">Concert</option>
          <option value="festival">Festival</option>
          <option value="workshop">Workshop</option>
          <option value="conference">Conference</option>
        </select>
        <input
          type="text"
          placeholder="📍 Location"
          value={location}
          onChange={e => { setLocation(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="date">Sort by Date</option>
          <option value="popularity">Sort by Popularity</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {/* Event Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        {paginatedEvents.length === 0 ? (
          <div className="col-span-3 text-center text-blue-700 font-semibold text-lg py-12">
            No events found.
          </div>
        ) : (
          paginatedEvents.map(event => (
            <div
              key={event.id}
              className="relative bg-white rounded-2xl shadow-lg border-t-4 border-blue-500 p-6 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Date Badge */}
              <span className="absolute top-0 right-0 mt-4 mr-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                {new Date(event.date).toLocaleDateString()}
              </span>
              {/* Event Icon */}
              <div className="mb-4 text-4xl">{event.icon}</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                <span className="font-semibold">Location:</span> {event.location}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                <span className="font-semibold">Price:</span> ${event.price}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{event.description}</p>
              <button
                className="mt-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-5 py-2 rounded-full font-semibold shadow transition"
                onClick={() => setSelectedEvent(event)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 mb-16 space-x-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-blue-200 text-blue-700 font-bold disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx + 1)}
            className={`px-3 py-1 rounded-full font-bold ${page === idx + 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-blue-200 text-blue-700 font-bold disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl"
              onClick={() => setSelectedEvent(null)}
            >
              &times;
            </button>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl">{selectedEvent.icon}</span>
              <h3 className="text-2xl font-bold text-blue-800">{selectedEvent.title}</h3>
            </div>
            <p className="mb-2"><span className="font-semibold">Date:</span> {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p className="mb-2"><span className="font-semibold">Location:</span> {selectedEvent.location}</p>
            <p className="mb-2"><span className="font-semibold">Category:</span> {selectedEvent.category}</p>
            <p className="mb-2"><span className="font-semibold">Price:</span> ${selectedEvent.price}</p>
            <p className="mb-4">{selectedEvent.description}</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-full shadow transition">
              Buy Ticket
            </button>
          </div>
        </div>
      )}

      {/* Floating Create Event Button (for organizers, demo only) */}
      <Link
        to="/create-event"
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg z-40 transition"
      >
        + Create Event
      </Link>
    </div>
  );
};

export default Events;
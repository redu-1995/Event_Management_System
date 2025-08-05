import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Navbar from './Navbar'; // <-- Import Navbar

const EVENTS_PER_PAGE = 3;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('date');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events/');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setEvents([]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Filtering
  let filteredEvents = events.filter(event =>
    (event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())) &&
    (category === '' || (event.category && event.category.toLowerCase() === category.toLowerCase())) &&
    (location === '' || (event.location && event.location.toLowerCase().includes(location.toLowerCase())))
  );

  // Sorting
  filteredEvents = filteredEvents.sort((a, b) => {
    if (sort === 'date') return new Date(a.date) - new Date(b.date);
    if (sort === 'popularity') return (b.popularity || 0) - (a.popularity || 0);
    if (sort === 'price') return (a.price || 0) - (b.price || 0);
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
      <Navbar />

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
        {loading ? (
          <div className="col-span-3 text-center text-blue-700 font-semibold text-lg py-12">
            Loading events...
          </div>
        ) : paginatedEvents.length === 0 ? (
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
                {event.date ? new Date(event.date).toLocaleDateString() : ''}
              </span>
              {/* Event Icon */}
              <div className="mb-4 text-4xl">{event.icon || '🎫'}</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                <span className="font-semibold">Location:</span> {event.location}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                <span className="font-semibold">Price:</span> ETB{event.price || 'N/A'}

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
              <span className="text-4xl">{selectedEvent.icon || '🎫'}</span>
              <h3 className="text-2xl font-bold text-blue-800">{selectedEvent.title}</h3>
            </div>
            <p className="mb-2"><span className="font-semibold">Date:</span> {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : ''}</p>
            <p className="mb-2"><span className="font-semibold">Location:</span> {selectedEvent.location}</p>
            <p className="mb-2"><span className="font-semibold">Category:</span> {selectedEvent.category}</p>
            <p className="mb-2"><span className="font-semibold">Price:</span> ${selectedEvent.price || 'N/A'}</p>
            
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
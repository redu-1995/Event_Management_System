import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BuyTicketModal from './BuyTicketModal';

const SearchEvents = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const dropdownRef = useRef(null);

  // Fetch all events for suggestions
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events/');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setAllEvents(data);
      } catch (err) {
        // Ignore error for all events listing
      }
    };
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        let url = 'http://127.0.0.1:8000/api/events/';
        if (initialQuery) {
          url += `?search=${encodeURIComponent(initialQuery)}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Error fetching events.');
      }
      setLoading(false);
    };

    fetchEvents();
    // eslint-disable-next-line
  }, [initialQuery]);

  const handleSearch = async (e, customQuery) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const q = customQuery !== undefined ? customQuery : query;
      const response = await fetch(
        `http://127.0.0.1:8000/api/events/?search=${encodeURIComponent(q)}`
      );
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Error fetching events.');
    }
    setLoading(false);
    setShowDropdown(false);
  };

  // Filter suggestions based on query
  const suggestions = allEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(query.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 7); // Limit to 7 suggestions

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Handle Buy Ticket button click
  const handleBuyClick = (event) => {
    setSelectedEvent(event);
    setShowBuyModal(true);
    setSuccessMsg('');
  };

  // Handle successful ticket purchase
  const handleBuySuccess = () => {
    setSuccessMsg('Ticket purchased successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="font-sans text-gray-800 px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Events</h1>
        <form
          onSubmit={handleSearch}
          className="relative bg-white rounded-full flex flex-col md:flex-row items-center shadow-lg overflow-visible mb-8 space-y-2 md:space-y-0 md:space-x-2"
          autoComplete="off"
          ref={dropdownRef}
        >
          <input
            type="text"
            className="flex-grow px-6 py-3 text-gray-700 rounded-full md:rounded-l-full md:rounded-r-none focus:outline-none border border-blue-300"
            placeholder="Search by event name, category, or location"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full md:rounded-r-full md:rounded-l-none transition"
          >
            Search
          </button>
          {/* Dropdown suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-blue-200 rounded shadow-lg z-10 max-h-60 overflow-auto">
              {suggestions.map((event) => (
                <li
                  key={event.id}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setQuery(event.title);
                    setShowDropdown(false);
                    handleSearch(null, event.title);
                  }}
                >
                  <span className="font-bold">{event.title}</span>
                  {event.category && (
                    <span className="ml-2 text-blue-600">({event.category})</span>
                  )}
                  {event.location && (
                    <span className="ml-2 text-gray-500">- {event.location}</span>
                  )}
                  {event.price && (
                    <span className="ml-2 text-gray-500">- {event.price}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </form>

        {successMsg && (
          <div className="mb-4 text-green-600 text-center font-semibold">{successMsg}</div>
        )}
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid gap-8 md:grid-cols-3">
          {events.length === 0 && !loading && !error && (
            <div className="col-span-3 text-center text-gray-500">No events found.</div>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="relative bg-white rounded-2xl shadow-lg border-t-4 border-blue-500 p-6 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute top-0 right-0 mt-4 mr-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                {new Date(event.date).toLocaleDateString()}
              </span>
              <div className="mb-4 text-4xl">🎫</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {event.description}<br />
                <strong>Location:</strong> {event.location}<br />
                <strong>Category:</strong> {event.category && event.category.charAt(0).toUpperCase() + event.category.slice(1)}<br />
                  <strong>Price:</strong> {event.price ? `ETB${event.price}` : 'Free'}
              </p>
              <button
                className="mt-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-5 py-2 rounded-full font-semibold shadow transition"
                onClick={() => handleBuyClick(event)}
              >
                Buy Ticket
              </button>
            </div>
          ))}
        </div>
      </div>
      {showBuyModal && selectedEvent && (
        <BuyTicketModal
          event={selectedEvent}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {}}
        />
      )}
    </>
  );
};

export default SearchEvents;
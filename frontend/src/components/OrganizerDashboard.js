import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000/api/events/'; // Adjust if needed

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch events for the logged-in organizer
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.results || []);
      setLoading(false);
    };
    fetchEvents();
  }, [showCreate]);

  // Stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create event
  const handleCreate = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`, // <-- THIS IS THE FIX
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ title: '', description: '', date: '', location: '' });
    } else {
      const errorData = await res.json();
      alert('Failed to create event: ' + (errorData.detail || JSON.stringify(errorData)));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8">Organizer Dashboard</h1>
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-500">
            <span className="text-4xl mb-2">📅</span>
            <div className="text-2xl font-bold text-blue-700">{totalEvents}</div>
            <div className="text-gray-600 text-sm">Total Events</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-500">
            <span className="text-4xl mb-2">⏳</span>
            <div className="text-2xl font-bold text-green-700">{upcomingEvents}</div>
            <div className="text-gray-600 text-sm">Upcoming Events</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-yellow-500">
            <span className="text-4xl mb-2">➕</span>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold shadow transition"
              onClick={() => setShowCreate(true)}
            >
              Create Event
            </button>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">My Events</h2>
          {loading ? (
            <div className="text-blue-600">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-gray-500">No events found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-100 text-blue-700">
                    <th className="py-2 px-4 text-left">Title</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Location</th>
                    <th className="py-2 px-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id} className="border-b hover:bg-blue-50 transition">
                      <td className="py-2 px-4 font-semibold">{event.title}</td>
                      <td className="py-2 px-4">{new Date(event.date).toLocaleString()}</td>
                      <td className="py-2 px-4">{event.location}</td>
                      <td className="py-2 px-4">{event.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl"
                onClick={() => setShowCreate(false)}
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Create New Event</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-full shadow transition"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
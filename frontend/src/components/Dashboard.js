import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

const API_URL = 'http://localhost:8000/api/events/';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.results || []);
      setLoading(false);
    };
    fetchUserAndEvents();
  }, [showCreate, showEdit]);

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ title: '', description: '', date: '', location: '', category: '' });
    } else {
      const errorData = await res.json();
      alert('Failed to create event: ' + (errorData.detail || JSON.stringify(errorData)));
    }
    setLoading(false);
  };

  const openEditModal = event => {
    setEditId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16),
      location: event.location,
      category: event.category,
    });
    setShowEdit(true);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${editId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowEdit(false);
      setEditId(null);
      setForm({ title: '', description: '', date: '', location: '', category: '' });
    } else {
      const errorData = await res.json();
      alert('Failed to update event: ' + (errorData.detail || JSON.stringify(errorData)));
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      alert('Failed to delete event: ' + (errorData.detail || JSON.stringify(errorData)));
    }
    setLoading(false);
    setEvents(events.filter(event => event.id !== id));
  };

  if (!user) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  const totalTickets = events.reduce((sum, event) => sum + (event.tickets?.length || 0), 0);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center drop-shadow">
          Organizer Dashboard
        </h1>

        {/* Organizer Info & Stats */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Welcome, {user.username}!</h2>
          <div className="mb-2"><strong>Email:</strong> {user.email}</div>
          <div className="mb-2"><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
            onClick={() => setShowCreate(true)}
          >
            + Create New Event
          </button>
        </div>


          <div className="grid gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-500">
          <span className="text-4xl mb-2">📅</span>
          <div className="text-2xl font-bold text-blue-700">{totalEvents}</div>
          <div className="text-gray-600 text-sm">Total Events</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-500">
          <span className="text-4xl mb-2">⏳</span>
          <div className="text-2xl font-bold text-green-700">{upcomingEvents}</div>
          <div className="text-gray-600 text-sm">Upcoming Events</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-yellow-500">
          <span className="text-4xl mb-2">🎟️</span>
          <div className="text-2xl font-bold text-yellow-600">{totalTickets}</div>
          <div className="text-gray-600 text-sm">Purchased Tickets</div>
        </div>
      </div>

        </div>

       {/* Event List */}
<div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
  <h2 className="text-2xl font-bold text-blue-700 mb-6">My Events</h2>

  {loading ? (
    <div className="text-blue-600 text-center">Loading...</div>
  ) : events.length === 0 ? (
    <div className="text-gray-500 text-center">No events found.</div>
  ) : (
    events.map((event) => (
      <div key={event.id} className="mb-10 border-b border-gray-200 pb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-indigo-800">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(event.date).toLocaleString()} • {event.location}
            </p>
            <p className="text-sm text-gray-600 capitalize">Category: {event.category}</p>
            <p className="text-gray-700 mt-2">{event.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-lg shadow-sm"
              onClick={() => openEditModal(event)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg shadow-sm"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Ticket Purchases Section */}
        {event.tickets && event.tickets.length > 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <h4 className="text-md font-semibold text-blue-700 mb-2">🎟️ Purchased Tickets</h4>
            <table className="w-full text-sm table-auto border-collapse">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="py-2 px-4 border-b">Buyer</th>
                  <th className="py-2 px-4 border-b">Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {event.tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-blue-50 transition">
                    <td className="py-2 px-4 border-b">{ticket.attendee || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(ticket.purchase_date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-2 italic">No tickets sold yet.</p>
        )}

        {/* Feedback Section */}
{event.feedbacks && event.feedbacks.length > 0 ? (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
    <h4 className="text-md font-semibold text-indigo-700 mb-2">💬 Feedback</h4>
    <ul className="space-y-2">
      {event.feedbacks.map(fb => (
        <li key={fb.id} className="border-b pb-2">
          <div className="text-sm text-gray-800"><strong>{fb.attendee_username}</strong> rated it <strong>{fb.rating}/5</strong></div>
          <div className="text-gray-600 text-sm italic">"{fb.comment}"</div>
          <div className="text-xs text-gray-500">{new Date(fb.created_at).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  </div>
) : (
  <p className="text-gray-500 mt-2 italic">No feedback yet.</p>
)}

      </div>
      
    ))
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
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select category</option>
                    <option value="concert">Concert</option>
                    <option value="conference">Conference</option>
                    <option value="festival">Festival</option>
                    <option value="theater">Theater</option>
                    <option value="sports">Sports</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
            <label className="block font-semibold mb-1">Price (ETB)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
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

        {/* Edit Event Modal */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl"
                onClick={() => setShowEdit(false)}
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Edit Event</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
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
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select category</option>
                    <option value="concert">Concert</option>
                    <option value="conference">Conference</option>
                    <option value="festival">Festival</option>
                    <option value="theater">Theater</option>
                    <option value="sports">Sports</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
  <label className="block font-semibold mb-1">Price (ETB)</label>
  <input
    type="number"
    name="price"
    value={form.price}
    onChange={handleChange}
    required
    step="0.01"
    min="0"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-full shadow transition"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Event'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events/', {
          headers: {
            'Authorization': `Token ${token}`,

          }
        });
        if (!response.ok) throw new Error('Failed to load events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setEvents([]);
        setError('Failed to load your events.');
      }
    };

    fetchUserEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token || !selectedEventId) {
      setError('Please select an event and make sure you are logged in.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/${selectedEventId}/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ comment, rating }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.detail || data.non_field_errors?.[0] || 'Failed to submit feedback'
        );
}


      setSuccess('Feedback submitted successfully!');
      setComment('');
      setRating(5);
      setSelectedEventId('');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-blue-50 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Leave Feedback</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Choose an Event --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

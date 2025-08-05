import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import BuyTicketModal from './BuyTicketModal';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketError, setTicketError] = useState('');
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events/');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setAllEvents(data);
      } catch {
        setAllEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    setTicketError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setTickets([]);
      setLoadingTickets(false);
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tickets/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      const filtered = Array.isArray(data)
        ? data.filter(t => t.attendee && t.attendee.id === user?.id)
        : data;
      setTickets(filtered);
    } catch {
      setTicketError('Could not load tickets.');
    }
    setLoadingTickets(false);
  };

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const handleBuySuccess = () => {
    fetchTickets();
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 text-blue-700">My Profile</h2>
            <div className="mb-1"><strong>Username:</strong> {user.username}</div>
            <div className="mb-1"><strong>Email:</strong> {user.email}</div>
            <div className="mb-1"><strong>Role:</strong> {user.role}</div>
          </div>
          <button
            className="mt-6 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow transition"
            onClick={() => setShowEventPicker(true)}
            disabled={allEvents.length === 0}
          >
            Buy Ticket
          </button>
        </div>
      </div>

      {/* My Tickets Section */}
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">My Tickets</h3>
        {loadingTickets && <div>Loading tickets...</div>}
        {ticketError && <div className="text-red-500">{ticketError}</div>}
        {!loadingTickets && tickets.length === 0 && (
          <div className="text-gray-500">You have not purchased any tickets yet.</div>
        )}
        <div className="flex flex-row gap-6 overflow-x-auto pb-2">
                {tickets.map(ticket => (
          <div
            key={ticket.id}
            className="min-w-[260px] max-w-xs bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-md p-5 flex flex-col items-start border-t-4 border-blue-400"
          >
           <div className="font-semibold text-blue-800 text-lg mb-2">
                {ticket.event_info?.title || 'Event Title'}
              </div>
            <div className="text-sm text-gray-600 mb-1">
              <strong>Location:</strong> {ticket.event_info?.location || 'Unknown'}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <strong>Category:</strong> {ticket.event_info?.category || 'General'}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              <strong>Purchased:</strong> {ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleString() : 'N/A'}
            </div>
          </div>
        ))}

        </div>
      </div>

      {/* Event Picker Modal */}
      {showEventPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Select an Event</h3>
            <select
              className="w-full mb-4 p-2 border rounded"
              onChange={(e) => {
                const selected = allEvents.find(ev => ev.id === parseInt(e.target.value));
                setSelectedEvent(selected);
              }}
              defaultValue=""
            >
              <option value="" disabled>Select an event</option>
              {allEvents.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedEvent) {
                  setShowEventPicker(false);
                  setShowBuyModal(true);
                }
              }}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold"
              disabled={!selectedEvent}
            >
              Continue
            </button>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventPicker(false);
              }}
              className="mt-2 text-sm text-gray-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Buy Ticket Modal */}
      {showBuyModal && selectedEvent && (
        <BuyTicketModal
          event={selectedEvent}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={handleBuySuccess}
        />
      )}
    </>
  );
};

export default Profile;

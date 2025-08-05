import React, { useState, useEffect } from 'react';

const BuyTicketModal = ({ event, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasTicket, setHasTicket] = useState(false);
  const [checkingTicket, setCheckingTicket] = useState(true);

  useEffect(() => {
    const checkTicketOwnership = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingTicket(false);
        return;
      }
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/tickets/exists/?event_id=${event.id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const data = await response.json();
        setHasTicket(data.has_ticket);
      } catch (err) {
        // Could log error or show a message here if needed
        setHasTicket(false);
      } finally {
        setCheckingTicket(false);
      }
    };

    if (event) {
      checkTicketOwnership();
    }
  }, [event]);

  const handleBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (hasTicket) {
      setError('You have already purchased a ticket for this event.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to buy tickets.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/payments/chapa/init/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          event_id: event.id,
          quantity: 1, // always 1 ticket
        }),
      });

      const data = await response.json();

      if (response.ok && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        const message =
          data?.error ||
          data?.detail ||
          (typeof data === 'object' ? JSON.stringify(data) : 'Payment initiation failed');
        setError(message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
        <button className="absolute top-2 right-4 text-2xl" onClick={onClose}>
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-700">Buy Ticket for {event.title}</h3>

        {checkingTicket ? (
          <p>Checking ticket status...</p>
        ) : hasTicket ? (
          <p className="text-red-600 font-semibold">
            You have already purchased a ticket for this event.
          </p>
        ) : (
          <form onSubmit={handleBuy} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Price per Ticket:</label>
              <div className="text-gray-800 font-medium">ETB {event.price}</div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Total Price:</label>
              <div className="text-green-700 font-bold">ETB {event.price}</div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {typeof error === 'string'
                  ? error
                  : Array.isArray(error)
                  ? error.join(', ')
                  : typeof error === 'object'
                  ? Object.entries(error).map(([key, value]) => (
                      <div key={key}>
                        {key}: {Array.isArray(value) ? value.join(', ') : value}
                      </div>
                    ))
                  : JSON.stringify(error)}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-bold"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Buy for ETB ${event.price}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BuyTicketModal;

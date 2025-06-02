import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl border-t-4 border-blue-500 text-center">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-700">Welcome to EventManager</h1>
      <p className="mb-8 text-lg text-gray-700">
        Manage and discover events, buy tickets, and organize your own events with ease!
      </p>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow transition">
          Login
        </Link>
        <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold shadow transition">
          Register
        </Link>
      </div>
      <div className="mt-8 text-gray-600">
        <p>
          <span className="font-bold text-blue-700">Organizers:</span> Please login or register to create and manage your events.
        </p>
        <p>
          <span className="font-bold text-green-700">Attendees:</span> Please login or register to browse and book tickets for events.
        </p>
      </div>
    </div>
  </div>
);

export default LandingPage;
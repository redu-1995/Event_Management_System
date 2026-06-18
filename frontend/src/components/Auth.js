import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // === 1. IMPORT YOUR CENTRAL CONTEXT HOOK ===

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = `${API_BASE_URL}/api/users`;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth(); // === 2. EXTRACT CENTRALIZED DISPATCH FROM CONTEXT ===
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'attendee',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (isLogin) {
      // Login Flow
      try {
        const res = await fetch(`${API_BASE}/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        const data = await res.json();
        
        if (data.token) {
          // === 3. USE CONTEXT STATE TO UPDATE THE WHOLE APPLICATION INSTANTLY ===
          login(data.user, data.token);
          navigate('/'); 
        } else {
          setError(data.error || 'Login failed');
        }
      } catch {
        setError('Network error during login.');
      }
    } else {
      // Register Flow
      try {
        const res = await fetch(`${API_BASE}/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        
        if (data.id) {
          setIsLogin(true); 
          setSuccess('Registration successful! Please log in.');
        } else {
          if (typeof data === 'object' && data !== null) {
            setError(Object.values(data).flat().join(' '));
          } else {
            setError(data.error || 'Registration failed');
          }
        }
      } catch {
        setError('Network error during registration.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-blue-500">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center drop-shadow">
          {isLogin ? 'Login to Your Account' : 'Create a New Account'}
        </h2>
        {success && <div className="text-green-600 text-sm text-center mb-4">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-700 font-semibold mb-1" htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-blue-700 font-semibold mb-1" htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="Enter your first name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1" htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Enter your last name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-blue-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-blue-700 font-semibold mb-1" htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="attendee">Attendee</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
          )}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-full shadow transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
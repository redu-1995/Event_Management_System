import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// === 1. IMPORT YOUR NEW AUTH PROVIDER WRAPPER ===
import { AuthProvider } from './context/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* === 2. NEST THE APP COMPONENT INSIDE THE PROVIDER === */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


reportWebVitals();
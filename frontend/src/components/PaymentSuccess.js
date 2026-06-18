import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// === 1. DEFINE THE DYNAMIC ENV SETUP AT THE TOP ===
// Change from import.meta.env.VITE_API_URL to process.env.REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('verifying');
  const [details, setDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tx_ref = params.get('tx_ref');

    if (!tx_ref) {
      setStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        // === 2. INJECT THE DYNAMIC ENVIRONMENT VARIABLE HERE ===
        const response = await fetch(
          `${API_BASE_URL}/api/payments/chapa/verify/?tx_ref=${tx_ref}`
        );
        const data = await response.json();

        if (response.ok) {
          setDetails(data);
          setStatus('paid');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [location.search]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="animate-pulse text-blue-700 text-xl font-semibold">
            🔄 Verifying your payment...
          </div>
        );
      case 'paid':
        return (
          <div className="bg-white rounded-xl shadow-md p-8 max-w-lg mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h2>
            {/* Safe access using optional chaining to protect against rendering before state data loads */}
            <p className="text-gray-700"><strong>Event:</strong> {details?.event}</p>
            <p className="text-gray-700"><strong>User:</strong> {details?.user}</p>
            <p className="text-gray-700"><strong>Amount:</strong> {details?.amount} ETB</p>
            <p className="text-gray-700"><strong>Reference:</strong> {details?.tx_ref}</p>
            <div className="mt-4">
              <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Back to Home
              </a>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-xl max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold">❌ Payment Failed</h2>
            <p className="mt-2">Something went wrong. Please try again.</p>
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:underline">Return to Home</a>
            </div>
          </div>
        );
      case 'error':
      default:
        return (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-6 rounded-xl max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold">⚠️ Something Went Wrong</h2>
            <p className="mt-2">We couldn't verify your payment. Please contact support.</p>
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:underline">Return to Home</a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen">
      <div className="py-16 px-4">{renderContent()}</div>
    </div>
  );
};

export default PaymentSuccess;
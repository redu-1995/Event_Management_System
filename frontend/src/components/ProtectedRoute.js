import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  // 1. Not logged in? Sent to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but doesn't have the right role? Kick to a fallback home page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Authorized? Render the target component layout
  return children;
};

export default ProtectedRoute;
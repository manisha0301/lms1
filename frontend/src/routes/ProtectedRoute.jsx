// src/components/SuperAdminProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const location = useLocation();

  // If no token, redirect to login and preserve the attempted URL
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected page
  return children;
};

export default ProtectedRoute;
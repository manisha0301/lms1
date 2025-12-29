// src/components/SuperAdminProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // CHANGE: Check localStorage for "superAdminToken"
  const token = localStorage.getItem('superAdminToken');
  const location = useLocation();

  if (!token) {
    // No token → redirect to login, remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token exists → allow access to protected page
  return children;
};

export default ProtectedRoute;
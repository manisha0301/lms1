// src/components/SuperAdminProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Admin protected route — checks admin token
export const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Super Admin protected route — checks super admin token
export const SuperAdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('superAdminToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Default export for backwards compatibility (Admin by default)
export default AdminProtectedRoute;
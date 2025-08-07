import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowRoles }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) return <Navigate to="/login" replace />;
  // Basic check: in real app, decode role; here we rely on per-page checks or API errors
  return children;
}
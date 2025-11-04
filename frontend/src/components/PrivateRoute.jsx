import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, adminRequired = false }) {
  const userInfoStr = localStorage.getItem('userInfo');
  if (!userInfoStr) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  const userInfo = JSON.parse(userInfoStr);

  if (adminRequired && userInfo.role !== 'admin') {
    // Logged in but not admin, redirect to home or some "Not authorized" page
    return <Navigate to="/" replace />;
  }

  // Authorized (logged in, and if adminRequired then admin role)
  return children;
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from './SkeletonLoader'; // optional loading UI

const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  // Wait until auth is checked before rendering
  if (loadingAuth) return <SkeletonLoader />; // show a loader or null

  // If user is not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Render the protected page
  return children;
};

export default ProtectedRoute;

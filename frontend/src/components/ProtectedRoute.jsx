import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading indicator while checking auth status
    // You can replace this with a proper spinner component
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Check if authenticated
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
      // User is logged in but doesn't have the right role
      // Redirect to an unauthorized page or back to home
      // For simplicity, redirecting to home
      console.warn(`User role "${user?.role}" not allowed for ${location.pathname}`);
      return <Navigate to="/" replace />;
  }

  // If authenticated and role is allowed (or no specific roles required), render the child component
  return <Outlet />; // Renders the nested route components
};

export default ProtectedRoute; 
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLoggedInUser, login as apiLogin, logout as apiLogout } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // No need to call getLoggedInUser here if axiosClient adds token
          // Re-validate token or fetch user data if needed on initial load
          // For now, assume token presence means potentially authenticated
          // We'll fetch user data properly upon needing it or in protected routes
          // Let's fetch user data right away to confirm token validity
          const userData = await getLoggedInUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token'); // Clear invalid token
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await apiLogin(credentials); // Calls service which sets token in localStorage
      // After successful login, fetch user data to store in context
      const userData = await getLoggedInUser();
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return userData; // Return user data for potential immediate use
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      console.error('AuthContext login failed:', error);
      throw error; // Re-throw error to be handled by the component
    }
  };

  const logout = () => {
    setLoading(true);
    apiLogout(); // Calls service which removes token from localStorage
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    // Optionally redirect to login page here or let routing handle it
  };

  const value = {
    user,
    isAuthenticated,
    isLoading: loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} { /* Render children only after initial auth check */ }
    </AuthContext.Provider>
  );
}; 
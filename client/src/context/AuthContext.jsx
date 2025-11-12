import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios'; // We no longer need this
import api from '../api/axios'; // --- NEW: Import our central API instance
import { jwtDecode } from 'jwt-decode'; 

// 1. Create the Context
export const AuthContext = createContext();

// 2. API URL is now handled in api/axios.js
// const API_URL = 'http://localhost:5000/api/auth'; // <-- REMOVED

// 3. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // For initial auth check

  // Effect to load user data on app start
  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(storedToken);
          const expiresAt = decodedToken.exp * 1000;

          if (expiresAt > Date.now()) {
            // Token is valid, now fetch fresh user data
            // The token is already added by the axios interceptor in api.js
            const { data } = await api.get('/api/auth/me');
            if (data.success) {
              setUser(data.user);
              setToken(storedToken);
            } else {
              // Handle case where /me fails (e.g., user deleted)
              logout();
            }
          } else {
            // Token is expired
            logout();
          }
        } catch (error) {
          console.error("Failed to load user from token", error);
          logout(); // Clear bad token
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []); // Only run once on app load

  // --- Core Auth Functions ---

  const register = async (userData) => {
    try {
      // Use our 'api' instance
      const { data } = await api.post('/api/auth/register', userData);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        // No need to set headers, interceptor does it
        return { success: true };
      }
    } catch (error) {
      console.error('Registration Error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Server error' };
    }
  };

  const login = async (credentials) => {
    try {
      // Use our 'api' instance
      const { data } = await api.post('/api/auth/login', credentials);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        // No need to set headers, interceptor does it
        return { success: true };
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Server error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // No need to delete headers
  };

  // 4. Pass down the context values
  const contextValue = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user, // Easy boolean check
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
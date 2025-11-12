import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // We need to install this!

// 1. Create the Context
export const AuthContext = createContext();

// 2. Define the API URL (Set this to your server's URL)
const API_URL = 'http://localhost:5000/api/auth';

// 3. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // For initial auth check

  // Effect to load user data on app start
  useEffect(() => {
    const loadUserFromToken = () => {
      if (token) {
        try {
          // Decode the token to get user info and check expiry
          const decodedToken = jwtDecode(token);
          const expiresAt = decodedToken.exp * 1000;

          if (expiresAt > Date.now()) {
            // Token is valid
            setUser({
              id: decodedToken.id,
              role: decodedToken.role,
            });
            // Set the token for all future axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            // Token is expired
            logout();
          }
        } catch (error) {
          console.error("Failed to decode token", error);
          logout(); // Clear bad token
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [token]);

  // --- Core Auth Functions ---

  /**
   * @desc    Registers a new user and logs them in
   * @param   {object} userData - { name, email, password, role }
   */
  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, userData);

      if (data.success) {
        // Set token to localStorage and state
        localStorage.setItem('token', data.token);
        setToken(data.token);
        
        // Set user in state
        setUser(data.user);

        // Set auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return { success: true };
      }
    } catch (error) {
      console.error('Registration Error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Server error' };
    }
  };

  /**
   * @desc    Logs in an existing user
   * @param   {object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, credentials);

      if (data.success) {
        // Set token to localStorage and state
        localStorage.setItem('token', data.token);
        setToken(data.token);
        
        // Set user in state
        setUser(data.user);

        // Set auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return { success: true };
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Server error' };
    }
  };

  /**
   * @desc    Logs out the user
   */
  const logout = () => {
    // Clear everything
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
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
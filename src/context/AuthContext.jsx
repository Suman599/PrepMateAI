import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Set default base URL for all axios requests
axios.defaults.baseURL = 'https://prepmateai.onrender.com';

// Interceptor to automatically attach token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Restore user on app load
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const { data } = await axios.get('/auth/me'); // token is sent automatically
        if (data.user) setUser(data.user);
        else throw new Error('Invalid user data');
      } catch (err) {
        console.error('Auth restore failed:', err);
        localStorage.removeItem('userToken');
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    restoreUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      if (!data.token || !data.user) throw new Error('Invalid login response');

      setUser(data.user);
      localStorage.setItem('userToken', data.token);
      toast.success('Login successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/auth/register', { name, email, password });
      if (!data.token || !data.user) throw new Error('Invalid register response');

      setUser(data.user);
      localStorage.setItem('userToken', data.token);
      toast.success('Registration successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    toast('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);

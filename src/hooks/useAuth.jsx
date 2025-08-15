import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      // Optional: fetch user info from backend using token
      setUser({ token });
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('userToken', data.token);
      setUser(data.user || { email }); // fallback if backend does not return user
      toast.success('Login successful!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
      throw e;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      localStorage.setItem('userToken', data.token);
      setUser(data.user || { name, email });
      toast.success('Registration successful!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
      throw e;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    toast.success('Logged out!');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Named export for hook
export const useAuth = () => useContext(AuthContext);

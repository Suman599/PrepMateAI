import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

// Backend API URL
const API_URL = "https://prepmateai.onrender.com";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');

    setLoading(true);
    try {
      // POST request to backend login
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const token = response.data.token;

      if (token) {
        // Store token in localStorage as an object
        localStorage.setItem('user', JSON.stringify({ token }));
        toast.success('Login successful!');
        navigate('/practice'); // redirect to Practice page
      } else {
        toast.error('Invalid login response from server');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Paper
          sx={{
            p: 6,
            width: '100%',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4">Login</Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;

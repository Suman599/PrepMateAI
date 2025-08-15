import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = "https://prepmateai.onrender.com"; // Use your Render backend

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error('Please fill all fields');
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Registration successful!');
        navigate('/'); // redirect to homepage
      } else {
        toast.error('Invalid registration response');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Paper sx={{ p: 6, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.2)' }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4">Register</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
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
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;

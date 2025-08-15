import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Avatar, Stack, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TimelineIcon from '@mui/icons-material/Timeline';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import InsightsIcon from '@mui/icons-material/Insights';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const API_URL = process.env.REACT_APP_API_URL;

// --- THIS IS THE ONLY CHANGE ---
// A professional dark theme palette
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Tells Material-UI to use dark mode defaults
    primary: {
      main: '#BB86FC', // A vibrant purple for dark backgrounds
    },
    secondary: {
      main: '#03DAC6', // A high-contrast teal accent
    },
    background: {
      default: '#121212', // Standard dark background
      paper: '#1E1E1E',   // A slightly lighter surface for cards and sections
    },
    text: {
      primary: '#FFFFFF',   // White text
      secondary: '#B0BEC5', // Light grey text for subtitles
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          padding: '12px 28px',
          fontWeight: '600',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // Make cards pop more in dark mode
          border: '1px solid #2E2E2E',
        }
      }
    }
  },
});

const Homepage = () => {
  const navigate = useNavigate();

  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: '100%', overflowX: 'hidden', bgcolor: 'background.default', color: 'text.primary' }}>
        
        {/* --- Hero Section --- */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                  Master Your Interviews with AI
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                  Receive instant, detailed feedback on your communication skills. Speak naturally and let our AI guide you to success.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/practice')}
                  sx={{ fontSize: '1.1rem' }}
                >
                  Start Practicing Now
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* --- Features Section --- */}
        <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6 }}>
              Why Our Platform is a Game-Changer
            </Typography>
            <Grid container spacing={4}>
              {/* Feature Cards */}
              <Grid item xs={12} md={4}>
                <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }}>
                  <Card sx={{ p: 2, borderRadius: 4, boxShadow: 'none', height: '100%', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: 'translateY(-5px)', transition: '0.3s' } }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', width: 56, height: 56, mb: 2, color: 'primary.main' }}><AutoAwesomeIcon /></Avatar>
                      <Typography variant="h6" gutterBottom>AI-Powered Feedback</Typography>
                      <Typography color="text.secondary">Get objective analysis of your clarity, structure, grammar, and technical depth in real-time.</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div initial="offscreen" whileInVew="onscreen" viewport={{ once: true, amount: 0.5 }}>
                  <Card sx={{ p: 2, borderRadius: 4, boxShadow: 'none', height: '100%', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: 'translateY(-5px)', transition: '0.3s' } }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', width: 56, height: 56, mb: 2, color: 'primary.main' }}><TimelineIcon /></Avatar>
                      <Typography variant="h6" gutterBottom>Track Your Progress</Typography>
                      <Typography color="text.secondary">A dedicated dashboard visualizes your improvement over time, helping you identify strengths and weaknesses.</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }}>
                  <Card sx={{ p: 2, borderRadius: 4, boxShadow: 'none', height: '100%', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: 'translateY(-5px)', transition: '0.3s' } }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', width: 56, height: 56, mb: 2, color: 'primary.main' }}><CategoryIcon /></Avatar>
                      <Typography variant="h6" gutterBottom>Diverse Question Bank</Typography>
                      <Typography color="text.secondary">Practice with a wide range of questions covering technical, behavioral, and situational interview styles.</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* --- 'How It Works' Section --- */}
        <Container sx={{ py: 10 }} maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 8 }}>
            Get Started in 3 Simple Steps
          </Typography>
          <Grid container spacing={4} alignItems="center">
            {/* Steps */}
            <Grid item xs={12} md={4}>
              <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
                <Stack alignItems="center" spacing={2} sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, color: 'black' }}><RecordVoiceOverIcon sx={{ fontSize: '2.5rem' }} /></Avatar>
                  <Typography variant="h5">1. Record</Typography>
                  <Typography color="text.secondary">Choose a question and simply record your answer. No special equipment needed.</Typography>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
                <Stack alignItems="center" spacing={2} sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, color: 'black' }}><InsightsIcon sx={{ fontSize: '2.5rem' }} /></Avatar>
                  <Typography variant="h5">2. Analyze</Typography>
                  <Typography color="text.secondary">Our AI instantly analyzes your speech for key metrics like clarity, structure, and pacing.</Typography>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
                <Stack alignItems="center" spacing={2} sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, color: 'black' }}><TaskAltIcon sx={{ fontSize: '2.5rem' }} /></Avatar>
                  <Typography variant="h5">3. Improve</Typography>
                  <Typography color="text.secondary">Receive an actionable report with suggestions to help you improve for your next interview.</Typography>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* --- Final Call to Action Section --- */}
        <Box sx={{ py: 8 }}>
          <Container maxWidth="md">
            <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.8 }}>
              <Paper
                elevation={0}
                sx={{ 
                  textAlign: 'center', 
                  p: { xs: 4, md: 6 }, 
                  borderRadius: 4,
                  background: 'linear-gradient(45deg, #BB86FC 30%, #6200EE 90%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  Ready to Ace Your Next Interview?
                </Typography>
                <Typography sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                  Stop guessing and start improving with data-driven feedback. Your dream job is waiting.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate('/practice')}
                  sx={{ color: '#121212', fontSize: '1.1rem' }}
                >
                  Get Started for Free
                </Button>
              </Paper>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Homepage;
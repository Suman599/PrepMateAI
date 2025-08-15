import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button
} from '@mui/material';
const API_URL = process.env.REACT_APP_API_URL;
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsightsIcon from '@mui/icons-material/Insights';
import Skeleton from '@mui/material/Skeleton';

// --- VISUAL STYLING: DARK THEME ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#BB86FC' },
    secondary: { main: '#03DAC6' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#FFFFFF', secondary: '#B0BEC5' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
});

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  // --- YOUR ORIGINAL LOGIC: RESTORED ---
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/api/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        toast.error('Failed to fetch history. Please login again.');
        localStorage.removeItem('userToken');
        navigate('/login');
      }
    };

    fetchHistory();
  }, [navigate]);

  const filteredHistory =
    categoryFilter === 'all' ? history : history.filter(h => h.category === categoryFilter);

  // YOUR ORIGINAL CHART DATA LOGIC
  const lineData = filteredHistory.map(h => ({
    date: new Date(h.createdAt).toLocaleDateString(),
    score: h.feedback.clarity + h.feedback.structure + h.feedback.grammar + (h.feedback.technical || 0),
  }));

  const categoryData = ['HR', 'Technical', 'Behavioral'].map(cat => {
    const catScores = history.filter(h => h.category === cat);
    const avg = catScores.length
      ? Math.round(
          catScores.reduce(
            (acc, cur) =>
              acc + cur.feedback.clarity + cur.feedback.structure + cur.feedback.grammar + (cur.feedback.technical || 0),
            0
          ) / catScores.length
        )
      : 0;
    return { category: cat, average: avg };
  });
  // --- END OF YOUR RESTORED LOGIC ---

  if (loading) {
    return (
     <ThemeProvider theme={darkTheme}>
        <Container sx={{ py: 4 }}>
          <Skeleton variant="text" width={250} height={60} sx={{ mb: 2 }}/>
          <Skeleton variant="rectangular" width={240} height={56} sx={{ mb: 4, borderRadius: 2 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}><Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 4 }} /></Grid>
            <Grid item xs={12} lg={4}><Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 4 }} /></Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h4" gutterBottom>Practice History</Typography>
          
          <FormControl sx={{ mb: 3 }}>
            
            <Select
              labelId="history-category-filter-label"
              id="history-category-filter"
              label="Filter by Category"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 240, backgroundColor: 'background.paper' }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Behavioral">Behavioral</MenuItem>
            </Select>
          </FormControl>

          {history.length === 0 ? (
            <Paper sx={{ textAlign: 'center', p: {xs: 3, md: 6}, borderRadius: 4, mt: 4 }}>
              <InsightsIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography variant="h5" sx={{ mt: 2 }}>No History Found</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Complete a practice session to see your performance analytics.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/practice')}>Start Your First Practice</Button>
            </Paper>
          ) : (
            <>
              {/* --- STYLED CHARTS --- */}
              <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: 350, width: 350 }}>
                        <Typography variant="h6">Score Trend</Typography>
                        <ResponsiveContainer>
                          <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                              <XAxis dataKey="date" stroke="#B0BEC5" />
                              <YAxis stroke="#B0BEC5" />
                              <Tooltip contentStyle={{ backgroundColor: '#2E2E2E', border: '1px solid #424242', borderRadius: '10px' }} />
                              <Line type="monotone" dataKey="score" stroke="#BB86FC" strokeWidth={2} activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: 350, width: 350 }}>
                        <Typography variant="h6">Category-wise Average</Typography>
                        <ResponsiveContainer>
                          <BarChart data={categoryData} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                              <XAxis type="number" stroke="#B0BEC5" />
                              <YAxis type="category" dataKey="category" stroke="#B0BEC5" width={70} tick={{ fontSize: 12 }} />
                              <Tooltip contentStyle={{ backgroundColor: '#2E2E2E', border: '1px solid #424242', borderRadius: '10px' }} />
                              <Legend />
                              <Bar dataKey="average" fill="#03DAC6" />
                          </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
              </Grid>

              {/* --- STYLED HISTORY LIST --- */}
              <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Detailed History</Typography>
              <Stack spacing={2}>
                <AnimatePresence>
                  {filteredHistory.map((h, index) => (
                    <motion.div key={h._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <Accordion sx={{ backgroundColor: 'background.paper', borderRadius: 2, '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                           <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}><Chip label={h.category} size="small" /></Grid>
                                <Grid item xs={12} sm={4}><Typography variant="body2" color="text.secondary">Question: {h.question}</Typography></Grid>
                                <Grid item xs={12} sm={4}><Typography variant="body2" color="text.secondary">{new Date(h.createdAt).toLocaleDateString()}</Typography></Grid>
                           </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                           <Typography>Clarity: {h.feedback.clarity}</Typography>
                           <Typography>Structure: {h.feedback.structure}</Typography>
                           <Typography>Grammar: {h.feedback.grammar}</Typography>
                           {h.feedback.technical != null && <Typography>Technical: {h.feedback.technical}</Typography>}
                           <Typography sx={{ mt: 1 }}>Suggestions: {h.feedback.suggestions}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            </>
          )}
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default History;
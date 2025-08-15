import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
  Stack,
  Divider,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import LottieMic from '../components/LottieMic';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

// Backend URL
const API_URL = 'https://prepmateai.onrender.com';

// Dark theme
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
    h6: { fontWeight: 500 },
  },
});

// Simple placeholder FeedbackGauge
const FeedbackGauge = ({ label, score }) => (
  <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
    <Typography variant="subtitle1">{label}</Typography>
    <Typography variant="h5">{score ?? '-'}</Typography>
  </Paper>
);

const Practice = () => {
  const [category, setCategory] = useState('HR');
  const [question, setQuestion] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const { transcript, isRecording, start: startRecording, stop: stopRecording } = useSpeechToText({
    onStop: () => {
      if (timerId) clearInterval(timerId);
    },
  });

  const getToken = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userObject = JSON.parse(userString);
        if (userObject?.token) return userObject.token;
      }
    } catch (e) {
      console.error("Error parsing 'user' from localStorage:", e);
    }
    return localStorage.getItem('userToken') || null;
  };

  const start = () => {
    setTimer(0);
    startRecording();
    const id = setInterval(() => setTimer(prev => prev + 1), 1000);
    setTimerId(id);
  };

  const stop = () => {
    stopRecording();
    if (timerId) clearInterval(timerId);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const fetchQuestion = async (selectedCategory) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication Error. Please log in again.');
      setIsLoadingQuestion(false);
      return;
    }

    setIsLoadingQuestion(true);
    setQuestion(null);
    setFeedback(null);

    try {
      const { data } = await axios.get(`${API_URL}/api/questions/random/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load a new question.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    if (category) fetchQuestion(category);
  }, [category]);

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return toast.error('Authentication Error. Please log in again.');
    if (!transcript) return toast.error('Your answer is empty!');
    if (!question) return toast.error('No question loaded!');

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const { data } = await axios.post(`${API_URL}/api/ai/analyze`, {
        category: question.category,
        question: question.text,
        answerTranscript: transcript,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(data.feedback);
      toast.success('AI evaluation complete!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'AI evaluation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 240 }}
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Behavioral">Behavioral</MenuItem>
            </TextField>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {/* Question Box */}
            <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
              <Paper sx={{ p: 3, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom>The Question</Typography>
                {isLoadingQuestion ? (
                  <Stack spacing={1}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Stack>
                ) : (
                  <Typography variant="h6" sx={{ minHeight: '100px' }}>
                    {question?.text || 'No question available.'}
                  </Typography>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Divider sx={{ my: 3 }} />
                <Stack direction="column" alignItems="center" spacing={2}>
                  <Stack direction="row" spacing={2} sx={{ height: '80px', alignItems: 'center' }}>
                    <LottieMic isRecording={isRecording} />
                    {isRecording && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Typography variant="h4" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
                          {formatTime(timer)}
                        </Typography>
                      </motion.div>
                    )}
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<MicIcon />}
                    onClick={isRecording ? stop : start}
                    disabled={isLoadingQuestion}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Answer Box */}
            <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
              <Paper sx={{ p: 3, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom>Your Answer</Typography>
                <TextField
                  multiline
                  fullWidth
                  variant="outlined"
                  value={transcript}
                  placeholder="Your recorded answer will appear here..."
                  InputProps={{ readOnly: true }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={isSubmitting || !transcript}
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  Analyze My Answer
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <AnimatePresence>
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Paper sx={{ p: 4, borderRadius: 4, mt: 4 }}>
                  <Typography variant="h4" align="center" gutterBottom>AI Feedback Report</Typography>
                  <Grid container spacing={4} justifyContent="center">
                    <Grid item><FeedbackGauge label="Clarity" score={feedback.clarity} /></Grid>
                    <Grid item><FeedbackGauge label="Structure" score={feedback.structure} /></Grid>
                    <Grid item><FeedbackGauge label="Grammar" score={feedback.grammar} /></Grid>
                    {feedback.technical != null && <Grid item><FeedbackGauge label="Technical" score={feedback.technical} /></Grid>}
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TipsAndUpdatesIcon color="primary" />
                    <Typography variant="h6">Suggestions for Improvement:</Typography>
                  </Stack>
                  <Typography sx={{ mt: 1, pl: 5, whiteSpace: 'pre-wrap' }}>
                    {feedback.suggestions}
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Practice;

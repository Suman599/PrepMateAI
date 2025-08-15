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

  // --- Robust token extraction ---
  const getToken = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj?.token) return userObj.token;
      }
    } catch (e) {
      console.error("Error reading token from 'user' in localStorage:", e);
    }
    // Fallback
    const token = localStorage.getItem('userToken');
    return token ? token : null;
  };

  // Start/Stop recording
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
  const formatTime = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- Fetch question ---
  const fetchQuestion = async (selectedCategory) => {
    const token = getToken();
    setIsLoadingQuestion(true);
    setQuestion(null);
    setFeedback(null);

    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      setIsLoadingQuestion(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/questions/random/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(data);
    } catch (err) {
      console.error("Error fetching question:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to load question.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    if (category) fetchQuestion(category);
  }, [category]);

  // --- Submit answer ---
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return toast.error('Authentication token not found. Please log in.');
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
      console.error("Error submitting answer:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'AI evaluation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- WRAPPED RETURN STATEMENT IN THEMEPROVIDER ---
  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <TextField
              select
              label="Category"
              id="practice-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 240, '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.95)', '&:hover': { backgroundColor: '#FFFFFF' }, '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' }, '&:hover fieldset': { borderColor: 'primary.main' } }, '& .MuiSelect-select': { color: '#1c2025' }, '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' } }}
              SelectProps={{ MenuProps: { PaperProps: { sx: { backgroundColor: '#ffffff', color: '#1c2025' } } } }}
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Behavioral">Behavioral</MenuItem>
            </TextField>
          </Box>

          {/* We make the boxes larger by setting a minimum height on their container */}
<Grid container spacing={4} alignItems="stretch" sx={{ minWidth: '95vw' }}>
  {/* Left Column: Question & Controls */}
  <Grid container spacing={2} alignItems="stretch">
  {/* Question Box */}
  <Grid item xs={12} md={5} sx={{ minWidth: '35vw',display: 'flex' }}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,   // <-- makes it stretch to match sibling
      }}
    >
      <Typography variant="h5" gutterBottom>The Question</Typography>
      {isLoadingQuestion ? (
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
      ) : (
        <Typography variant="h6" color="text.secondary" sx={{ minHeight: '100px' }}>
          {question?.text || 'No question available for this category.'}
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }} /> {/* Push controls to bottom */}
      <Divider sx={{ my: 3 }} />
      <Stack direction="column" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ height: '80px' }}>
          <LottieMic isRecording={isRecording} />
          {isRecording && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="h4" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
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
          sx={{ width: '200px' }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </Stack>
    </Paper>
  </Grid>

  {/* Answer Box */}
  <Grid item xs={12} md={7} sx={{ minWidth: '35vw' ,minHeight:'65vh', display:'flex' }}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,  // <-- stretch to match question box
      }}
    >
      <Typography variant="h5" gutterBottom>Your Answer</Typography>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={transcript}
        placeholder="Your recorded answer will appear here..."
        InputProps={{ readOnly: true }}
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            height: '100%',
            backgroundColor: 'background.default',
          },
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        disabled={isSubmitting || !transcript}
        onClick={handleSubmit}
        sx={{ mt: 2, color: 'background.default' }}
      >
        Analyze My Answer
      </Button>
    </Paper>
  </Grid>
</Grid>

</Grid>
          
          <AnimatePresence>
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Paper sx={{ p: 4, borderRadius: 4, mt: 4 }}>
                  <Typography variant="h4" align="center" gutterBottom>AI Feedback Report</Typography>
                  <Grid container spacing={4} justifyContent="center" sx={{ my: 3 }}>
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
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1, pl: 5, whiteSpace: 'pre-wrap' }}>
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
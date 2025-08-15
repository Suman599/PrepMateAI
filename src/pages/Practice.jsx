import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Paper, Typography, Button, TextField, Box, Grid,
  CircularProgress, Stack, Divider, MenuItem
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
import Skeleton from '@mui/material/Skeleton';

const API_URL = process.env.REACT_APP_API_URL;

// --- DARK THEME DEFINITION ---
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
  const timerIdRef = useRef(null);

  const { transcript, isRecording, start: startRecording, stop: stopRecording } = useSpeechToText({
    onStop: () => clearInterval(timerIdRef.current),
  });

  // --- TOKEN RETRIEVAL ---
  const getToken = () => {
    // Assume you store JWT in localStorage under 'token'
    return localStorage.getItem('token');
  };

  const start = () => {
    setTimer(0);
    startRecording();
    timerIdRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
  };

  const stop = () => {
    stopRecording();
    clearInterval(timerIdRef.current);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // --- FETCH QUESTION ---
  const fetchQuestion = async (selectedCategory) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication error. Please log in again.');
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
      toast.error(err.response?.data?.message || 'Failed to load a new question.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchQuestion(category);
    return () => clearInterval(timerIdRef.current);
  }, [category]);

  // --- SUBMIT ANSWER ---
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return toast.error('Authentication error. Please log in again.');
    if (!transcript) return toast.error('Your answer is empty!');
    if (!question) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/ai/analyze`,
        {
          category: question.category,
          question: question.text,
          answerTranscript: transcript,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback(data.feedback);
      toast.success('AI evaluation complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI evaluation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {/* ... All your existing UI code remains unchanged ... */}
    </ThemeProvider>
  );
};

export default Practice;

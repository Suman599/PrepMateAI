import React from 'react';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { motion } from 'framer-motion';

const MicButton = ({ isRecording, onStart, onStop }) => {
  return (
    <motion.div
      animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
      transition={{ repeat: Infinity, duration: 1 }}
      style={{ display: 'inline-block' }}
    >
      <IconButton
        color={isRecording ? 'secondary' : 'primary'}
        onClick={isRecording ? onStop : onStart}
        sx={{ fontSize: 50 }}
      >
        <MicIcon fontSize="inherit" />
      </IconButton>
    </motion.div>
  );
};

export default MicButton;

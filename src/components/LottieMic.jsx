import React from 'react';
import Lottie from 'lottie-react';
import micAnimation from '../assets/mic.json'; 

const LottieMic = ({ isRecording }) => {
  return (
    <div style={{ width: 100, height: 100 }}>
      <Lottie 
        animationData={micAnimation} 
        loop={true} 
        autoplay={isRecording}
      />
    </div>
  );
};

export default LottieMic;

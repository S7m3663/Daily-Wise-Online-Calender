// src/pages/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import Logo from '../assets/logo/logo.ico';

const Welcome = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login'); 
  };

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <img src={Logo} alt="logo" className="logo" />
        <p className="welcome-text">
          Hayatınızı daha düzenli ve üretken yaşamaya kararlıysanız DailyWise'a hoşgeldiniz.
          Gününüzü saatlere bölerek, etiketlerle gruplayarak planlamaya başlayın.
        </p>
        <button className="welcome-button" onClick={handleStart}>
          BAŞLA →
        </button>
      </div>
    </div>
  );
};

export default Welcome;

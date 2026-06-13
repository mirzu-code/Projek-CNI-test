import { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Wait longer to let the beautiful ZUS-style animation finish
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    const removeTimer = setTimeout(() => {
      onFinished();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinished]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="zus-animation-container">
          <svg className="circle-sketch" width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="106" stroke="#ffffff" strokeWidth="6" fill="transparent" className="sketch-path" />
          </svg>
          <div className="logo-image-wrapper">
            <img src="/Lembayung Image.jpeg" alt="Lembayung Logo" className="logo-image-fill" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

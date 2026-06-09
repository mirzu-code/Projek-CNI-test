import { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 2.5 seconds, then trigger fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Completely remove the splash screen after fade out transition (500ms)
    const removeTimer = setTimeout(() => {
      onFinished();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinished]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content animate-zoom-in">
        <div className="sketch-container">
          <img src="/rembayung_sketch.png" alt="Lembayung Store Sketch" className="sketch-image" />
        </div>
        <h1 className="splash-title">LEMBAYUNG</h1>
        <p className="splash-subtitle">A Culinary Heritage Store</p>
        <div className="splash-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

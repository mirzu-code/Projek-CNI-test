import { useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinished }) => {
  useEffect(() => {
    // Show splash screen for exactly 2.5 seconds before transitioning to the app
    const timer = setTimeout(() => {
      onFinished();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo-circle-container">
          <img src="/Lembayung Image.jpeg" alt="Lembayung Logo" className="logo-image-circle" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

import { useState, useEffect, useRef } from 'react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element using the downloaded MP3
    audioRef.current = new Audio('/hotel_lobby.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Soft background volume

    // Try to auto-play (browsers will likely block this until interaction)
    const attemptAutoplay = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log('Autoplay blocked, waiting for user interaction');
      }
    };

    attemptAutoplay();

    // Listen for any interaction to trigger play if it was blocked
    const handleFirstInteraction = () => {
      if (!hasInteracted && !isPlaying && audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log('Playback failed', e));
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted, isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation(); // Prevent triggering the global interaction listener
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Could not play audio", err));
    }
  };

  return (
    <div className="music-player-container">
      <div className="music-status-tooltip">
        {isPlaying ? 'Lobby Music: On' : 'Lobby Music: Off'}
      </div>
      <button 
        className="music-toggle-btn" 
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <div className={`sound-waves ${!isPlaying ? 'paused' : ''}`}>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </button>
    </div>
  );
};

export default BackgroundMusic;

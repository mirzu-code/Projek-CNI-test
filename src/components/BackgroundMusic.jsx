import { useEffect, useRef, useState } from 'react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioData = useRef(null);

  useEffect(() => {
    return () => {
      if (audioData.current) {
        audioData.current.oscs.forEach((osc) => osc.stop());
        audioData.current.lfo.stop();
        audioData.current.context.close();
      }
    };
  }, []);

  const startAudio = async () => {
    if (isPlaying || !window.AudioContext) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(context.destination);

    const chord = [220, 277.18, 329.63];
    const oscs = chord.map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? 'sine' : index === 1 ? 'triangle' : 'sawtooth';
      oscillator.frequency.value = frequency;
      oscillator.connect(masterGain);
      oscillator.start();
      return oscillator;
    });

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.09;
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();

    audioData.current = { context, oscs, lfo, lfoGain, masterGain };
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (!audioData.current) return;
    audioData.current.oscs.forEach((osc) => osc.stop());
    audioData.current.lfo.stop();
    audioData.current.context.close();
    audioData.current = null;
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }
    startAudio();
  };

  return (
    <button type="button" className="background-music-button" onClick={toggleAudio}>
      {isPlaying ? 'Stop Background Music' : 'Play Background Music'}
    </button>
  );
};

export default BackgroundMusic;

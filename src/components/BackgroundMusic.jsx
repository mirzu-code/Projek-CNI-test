import { useEffect, useRef, useState } from 'react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioData = useRef(null);

  useEffect(() => {
    const attemptAutoplay = async () => {
      try {
        await startAudio();
      } catch (err) {
        // Browsers may block autoplay; user can still unmute/play manually.
      }
    };

    attemptAutoplay();

    return () => {
      if (audioData.current) {
        audioData.current.oscs.forEach((osc) => osc.stop());
        audioData.current.modulators.forEach((mod) => mod.stop());
        if (audioData.current.noise) {
          audioData.current.noise.stop();
        }
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
    masterGain.gain.value = isMuted ? 0 : 0.03;
    masterGain.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    filter.connect(masterGain);

    const padFrequencies = [110, 138.59, 164.81];
    const oscs = padFrequencies.map((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(filter);
      oscillator.start();
      return oscillator;
    });

    const slowLfo = context.createOscillator();
    slowLfo.type = 'sine';
    slowLfo.frequency.value = 0.08;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 0.015;
    slowLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    slowLfo.start();

    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }
    noise.buffer = buffer;
    noise.loop = true;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.005;
    noise.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    await context.resume();

    audioData.current = {
      context,
      oscs,
      modulators: [slowLfo],
      masterGain,
      filter,
      noise,
    };
    setIsPlaying(true);
    setIsMuted(false);
  };

  const updateMute = (mute) => {
    if (!audioData.current) {
      return;
    }
    audioData.current.masterGain.gain.value = mute ? 0 : 0.03;
    setIsMuted(mute);
  };

  const toggleAudio = async () => {
    if (!isPlaying) {
      await startAudio();
      return;
    }

    updateMute(!isMuted);
  };

  const icon = isPlaying && !isMuted ? '🔊' : '🔇';
  const label = isPlaying && !isMuted ? 'Mute background music' : 'Unmute background music';

  return (
    <button
      type="button"
      className="background-music-button"
      onClick={toggleAudio}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
};

export default BackgroundMusic;

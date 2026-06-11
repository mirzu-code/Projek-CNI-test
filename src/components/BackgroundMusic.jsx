import { useEffect, useRef, useState } from 'react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioData = useRef(null);

  useEffect(() => {
    const attemptAutoplay = async () => {
      try {
        await startAudio();
      } catch (err) {
        // Browser blocked autoplay; user can still toggle mute/unmute.
      }
    };

    attemptAutoplay();

    return () => {
      if (audioData.current) {
        audioData.current.oscs.forEach((osc) => osc.stop());
        audioData.current.modulators?.forEach((mod) => mod.stop());
        if (audioData.current.melodyInterval) {
          clearInterval(audioData.current.melodyInterval);
        }
        if (audioData.current.noise) {
          audioData.current.noise.stop();
        }
        audioData.current.context.close();
      }
    };
  }, []);

  const startAudio = async () => {
    if (audioData.current || !window.AudioContext) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const masterGain = context.createGain();
    masterGain.gain.value = isMuted ? 0 : 0.02;
    masterGain.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.2;
    filter.connect(masterGain);

    const chord = [110, 138.59, 164.81, 220];
    const oscs = chord.map((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      const gainNode = context.createGain();
      gainNode.gain.value = 0.015;
      oscillator.connect(gainNode);
      gainNode.connect(filter);
      oscillator.start();
      return oscillator;
    });

    const slowLfo = context.createOscillator();
    slowLfo.type = 'sine';
    slowLfo.frequency.value = 0.06;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 180;
    slowLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    slowLfo.start();

    const melody = context.createOscillator();
    melody.type = 'sine';
    melody.frequency.value = 329.63;
    const melodyGain = context.createGain();
    melodyGain.gain.value = 0.01;
    melody.connect(melodyGain);
    melodyGain.connect(masterGain);
    melody.start();

    const melodyNotes = [329.63, 293.66, 261.63, 246.94, 293.66, 329.63];
    let melodyIndex = 0;
    const melodyInterval = setInterval(() => {
      melody.frequency.setValueAtTime(melodyNotes[melodyIndex], context.currentTime);
      melodyIndex = (melodyIndex + 1) % melodyNotes.length;
    }, 2800);

    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.01;
    }
    noise.buffer = buffer;
    noise.loop = true;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.0025;
    noise.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    await context.resume();

    audioData.current = {
      context,
      oscs,
      melody,
      noise,
      modulators: [slowLfo],
      masterGain,
      melodyInterval,
    };
  };

  const toggleMute = async () => {
    if (!audioData.current) {
      await startAudio();
      return;
    }

    const nextMuted = !isMuted;
    audioData.current.masterGain.gain.value = nextMuted ? 0 : 0.02;
    setIsMuted(nextMuted);
  };

  const icon = isMuted ? '🔇' : '🔊';
  const label = isMuted ? 'Unmute background music' : 'Mute background music';

  return (
    <button
      type="button"
      className="background-music-button"
      onClick={toggleMute}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
};

export default BackgroundMusic;

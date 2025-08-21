import { useEffect, useRef, useState } from 'react';
import { isPhone } from '../components/VolumeTogglePhone';

interface UseAmbientAudioOptions {
  autoPlay?: boolean;
  loop?: boolean;
  fadeInDuration?: number;
}

export const useAmbientAudio = (
  audioSrc: string, 
  options: UseAmbientAudioOptions = {}
) => {
  const {
    autoPlay = false,
    loop = true,
    fadeInDuration = 2000
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const fadeIntervalRef = useRef<NodeJS.Timeout>();



  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.volume = 0; // Start with 0 volume for fade-in effect
    audio.preload = 'auto';
    audioRef.current = audio;

    // Initial play/pause logic for mobile and desktop
    if (typeof window !== 'undefined' && isPhone()) {
      const muted = localStorage.getItem('thock-muted');
      if (muted !== 'true' && autoPlay) {
        play();
      }
    } else if (autoPlay) {
      play();
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc, loop, autoPlay]);

  // Load volume from localStorage and apply it (scaled to 75% max)
  useEffect(() => {
    const savedVolume = localStorage.getItem('thock-volume');
    const targetVolume = savedVolume ? (parseFloat(savedVolume) / 100) * 0.75 : 0.3825; // 51% * 0.75
    setVolume(targetVolume);
  }, []);

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Smooth transition to new volume
        const audio = audioRef.current;
        const startVolume = audio.volume;
        const targetVol = volume;
        const steps = 20;
        const stepSize = (targetVol - startVolume) / steps;
        let currentStep = 0;

        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }

        fadeIntervalRef.current = setInterval(() => {
          currentStep++;
          audio.volume = Math.max(0, Math.min(1, startVolume + (stepSize * currentStep)));
          
          if (currentStep >= steps) {
            audio.volume = targetVol;
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
        }, 50);
      } else {
        audioRef.current.volume = volume;
      }
    }
  }, [volume, isPlaying]);

  // Listen for volume changes from localStorage (from VolumeControl)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'thock-volume' && e.newValue) {
        setVolume((parseFloat(e.newValue) / 100) * 0.75); // Scale to 75% max
      }
    };

    // Also listen for manual localStorage updates within the same tab
    const handleVolumeUpdate = () => {
      const savedVolume = localStorage.getItem('thock-volume');
      if (savedVolume) {
        setVolume((parseFloat(savedVolume) / 100) * 0.75); // Scale to 75% max
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('thock-volume-change', handleVolumeUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('thock-volume-change', handleVolumeUpdate);
    };
  }, []);

  // Listen for mute changes (must be after play/pause are defined)
  useEffect(() => {
    const handleMuteChange = () => {
      const muted = localStorage.getItem('thock-muted') === 'true';
      if (typeof window !== 'undefined' && isPhone() && audioRef.current) {
        if (muted) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          play();
        }
      }
    };
    window.addEventListener('thock-mute-change', handleMuteChange);
    return () => window.removeEventListener('thock-mute-change', handleMuteChange);
  }, []);

  const play = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        
        // Fade in effect
        const audio = audioRef.current;
        audio.volume = 0;
        const targetVol = volume;
        const steps = Math.floor(fadeInDuration / 50);
        const stepSize = targetVol / steps;
        let currentStep = 0;

        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }

        fadeIntervalRef.current = setInterval(() => {
          currentStep++;
          audio.volume = Math.min(targetVol, stepSize * currentStep);
          
          if (currentStep >= steps) {
            audio.volume = targetVol;
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
        }, 50);
        
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Auto-play on first user interaction
  useEffect(() => {
    if (autoPlay) {
      const handleFirstInteraction = () => {
        if (typeof window !== 'undefined' && isPhone()) {
          const muted = localStorage.getItem('thock-muted');
          if (muted !== 'true') {
            play();
          }
        } else {
          play();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, [autoPlay]);

  return {
    play,
    pause,
    toggle,
    isPlaying,
    volume: volume * 100, // Return as percentage
    setVolume: (vol: number) => setVolume(vol / 100) // Accept as percentage
  };
};

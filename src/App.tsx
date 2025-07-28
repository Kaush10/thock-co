import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { KeyboardsPage } from './pages/KeyboardsPage';
import { BuildServicePage } from './pages/BuildServicePage';
import { AboutPage } from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage'; // Import the new ArticlePage
import { useAmbientAudio } from './hooks/useAmbientAudio';
import './styles/globals.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('thock-theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark
  });

  // Initialize ambient audio with mysterious synth vibes
  const ambientAudio = useAmbientAudio(
    // Local "Spaces" track - mysterious synth ambient
    '/audio/Spaces.mp3',
    { 
      autoPlay: true, 
      loop: true,
      fadeInDuration: 3000 
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    // Set theme variables on body directly for instant CSS var switching (CodePen style)
    const themeVars = isDark
      ? {
          '--c-glass': '#bbbbbc',
          '--c-light': '#fff',
          '--c-dark': '#000',
          '--c-content': '#e1e1e1',
          '--c-action': '#03d5ff',
          '--c-bg': '#1b1b1d',
          '--glass-reflex-dark': '2',
          '--glass-reflex-light': '0.3',
          '--saturation': '150%'
        }
      : {
          '--c-glass': '#bbbbbc',
          '--c-light': '#fff',
          '--c-dark': '#000',
          '--c-content': '#224',
          '--c-action': '#0052f5',
          '--c-bg': '#E8E8E9',
          '--glass-reflex-dark': '1',
          '--glass-reflex-light': '1',
          '--saturation': '150%'
        };

    Object.entries(themeVars).forEach(([key, value]) => {
      body.style.setProperty(key, value);
    });

    // Safari repaint hack: force a full reflow
    // 1. Toggle a dummy class
    body.classList.add('theme-repaint-hack');
    // 2. Force layout read
    void body.offsetHeight;
    // 3. Toggle display property
    const originalDisplay = body.style.display;
    body.style.display = 'none';
    // Force a reflow
    void body.offsetHeight;
    body.style.display = originalDisplay;
    setTimeout(() => {
      body.classList.remove('theme-repaint-hack');
    }, 50);

    // Save theme preference to localStorage
    localStorage.setItem('thock-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/keyboards" element={<KeyboardsPage />} />
            <Route path="/keyboards/:slug" element={<ArticlePage />} />
            <Route path="/build-service" element={<BuildServicePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
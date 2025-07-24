import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { KeyboardsPage } from './pages/KeyboardsPage';
import { BuildServicePage } from './pages/BuildServicePage';
import { AboutPage } from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage'; // Import the new ArticlePage
import './styles/globals.css';

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
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
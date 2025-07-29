import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { KeyboardsPage } from './pages/KeyboardsPage';
import { BuildServicePage } from './pages/BuildServicePage';
import { AboutPage } from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage'; // Import the new ArticlePage
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import './styles/globals.css';


function AppContent() {
  const { isDark, setIsDark, music, themeVars } = useSiteConfig();

  // Initialize ambient audio with config
  useAmbientAudio(music.src, music);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    // Remove both classes from both elements
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    // Add correct class to both elements
    const themeClass = isDark ? 'dark' : 'light';
    root.classList.add(themeClass);
    body.classList.add(themeClass);
    Object.entries(themeVars).forEach(([key, value]) => {
      body.style.setProperty(key, value);
    });
    // Safari repaint hack
    body.classList.add('theme-repaint-hack');
    void body.offsetHeight;
    const originalDisplay = body.style.display;
    body.style.display = 'none';
    void body.offsetHeight;
    body.style.display = originalDisplay;
    setTimeout(() => {
      body.classList.remove('theme-repaint-hack');
    }, 50);
    localStorage.setItem('thock-theme', themeClass);
  }, [isDark, themeVars]);

  const handleThemeToggle = () => setIsDark(!isDark);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />
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

export default function App() {
  return (
    <SiteConfigProvider>
      <AppContent />
    </SiteConfigProvider>
  );
}


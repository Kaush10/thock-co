import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';

// Pages other than the homepage load on first visit. The build service page
// alone pulls in three.js for its globe.
const KeyboardsPage = lazy(() => import('./pages/KeyboardsPage').then((m) => ({ default: m.KeyboardsPage })));
const BuildServicePage = lazy(() => import('./pages/BuildServicePage').then((m) => ({ default: m.BuildServicePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { PageWipe } from './components/PageWipe';
import { RouteMeta } from './components/RouteMeta';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/globals.css';


function AppContent() {
  const { isDark, setIsDark, themeVars } = useSiteConfig();

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
      <PageWipe isDark={isDark} />
      <RouteMeta />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />
        {/* Only apply overflow-x-hidden to content below hero on homepage */}
        <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} overflowXHiddenClass="overflow-x-hidden-except-hero" />} />
          <Route path="/keyboards" element={<KeyboardsPage />} />
          <Route path="/keyboards/:slug" element={<ArticlePage />} />
          <Route path="/build-service" element={<BuildServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        <ConditionalFooter />
      </div>
    </Router>
  );
}

function ConditionalFooter() {
  const location = useLocation();
  if (location.pathname === '/') return null;
  return <Footer />;
}

export default function App() {
  return (
    <SiteConfigProvider>
      <AppContent />
    </SiteConfigProvider>
  );
}


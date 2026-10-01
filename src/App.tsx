import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';

// Pages other than the homepage load on first visit. The build service page
// alone pulls in three.js for its globe.
const KeyboardsPage = lazy(() => import('./pages/KeyboardsPage').then((m) => ({ default: m.KeyboardsPage })));
const CommissionsPage = lazy(() => import('./pages/CommissionsPage').then((m) => ({ default: m.CommissionsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { siteConfig } from './config/siteConfig';
import { PageWipe } from './components/PageWipe';
import { RouteMeta } from './components/RouteMeta';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/globals.css';


function AppContent() {
  const { isDark } = useSiteConfig();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    document.body.classList.add('dark');
    Object.entries(siteConfig.theme.vars).forEach(([key, value]) => document.body.style.setProperty(key, value));
    localStorage.removeItem('thock-theme');
  }, []);

  return (
    <Router>
      <PageWipe isDark={isDark} />
      <RouteMeta />
      <ScrollToTop />
      <a href="#main" className="skip-link">skip to content</a>
      <div className="min-h-screen flex flex-col">
        <Navbar isDark={isDark} />
        {/* Only apply overflow-x-hidden to content below hero on homepage */}
        <main id="main" className="flex-1">
        <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} overflowXHiddenClass="overflow-x-hidden-except-hero" />} />
          <Route path="/builds" element={<KeyboardsPage />} />
          <Route path="/builds/:slug" element={<ArticlePage />} />
          <Route path="/commissions" element={<CommissionsPage />} />
          {/* Old addresses from when the site was a build service */}
          <Route path="/keyboards" element={<Navigate to="/builds" replace />} />
          <Route path="/keyboards/:slug" element={<OldBuildRedirect />} />
          <Route path="/build-service" element={<Navigate to="/commissions" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </main>
        <ConditionalFooter />
      </div>
    </Router>
  );
}

function OldBuildRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/builds/${slug}`} replace />;
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


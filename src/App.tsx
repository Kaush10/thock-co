import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { KeyboardsPage } from './pages/KeyboardsPage';
import { BuildServicePage } from './pages/BuildServicePage';
import { AboutPage } from './pages/AboutPage';
import './styles/globals.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} isDark={isDark} />;
      case 'keyboards':
        return <KeyboardsPage />;
      case 'build-service':
        return <BuildServicePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onPageChange={handlePageChange} isDark={isDark} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      <Footer onPageChange={handlePageChange} />
    </div>
  );
}

export default App;
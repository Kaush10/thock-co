import React, { createContext, useContext, useState, useMemo } from 'react';
import { siteConfig } from '../config/siteConfig';

interface SiteConfigContextProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  music: typeof siteConfig.music;
  themeVars: Record<string, string>;
}

const SiteConfigContext = createContext<SiteConfigContextProps | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('thock-theme');
    return savedTheme ? savedTheme === 'dark' : siteConfig.theme.default === 'dark';
  });

  const themeVars = useMemo(
    () => (isDark ? siteConfig.theme.darkVars : siteConfig.theme.lightVars),
    [isDark]
  );

  const value = useMemo(
    () => ({ isDark, setIsDark, music: siteConfig.music, themeVars }),
    [isDark, themeVars]
  );

  return (
    <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
  );
};

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return ctx;
}

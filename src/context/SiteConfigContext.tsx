import React, { createContext, useContext } from 'react';

// The site is dark-only for now. Components still read `isDark` so a light
// theme can come back later without touching each of them.
const SiteConfigContext = createContext({ isDark: true });

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SiteConfigContext.Provider value={{ isDark: true }}>{children}</SiteConfigContext.Provider>
);

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

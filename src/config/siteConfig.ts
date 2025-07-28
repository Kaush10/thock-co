// Centralized site-wide configuration for thock&co

export const siteConfig = {
  music: {
    src: '/audio/Spaces.mp3',
    autoPlay: true,
    loop: true,
    fadeInDuration: 3000,
    volume: 0.6,
  },
  theme: {
    default: 'dark',
    darkVars: {
      '--c-glass': '#bbbbbc',
      '--c-light': '#fff',
      '--c-dark': '#000',
      '--c-content': '#e1e1e1',
      '--c-action': '#03d5ff',
      '--c-bg': '#1b1b1d',
      '--glass-reflex-dark': '2',
      '--glass-reflex-light': '0.3',
      '--saturation': '150%'
    },
    lightVars: {
      '--c-glass': '#bbbbbc',
      '--c-light': '#fff',
      '--c-dark': '#000',
      '--c-content': '#224',
      '--c-action': '#0052f5',
      '--c-bg': '#E8E8E9',
      '--glass-reflex-dark': '1',
      '--glass-reflex-light': '1',
      '--saturation': '150%'
    }
  },
  // Add more global config as needed
};

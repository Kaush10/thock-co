// Site-wide settings for thock&co.

export const siteConfig = {
  contact: {
    instagram: 'kaushrajesh',
    email: 'kaushrajesh04@gmail.com',
  },
  /**
   * Commission status, shown as two lamps. The inbox is always open; the bench
   * is "full" when you aren't taking builds and "open" when you are.
   */
  bench: 'full' as 'full' | 'open',
  theme: {
    vars: {
      '--c-glass': '#bbbbbc',
      '--c-light': '#fff',
      '--c-dark': '#000',
      '--c-content': '#e1e1e1',
      '--c-action': '#03d5ff',
      '--c-bg': '#1b1b1d',
      '--glass-reflex-dark': '2',
      '--glass-reflex-light': '0.3',
      '--saturation': '150%',
    },
  },
};

export const instagramUrl = `https://instagram.com/${siteConfig.contact.instagram}`;
export const emailUrl = `mailto:${siteConfig.contact.email}`;

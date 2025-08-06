// Pricing and service data for all tiers and layouts
export const LAYOUTS = [
  { key: '60', label: '60-65%' },
  { key: '75', label: '75%-TKL' },
  { key: 'full', label: 'full-size' },
  { key: 'custom', label: 'special' }
];

export const TIERS = [
  {
    key: 'essentials',
    label: 'The Essentials',
    description: 'Perfecting individual components or providing modifications to an existing keyboard.',
    payment: 'Upfront for service fee.',
    services: [
      {
        category: 'switches',
        items: [
          { name: 'Standard Lubing', price: { all: '$0.75 / switch' } },
          { name: 'Lubing + Filming', price: { all: '$1.00 / switch' }, details: 'Prices are the same for all layouts.' }
        ]
      },
      {
        category: 'stabilizers',
        items: [
          { name: 'Stabilizer Tuning', price: { all: '$15 / set' } },
          { name: 'Stabilizer Replacement & Tuning', price: { all: '$40 / set' }, details: 'Prices are the same for all layouts.' }
        ]
      },
      {
        category: 'desoldering',
        items: [
          { name: 'Desoldering Service', price: {
            '60': '$40',
            '75': '$50',
            'full': '$60',
            'custom': 'Contact'
          }, details: 'Price varies by layout.' }
        ]
      },
      {
        category: 'Foam Mods',
        items: [
          { name: 'Case Foam Installation', price: {
            '60': '$20', '75': '$20', 'full': '$30', 'custom': 'Contact' }},
          { name: 'PCB-Plate Foam Installation', price: {
            '60': '$25', '75': '$25', 'full': '$40', 'custom': 'Contact' }},
          { name: 'PE Foam Mod', price: {
            '60': '$30', '75': '$40', 'full': '$50', 'custom': 'Contact' }},
          { name: 'Tape Mod', price: {
            '60': '$15', '75': '$15', 'full': '$20', 'custom': 'Contact' }, details: 'Price varies by layout.' }
        ]
      }
    ]
  },
  {
    key: 'craft',
    label: 'The Craft',
    description: 'Bringing all components together into a cohesive, perfectly assembled, and tuned custom keyboard.',
    payment: 'Upfront for service fee.',
    services: [
      {
        category: 'Assembly',
        items: [
          { name: 'Hotswap Assembly', price: { all: '$75' } },
          { name: 'Soldered Assembly', price: {
            '60': '$100', '75': '$100', 'full': '$125', 'custom': 'Contact' }, details: 'Standard: $100; Full-size: $125.' }
        ]
      }
    ]
  },
  {
    key: 'vision',
    label: 'The Vision',
    description: 'The ultimate personalized experience. From initial concept to a fully optimized keyboard, I handle everything.',
    payment: '50% upfront deposit, remaining 50% upon completion.',
    services: [
      {
        category: 'Comprehensive Build',
        items: [
          { name: 'Full Custom Build & Optimization', price: { all: '$200 - $400 (labor & curation fee) + cost of all parts' }, details: 'Fee determined by project complexity, sourcing, and mods.' }
        ]
      }
    ]
  }
];

export const GENERAL_INFO = [
  { icon: 'truck', label: 'Shipping', value: 'Client is responsible for shipping costs (both ways). Please ensure all parts are securely packaged.' },
  { icon: 'clock', label: 'Turnaround', value: 'Tier 1 & 2: 3-7 business days after parts received. Tier 3: 2-4 weeks (or longer if sourcing rare parts).' },
  { icon: 'award', label: 'Quality Assurance', value: 'Every build undergoes rigorous testing for functionality, acoustics, and aesthetics.' }
];

export const FAQ = [
  {
    q: 'How long does a build take?',
    a: 'Tier 1 & 2: 3-7 business days after all parts are received. Tier 3: 2-4 weeks or longer if sourcing rare parts.'
  },
  {
    q: 'Do you provide switches and keycaps?',
    a: 'Tier 1 & 2: You provide all parts. Tier 3: I provide recommendations and handle sourcing as part of the service.'
  },
  {
    q: `What’s included in the full build service?`,
    a: 'Tier 2: Expert assembly of your provided components (hotswap or soldered) and complimentary basic stabilizer tuning. Tier 3: Everything from consultation and sourcing to all-inclusive modding and quality assurance.'
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, but clients are responsible for all shipping costs (both ways) and any customs duties, taxes, or import fees.'
  },
  {
    q: `What if I'm new to custom keyboards?`,
    a: `Perfect! I specialize in guiding newcomers through the process. I'll help you understand all the options and make informed choices to build your ideal keyboard.`
  },
  {
    q: 'What kind of sound profiles can you achieve?',
    a: 'I can help you achieve a wide range of sound profiles, from deep "thocky" and "creamy" to crisp "clacky" or quiet "silent" builds.'
  },
  {
    q: 'Can I get updates during the build process?',
    a: 'Yes, I provide regular updates throughout the build process, especially for comprehensive commissions. Progress photos or videos available upon request.'
  }
];

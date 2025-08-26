import React, { useEffect, useState } from 'react';
// Returns 'dark' or 'light' based on current system or browser theme
function getCurrentTheme() {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';
// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;



import { LAYOUTS, TIERS, FAQ } from '../lib/pricingData';
import { PricingInfoSwitcherCard } from '../components/PricingInfoSwitcherCard';
import { FAQCard } from '../components/FAQCard';
import { CheckCircle, Truck, Clock, Award } from 'lucide-react';
import { AlertTriangle, Lock } from 'lucide-react';
import '../components/KeyboardPageCard.css';
import { Check, MessageCircle, Phone, Instagram, ChevronDown } from 'lucide-react';
import { VerticalGallery } from '../components/VerticalGallery';
import { GlobeBanner } from '../components/GlobeBanner';

export const BuildServicePage: React.FC = () => {
  // Commission status logic
  const COMMISSION_STATUSES = [
    {
      key: 'open',
      label: 'open',
      color: '#22c55e', // green
  icon: <CheckCircle className="w-5 h-5 align-middle" color="#22c55e" />
    },
    {
      key: 'limited',
      label: 'limited',
      color: '#f59e42', // orange
  icon: <AlertTriangle className="w-5 h-5 align-middle" color="#f59e42" />
    },
    {
      key: 'closed',
      label: 'closed',
      color: '#ef4444', // red
  icon: <Lock className="w-5 h-5 align-middle" color="#ef4444" />
    }
  ];

  // Change this index to display a different status:
  const currentCommissionStatusIdx = 1; // 0=open, 1=limited, 2=closed
  const currentCommissionStatus = COMMISSION_STATUSES[currentCommissionStatusIdx];
  // Theme-aware gradient for hero section
  const [theme, setTheme] = useState(getCurrentTheme());
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const [activeContact, setActiveContact] = useState<string | null>(null);



  const { handleCardClick } = useGlassCardEffect();

  // Initialize VanillaTilt on all .k-card-container elements
  useEffect(() => {
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (typeof VanillaTilt !== 'undefined') {
      if (isTouchDevice) {
        // On mobile: disable all tilt and clickback
        VanillaTilt.init(document.querySelectorAll('.k-card-container'), {
          max: 0, // disables tilt and clickback
          speed: 500,
          perspective: 1800,
          glare: false,
          scale: 1.0,
          reset: true,
          reverse: true
        });
        // TODO: Add custom mobile tap/click animation here if desired
      } else {
        // On desktop: normal settings (or your preferred values)
        VanillaTilt.init(document.querySelectorAll('.k-card-container'), {
          max: 3.25, // 25% of original
          speed: 500,
          perspective: 1800,
          glare: true,
          "max-glare": 0.05, // 25% of original glare
          scale: 1.00125, // 25% of original scale
          reset: true,
          reverse: true
        });
      }
    }
  }, []);

  const contactMethods = [
    {
      id: 'sms',
      icon: MessageCircle,
      label: 'SMS',
      info: 'send an sms to: +1-217-555-0123'
    },
    {
      id: 'phone',
      icon: Phone,
      label: 'Phone',
      info: 'call: +1-217-555-0123'
    },
    {
      id: 'instagram',
      icon: Instagram,
      label: 'Instagram',
      info: 'dm us on instagram: @thockandco'
    }
  ];







  const handleContactHover = (contactId: string) => {
    setActiveContact(contactId);
  };

  const handleContactLeave = () => {
    setActiveContact(null);
  };




  // Ref and state for hero text height
  const heroTextRef = React.useRef<HTMLDivElement>(null);
  const [heroTextHeight, setHeroTextHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function updateHeight() {
      if (heroTextRef.current) {
        setHeroTextHeight(heroTextRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="build-service-page overflow-x-hidden">
      <div className="min-h-screen pb-16">
        {/* Hero Section - Safe width, no overflow */}
        <section className="w-full relative mb-0" style={{zIndex: 2, position: 'relative'}}>
            <div
              className="w-full bg-gradient-to-br overflow-hidden px-4 md:px-16 py-16 flex flex-col md:flex-row items-center gap-10 min-h-[320px]"
              style={{
                background: `linear-gradient(135deg, var(--hero-gradient-from) 0%, var(--hero-gradient-to) 100%)`
              }}
            >
              <div className="flex-1 flex flex-col justify-center" ref={heroTextRef}>
                <h1
                  className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
                  style={{ fontFamily: 'Matrix Sans Print, sans-serif', color: '#fff' }}
                >
                  Custom Keyboard Build Service
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold opacity-90 mb-6 max-w-xl" style={{ color: '#fff' }}>
                  Currently based in <br />
                  <span className="underline">Urbana-Champaign, IL</span>
                </h2>
                {/* Commission status removed from hero section */}
              </div>
              {window.innerWidth >= 768 && (
                <div
                  className="flex justify-center items-center"
                  style={{
                    height: heroTextHeight ? `${Math.round(heroTextHeight * 0.7)}px` : undefined,
                    width: heroTextHeight ? `${Math.round(heroTextHeight * 0.7)}px` : '100%',
                    minHeight: '300px',
                    minWidth: '300px',
                    flex: 'none',
                    transition: 'height 0.2s, width 0.2s',
                  }}
                >
                  <GlobeBanner containerHeight={heroTextHeight ? Math.round(heroTextHeight * 0.7) : heroTextHeight}
                    containerWidth={heroTextHeight ? Math.round(heroTextHeight * 0.7) : undefined}
                  />
                </div>
              )}
            </div>
              {/* Screenwide border to separate hero from cards below */}
              <div className="w-full h-2 bg-gradient-to-r from-interactive to-transparent" />
            </section>

        {/* Padding between hero and cards section */}
        <div className="h-10 md:h-16" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Desktop: Left 1/3, Right 2/3. Mobile: stacked (to be reworked later) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: 1/3 width on desktop */}
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              {/* Vertical Gallery: only visible in left column for lg and up */}
              <div className="hidden lg:block">
                <VerticalGallery />
              </div>
              {/* Notes */}
              <div className="k-card-container fade-in-up" style={{ boxShadow: 'none' }} onClick={handleCardClick} data-tilt>
                <div className="k-card-content-area">
                  <h3 className="text-xl font-semibold accent-text mb-4">notes</h3>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>
                      each build is carefully crafted with attention to detail. i focus on creating the perfect 
                      typing experience based on your preferences and use case.
                    </p>
                    <p>
                      quality materials, precise assembly, and thorough testing ensure your keyboard will 
                      provide years of exceptional performance.
                    </p>
                    <p>
                      from sound dampening to switch lubing, every modification is done to enhance your 
                      typing experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 2/3 width on desktop */}
            <div className="space-y-8 lg:col-span-2 order-1 lg:order-2">

              {/* Commission Status */}
              <div
                className="fade-in-up mb-4 px-8 py-6 rounded-[2.5rem] flex items-center justify-center w-full text-center gap-3"
                style={{
                  background: 'color-mix(in srgb, var(--c-glass) 12%, transparent)',
                  backdropFilter: 'blur(8px) saturate(var(--saturation))',
                  WebkitBackdropFilter: 'blur(8px) saturate(var(--saturation))',
                  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent), inset 1.8px 3px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent), inset -2px -2px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent), inset -3px -8px 1px -6px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent), inset -0.3px -1px 4px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 12%), transparent), inset -1.5px 2.5px 0px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), inset 0px 3px 4px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), inset 2px -6.5px 1px -4px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 0px 1px 5px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 0px 6px 16px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent)',
                  width: '100%',
                }}
              >
                <span className="text-xl font-semibold" style={{ color: 'var(--c-content)', letterSpacing: '0.01em' }}>
                  commission status: <span style={{ color: currentCommissionStatus.color, display: 'inline-flex', alignItems: 'center' }}>
                    {currentCommissionStatus.label}
                    <span style={{ marginLeft: '0.35em' }}>{currentCommissionStatus.icon}</span>
                  </span>
                </span>
              </div>

              {/* Pricing & Info (glass toggle restored via PricingInfoSwitcherCard) */}
              <div className="k-card-container fade-in-up no-shimmer">
                <div className="k-card-content-area">
                  <PricingInfoSwitcherCard />
                </div>
              </div>

              {/* How to Get Started */}
              <div className="k-card-container fade-in-up" style={{ boxShadow: 'none' }} onClick={handleCardClick} data-tilt>
                <div className="k-card-content-area">
                  <h3 className="text-xl font-semibold accent-text mb-4">how to get started</h3>
                  <p className="text-sm mb-6">
                    let's chat!
                  </p>
                  <div className="flex items-center justify-center gap-6 mb-6">
                    {contactMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <div
                          key={method.id}
                          className="relative"
                          onMouseEnter={() => handleContactHover(method.id)}
                          onMouseLeave={handleContactLeave}
                        >
                          <button className="p-3 rounded-lg glass-button hover:bg-interactive/20 transition-colors">
                            <IconComponent className="w-6 h-6" />
                          </button>
                          {activeContact === method.id && (
                            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-20">
                              {method.info}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center mb-4">
                    <a href="mailto:info@thockandco.com" className="text-interactive hover:underline">
                      al.ka@thockandco.com
                    </a>
                  </div>
                  <p className="text-center text-sm opacity-80">
                    build service form is still in development, so please reach out to me directly through the highlighted methods
                  </p>
                </div>
              </div>

              {/* Vertical Gallery: only visible below lg, below How to Get Started, above FAQ */}
              <div className="block lg:hidden">
                <VerticalGallery />
              </div>

              {/* FAQ Card (now includes general info at top, with glass/parallax effects) */}
              <div className="k-card-container fade-in-up" style={{ boxShadow: 'none' }} onClick={handleCardClick} data-tilt>
                <div className="k-card-content-area">
                  <FAQCard />
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HorizontalCarousel Component ---

// --- HorizontalCarousel Component ---please re
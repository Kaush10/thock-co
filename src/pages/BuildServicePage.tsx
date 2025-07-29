import React, { useEffect, useState } from 'react';
import { useGlassCardEffect } from '../hooks/useGlassCardEffect';
// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;



import { LAYOUTS, TIERS, FAQ } from '../lib/pricingData';
import { PricingInfoSwitcherCard } from '../components/PricingInfoSwitcherCard';
import { FAQCard } from '../components/FAQCard';
import { CheckCircle, Truck, Clock, Award } from 'lucide-react';
import { LiquidButton } from '../components/LiquidButton';
import '../components/KeyboardPageCard.css';
import { Check, MessageCircle, Phone, Instagram, ChevronDown } from 'lucide-react';
import { VerticalGallery } from '../components/VerticalGallery';

export const BuildServicePage: React.FC = () => {
  const [activeContact, setActiveContact] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    keyboardModel: '',
    switchPreference: '',
    budgetRange: '',
    additionalDetails: ''
  });

  // Remove dynamic pricing card state (handled by PricingInfoSwitcherCard)
  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { handleCardClick } = useGlassCardEffect();

  // Initialize VanillaTilt on all .k-card-container elements
  useEffect(() => {
    if (typeof VanillaTilt !== 'undefined') {
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
    // No cleanup needed; cards are static on this page
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



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ...existing code...
    // Handle form submission
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="build-service-page">
      <div className="min-h-screen pb-16">
        {/* Wide Screen Hero Section - Full Bleed, now at very top */}
        <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-0">
            <div className="w-[100vw] bg-gradient-to-br from-[#181c24] to-[#23283a] overflow-hidden px-4 md:px-16 py-16 flex flex-col md:flex-row items-center gap-10 min-h-[320px]">
              <div className="flex-1 flex flex-col justify-center">
                <h1
                  className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
                  style={{ fontFamily: 'Matrix Sans Print, sans-serif', color: '#fff' }}
                >
                  Custom Keyboard Build Service
                </h1>
                <p className="text-lg md:text-2xl opacity-80 mb-6 max-w-xl">
                  <span style={{ color: '#fff' }}>Handcrafted mechanical keyboards, built to your specs. Urbana-Champaign, IL & worldwide.</span>
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-lg font-semibold" style={{ color: '#fff' }}>commission status: <span className="text-green-400">open</span></span>
                </div>
              </div>
              <div className="flex-1 flex justify-center items-center">
                {/* (gallery removed from hero section) */}
              </div>
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
              {/* 3D Vertical Gallery */}
              <div className="hidden md:block">
                <VerticalGallery />
              </div>
              {/* Optionally, show a static preview or fallback on mobile */}
              <div className="block md:hidden w-full h-40 bg-black/20 rounded-xl flex items-center justify-center border-2 border-white/10">
                <span className="text-white/40 text-lg">[ Gallery Preview ]</span>
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
                className="fade-in-up mb-4 px-8 py-6 rounded-[2.5rem] flex items-center gap-3 w-full"
                style={{
                  background: 'color-mix(in srgb, var(--c-glass) 12%, transparent)',
                  backdropFilter: 'blur(8px) saturate(var(--saturation))',
                  WebkitBackdropFilter: 'blur(8px) saturate(var(--saturation))',
                  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent), inset 1.8px 3px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent), inset -2px -2px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent), inset -3px -8px 1px -6px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent), inset -0.3px -1px 4px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 12%), transparent), inset -1.5px 2.5px 0px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), inset 0px 3px 4px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), inset 2px -6.5px 1px -4px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 0px 1px 5px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 0px 6px 16px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent)',
                  width: '100%',
                }}
              >
                <Check className="w-6 h-6 text-green-400" />
                <span className="text-xl font-semibold" style={{ color: 'var(--c-content)', letterSpacing: '0.01em' }}>commission status: open</span>
              </div>




              {/* Pricing & Info (glass toggle restored via PricingInfoSwitcherCard) */}
              <div className="k-card-container fade-in-up no-shimmer">
                <div className="k-card-content-area">
                  <PricingInfoSwitcherCard />
                </div>
              </div>

              {/* FAQ Card (now includes general info at top, with glass/parallax effects) */}
              <div className="k-card-container fade-in-up" style={{ boxShadow: 'none' }} onClick={handleCardClick} data-tilt>
                <div className="k-card-content-area">
                  <FAQCard />
                </div>
              </div>

              {/* How to Get Started */}
            <div className="k-card-container fade-in-up" style={{ boxShadow: 'none' }} onClick={handleCardClick} data-tilt>
              <div className="k-card-content-area">
                <h3 className="text-xl font-semibold accent-text mb-4">how to get started</h3>
                <p className="text-sm mb-6">
                  shoot me an email at al.ka.......@gmail.com, or use the form below if you prefer.
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
                  <a href="mailto:al.ka@thockandco.com" className="text-interactive hover:underline">
                    al.ka@thockandco.com
                  </a>
                </div>
                <p className="text-center text-sm opacity-80">
                  shy? no worries. start a form
                </p>
              </div>
            </div>

              {/* Build Request Form */}
            <div className="k-card-container fade-in-up" style={{ boxShadow: 'none' }} onClick={handleCardClick} data-tilt>
              <div className="k-card-content-area">
                <h3 className="text-xl font-semibold accent-text mb-6">build request form</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="your name"
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-interactive focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your email"
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-interactive focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">keyboard model</label>
                    <input
                      type="text"
                      name="keyboardModel"
                      value={formData.keyboardModel}
                      onChange={handleInputChange}
                      placeholder="e.g., tofu65, kbd67 lite, etc."
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-interactive focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">switch preference</label>
                      <select
                        name="switchPreference"
                        value={formData.switchPreference}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-interactive focus:outline-none"
                      >
                        <option value="">select type</option>
                        <option value="linear">linear</option>
                        <option value="tactile">tactile</option>
                        <option value="clicky">clicky</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">budget range</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-interactive focus:outline-none"
                      >
                        <option value="">select range</option>
                        <option value="100-200">$100-200</option>
                        <option value="200-300">$200-300</option>
                        <option value="300+">$300+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">additional details</label>
                    <textarea
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                      placeholder="tell me about your ideal typing experience, any specific requirements, etc."
                      rows={4}
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-interactive focus:outline-none resize-none"
                    />
                  </div>
                  <LiquidButton className="w-full text-center py-3">
                    submit request
                  </LiquidButton>
                </form>
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

// --- HorizontalCarousel Component ---
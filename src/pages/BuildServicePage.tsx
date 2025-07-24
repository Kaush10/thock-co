import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { LiquidButton } from '../components/LiquidButton';
import { Check, MessageCircle, Phone, Instagram, ChevronDown, Keyboard } from 'lucide-react';

export const BuildServicePage: React.FC = () => {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    keyboardModel: '',
    switchPreference: '',
    budgetRange: '',
    additionalDetails: ''
  });

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

  const pricingItems = [
    { service: 'full build service', price: '$150-200' },
    { service: 'assembly only', price: '$100-125' },
    { service: 'switch lubing', price: '$50-75' },
    { service: 'stabilizer tuning', price: '$25-40' },
    { service: 'foam modding', price: '$20-35' },
    { service: 'tape mod', price: '$15-25' }
  ];

  const faqItems = [
    {
      id: 'timeline',
      question: 'how long does a build take?',
      answer: 'typical builds take 2-3 weeks from start to finish, depending on complexity and current queue. rush orders available for additional fee.'
    },
    {
      id: 'switches',
      question: 'do you provide switches and keycaps?',
      answer: 'we can source switches and keycaps for you, or you can provide your own. we work with all major switch manufacturers and keycap vendors.'
    },
    {
      id: 'service',
      question: 'what\'s included in the full build service?',
      answer: 'full build includes assembly, switch lubing, stabilizer tuning, foam modding, and comprehensive testing. detailed photos provided throughout the process.'
    },
    {
      id: 'shipping',
      question: 'do you ship internationally?',
      answer: 'yes, we ship worldwide. international shipping costs vary by location. all builds are carefully packaged and insured.'
    }
  ];

  const galleryImages = [
    'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const handleContactHover = (contactId: string) => {
    setActiveContact(contactId);
  };

  const handleContactLeave = () => {
    setActiveContact(null);
  };

  const handleFaqToggle = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <GlassCard className="p-8 mb-12 fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--secondary-accent)' }}>
              <Keyboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold accent-text page-header">
                custom keyboard build service
              </h1>
              <p className="text-lg opacity-80 mt-2">
                currently located: urbana-champaign, il
              </p>
            </div>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-interactive to-transparent rounded"></div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Keyboard Gallery */}
            <GlassCard className="p-6 fade-in-up">
              <h2 className="text-2xl font-semibold accent-text mb-6">keyboard gallery</h2>
              <div className="space-y-4">
                {galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`keyboard build ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
              <p className="text-sm opacity-70 mt-4 text-center">
                sliding image gallery pulled from keyboards
              </p>
            </GlassCard>

            {/* Notes */}
            <GlassCard className="p-6 fade-in-up">
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
            </GlassCard>

            <div className="text-center">
              <p className="text-lg accent-text">or contact me</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Commission Status */}
            <GlassCard className="p-6 fade-in-up">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-400" />
                <span className="text-xl font-semibold">commission status: open</span>
              </div>
            </GlassCard>

            {/* Pricing & Info */}
            <GlassCard className="p-6 fade-in-up">
              <h3 className="text-xl font-semibold accent-text mb-6">pricing & info</h3>
              <div className="space-y-3">
                {pricingItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm">{item.service}</span>
                    <span className="text-sm font-semibold text-interactive">{item.price}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* How to Get Started */}
            <GlassCard className="p-6 fade-in-up">
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
            </GlassCard>

            {/* Build Request Form */}
            <GlassCard className="p-6 fade-in-up">
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
            </GlassCard>

            {/* FAQ */}
            <GlassCard className="p-6 fade-in-up">
              <h3 className="text-xl font-semibold accent-text mb-6">frequently asked questions</h3>
              <div className="space-y-3">
                {faqItems.map((faq) => (
                  <div key={faq.id} className="border-b border-white/10 last:border-b-0">
                    <button
                      onClick={() => handleFaqToggle(faq.id)}
                      className="w-full flex items-center justify-between py-3 text-left hover:text-interactive transition-colors"
                    >
                      <span className="text-sm font-medium">{faq.question}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          openFaq === faq.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {openFaq === faq.id && (
                      <div className="pb-3">
                        <p className="text-sm opacity-80 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
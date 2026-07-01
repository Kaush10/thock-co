import React, { useState } from 'react';
import { FAQ, GENERAL_INFO } from '../lib/pricingData';
import { CheckCircle, Truck, Clock, Award, ChevronDown } from 'lucide-react';

export const FAQCard: React.FC = () => {
  const ICONS: Record<string, React.ReactNode> = {
    'check-circle': <CheckCircle className="inline w-4 h-4" />,
    'truck':        <Truck        className="inline w-4 h-4" />,
    'clock':        <Clock        className="inline w-4 h-4" />,
    'award':        <Award        className="inline w-4 h-4" />,
  };
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <>
      <h3 className="text-xl font-semibold accent-text mb-4">Frequently Asked Questions</h3>
      {/* Info boxes */}
      <div className="flex flex-col gap-3 mb-6">
        {GENERAL_INFO.map((info) => (
          <div
            key={info.label}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span style={{ color: 'var(--interactive-highlight)', flexShrink: 0, marginTop: 2 }}>
              {ICONS[info.icon]}
            </span>
            <div className="flex items-center justify-between w-full gap-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--interactive-highlight)' }}>
                {info.label}
              </span>
              <span className="text-sm opacity-75 text-right">{info.value}</span>
            </div>
          </div>
        ))}
      </div>
      <ul className="divide-y divide-white/10">
        {FAQ.map((item, idx) => (
          <li key={item.q} className="py-3">
            <button
              className={`flex items-center w-full text-left text-sm font-semibold focus:outline-none transition-colors ${openIdx === idx ? 'text-interactive' : 'text-theme-body'} hover:text-interactive`}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
              aria-controls={`faq-answer-${idx}`}
            >
              <span className="flex-1 text-theme-body">{item.q}</span>
              <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div id={`faq-answer-${idx}`} className="mt-2 text-xs text-theme-body animate-fade-in">
                {item.a}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

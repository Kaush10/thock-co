import React, { useState } from 'react';
import { FAQ, GENERAL_INFO } from '../lib/pricingData';
import { CheckCircle, Truck, Clock, Award, ChevronDown } from 'lucide-react';

export const FAQCard: React.FC = () => {
  const ICONS: Record<string, React.ReactNode> = {
    'check-circle': <CheckCircle className="inline w-5 h-5 mr-2 text-green-400 dark:text-green-300" />,
    'truck': <Truck className="inline w-5 h-5 mr-2 text-blue-400 dark:text-blue-300" />,
    'clock': <Clock className="inline w-5 h-5 mr-2 text-yellow-400 dark:text-yellow-300" />,
    'award': <Award className="inline w-5 h-5 mr-2 text-pink-400 dark:text-pink-300" />,
  };
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <>
      <h3 className="text-xl font-semibold accent-text mb-4">Frequently Asked Questions</h3>
      {/* General Info content below heading, themed */}
      <ul className="space-y-3 mb-6">
        {GENERAL_INFO.map((info) => (
          <li key={info.label} className="flex items-start gap-2">
            <span>{ICONS[info.icon]}</span>
            <span className="text-sm font-semibold text-interactive">{info.label}:</span>
            <span className="text-sm text-theme-body">{info.value}</span>
          </li>
        ))}
      </ul>
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

import React, { useState } from 'react';
import { FAQ } from '../lib/pricingData';
import { ChevronDown } from 'lucide-react';

export const FAQCard: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="glass-card p-5 w-full max-w-xl mx-auto mt-8 mb-4">
      <h3 className="text-lg font-bold mb-4 text-center text-interactive">Frequently Asked Questions</h3>
      <ul className="divide-y divide-white/10">
        {FAQ.map((item, idx) => (
          <li key={item.q} className="py-3">
            <button
              className="flex items-center w-full text-left text-sm font-semibold text-white/90 focus:outline-none"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <span className="flex-1">{item.q}</span>
              <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="mt-2 text-xs text-white/70 animate-fade-in">
                {item.a}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

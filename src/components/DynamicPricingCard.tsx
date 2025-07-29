import React, { useState } from 'react';
import { LAYOUTS, TIERS } from '../lib/pricingData';
import { CheckCircle, Truck, Clock, Award } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  'check-circle': <CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />,
  'truck': <Truck className="inline w-5 h-5 mr-2 text-blue-400" />,
  'clock': <Clock className="inline w-5 h-5 mr-2 text-yellow-400" />,
  'award': <Award className="inline w-5 h-5 mr-2 text-pink-400" />,
};

export const DynamicPricingCard: React.FC = () => {
  const [tierIdx, setTierIdx] = useState(0);
  const [layoutKey, setLayoutKey] = useState(LAYOUTS[0].key);
  const tier = TIERS[tierIdx];

  return (
    <div className="glass-card p-6 w-full max-w-2xl mx-auto transition-all duration-500">
      {/* Tier Switcher */}
      <div className="flex justify-center mb-4 gap-2">
        {TIERS.map((t, i) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${i === tierIdx ? 'bg-interactive text-white' : 'bg-white/10 text-interactive'}`}
            onClick={() => setTierIdx(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Layout Slider */}
      <div className="flex justify-center mb-6 gap-2">
        {LAYOUTS.map((l) => (
          <button
            key={l.key}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${layoutKey === l.key ? 'bg-interactive text-white border-interactive' : 'bg-white/10 text-interactive border-white/20'}`}
            onClick={() => setLayoutKey(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      {/* Tier Description */}
      <div className="mb-4 text-center text-base opacity-80">
        {tier.description}
      </div>
      {/* Services */}
      <div className="space-y-6">
        {tier.services.map((cat) => (
          <div key={cat.category}>
            <h4 className="text-interactive text-sm font-bold mb-2 uppercase tracking-wide">{cat.category}</h4>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li key={item.name} className="flex justify-between items-center bg-white/5 rounded px-3 py-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="font-mono text-xs">
                    {item.price[layoutKey as keyof typeof item.price] || item.price['all'] || 'Contact'}
                  </span>
                </li>
              ))}
            </ul>
            {cat.items.some((item) => item.details) && (
              <ul className="mt-1 ml-2 text-xs text-gray-400 list-disc">
                {cat.items.filter((item) => item.details).map((item) => (
                  <li key={item.name + '-details'}>{item.details}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {/* Payment Info */}
      <div className="mt-6 text-xs text-center text-gray-400">
        {tier.payment}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TierSwitcherGlass } from './TierSwitcherGlass';

const tierData = [
  {
    name: 'Basic',
    price: '$99',
    features: [
      'Essential build service',
      'Standard lube & tune',
      'Basic troubleshooting',
    ],
  },
  {
    name: 'Standard',
    price: '$149',
    features: [
      'All Basic features',
      'Stabilizer tuning',
      'Sound dampening',
    ],
  },
  {
    name: 'Premium',
    price: '$199',
    features: [
      'All Standard features',
      'Full mod consultation',
      'Priority support',
    ],
  },
];

export const PricingInfoSwitcherCard: React.FC = () => {
  const [tier, setTier] = useState(0);
  const current = tierData[tier];

  return (
    <div>
      <TierSwitcherGlass value={tier} onChange={setTier} className="mb-6" />
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-lg font-semibold">{current.name}</span>
          <span className="text-lg font-bold text-interactive">{current.price}</span>
        </div>
        <ul className="list-disc pl-6 text-sm">
          {current.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

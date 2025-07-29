import { useState } from 'react';
import { TierSwitcherGlass } from './TierSwitcherGlass';
import { TIERS, LAYOUTS } from '../lib/pricingData';

// Map old toggle indices to new tier keys
const TIER_INDEX_MAP = [
  'essentials', // basic
  'craft',      // standard
  'vision',     // premium
];


export const PricingInfoSwitcherCard: React.FC = () => {
  const [tierIdx, setTierIdx] = useState(0); // 0: basic, 1: standard, 2: premium
  const [layoutKey, setLayoutKey] = useState(LAYOUTS[0].key);
  const [categoryIdx, setCategoryIdx] = useState(0); // for Essentials tier only
  const tier = TIERS.find(t => t.key === TIER_INDEX_MAP[tierIdx]);

  if (!tier) return null;

  // Only show category toggle for Essentials (index 0)
  const showCategoryToggle = tier.key === 'essentials' && tier.services.length > 1;
  const activeCategory = showCategoryToggle ? tier.services[categoryIdx] : null;

  return (
    <div>
      <TierSwitcherGlass value={tierIdx} onChange={(idx) => { setTierIdx(idx); setCategoryIdx(0); }} className="mb-6" />
      {/* ...existing code... */}
      {/* Category Toggle for Essentials */}
      {showCategoryToggle && (
        <div className="flex justify-center mb-4 gap-2">
          {tier.services.map((cat, idx) => (
            <button
              key={cat.category}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${categoryIdx === idx ? 'bg-interactive text-white border-interactive' : 'bg-white/10 text-interactive border-white/20'}`}
              onClick={() => setCategoryIdx(idx)}
            >
              {cat.category}
            </button>
          ))}
        </div>
      )}
      {/* Tier Title and Description */}
      <div className="flex justify-between items-center py-2 border-b border-white/10">
        <h3 className="text-lg font-semibold m-0 p-0">{tier.label}</h3>
        {/* No single price, so show payment info or leave blank */}
        <span className="text-xs font-bold text-interactive">{tier.payment}</span>
      </div>
      <div className="mb-2 text-center text-base opacity-80">{tier.description}</div>
      {/* Services */}
      <div className="space-y-6">
        {showCategoryToggle
          ? activeCategory && (
              <div key={activeCategory.category}>
                <h4 className="text-interactive text-sm font-bold mb-2 uppercase tracking-wide">{activeCategory.category}</h4>
                <ul className="space-y-1">
                  {activeCategory.items.map((item) => (
                    <li key={item.name} className="flex justify-between items-center bg-white/5 rounded px-3 py-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="font-mono text-xs">
                        {item.price[layoutKey as keyof typeof item.price] || item.price['all'] || 'Contact'}
                      </span>
                    </li>
                  ))}
                </ul>
                {activeCategory.items.some((item) => item.details) && (
                  <ul className="mt-1 ml-2 text-xs text-gray-400 list-disc">
                    {activeCategory.items.filter((item) => item.details).map((item) => (
                      <li key={item.name + '-details'}>{item.details}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          : tier.services.map((cat) => (
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
      {/* Layout Slider (moved to bottom) */}
      <div className="flex justify-center mt-6 gap-2">
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
    </div>
  );
};

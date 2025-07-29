import { useState } from 'react';
import { TierSwitcherGlass } from './TierSwitcherGlass';
import { TIERS, LAYOUTS } from '../lib/pricingData';
import { LayoutSwitcherGlass } from './LayoutSwitcherGlass';

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

  // Essentials toggle bar styled as subheadings, all toggles on one line, font size matches subheading
  const essentialsToggleBar = showCategoryToggle ? (
    <div className="flex w-full justify-between items-center mb-2 px-1 pt-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
      {tier.services.map((cat, idx) => {
        let style: React.CSSProperties = {
          fontFamily: 'Reddit Mono, monospace',
          fontSize: '0.9rem', // match subheading font size
          letterSpacing: '0.08em',
          border: 'none',
          background: categoryIdx === idx ? 'var(--interactive-highlight)' : 'none',
          color: categoryIdx === idx ? '#fff' : 'var(--interactive-highlight)',
          boxShadow: categoryIdx === idx ? '0 2px 12px rgba(255,62,191,0.15)' : 'none',
          cursor: 'pointer',
          margin: '0 0.5rem',
          transition: 'background 0.2s, color 0.2s',
          whiteSpace: 'nowrap',
          flex: 1,
        };
        if (idx === 0) {
          style.alignSelf = 'flex-start';
          style.marginLeft = 0;
          style.flexBasis = '0';
          style.flexGrow = 0;
        } else if (idx === tier.services.length - 1) {
          style.alignSelf = 'flex-end';
          style.marginRight = 0;
          style.flexBasis = '0';
          style.flexGrow = 0;
        } else {
          style.flexGrow = 1;
          style.flexBasis = 'auto';
        }
        return (
          <button
            key={cat.category}
            className={`switcher__label font-bold tracking-wide uppercase transition-colors px-2 py-1 rounded-md ${categoryIdx === idx ? 'bg-interactive text-white' : 'text-interactive bg-transparent'}`}
            style={style}
            onClick={() => setCategoryIdx(idx)}
          >
            {cat.category}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div>
      <TierSwitcherGlass value={tierIdx} onChange={(idx) => { setTierIdx(idx); setCategoryIdx(0); }} className="mb-6" />
      {/* Tier Title and Description (always above toggle bar) */}
      <div className="flex justify-between items-center py-2 border-b border-white/10">
        <h3 className="text-lg font-semibold m-0 p-0">{tier.label}</h3>
        {/* No single price, so show payment info or leave blank */}
        <span className="text-xs font-bold text-interactive">{tier.payment}</span>
      </div>
      <div className="mb-6 text-center text-base opacity-80">{tier.description}</div>
      {/* Essentials toggle bar as subheading (always below title/desc) */}
      <div className="mb-2">{essentialsToggleBar}</div>
      {/* Services */}
      <div className="space-y-6 mb-8">
        {showCategoryToggle
          ? activeCategory && (
              <div key={activeCategory.category}>
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
      {/* Layout Switcher Glass (compact glass toggle) */}
      <div className="flex justify-center mt-6">
        <LayoutSwitcherGlass
          value={LAYOUTS.findIndex(l => l.key === layoutKey)}
          onChange={idx => setLayoutKey(LAYOUTS[idx].key)}
        />
      </div>
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { TierSwitcherGlass } from './TierSwitcherGlass';
import { TIERS, LAYOUTS } from '../lib/pricingData';
import { LayoutSwitcherGlass } from './LayoutSwitcherGlass';
import React from 'react';

// Map old toggle indices to new tier keys
const TIER_INDEX_MAP = [
  'essentials', // basic
  'craft',      // standard
  'vision',     // premium
];


export const PricingInfoSwitcherCard: React.FC = () => {
  // Animate maxHeight for smooth expand/contract with bounce
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [pendingHeight, setPendingHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const [tierIdx, setTierIdx] = useState(0); // 0: basic, 1: standard, 2: premium
  const [layoutKey, setLayoutKey] = useState(LAYOUTS[0].key);
  const [categoryIdx, setCategoryIdx] = useState(0); // for Essentials tier only
  // Callback ref to measure height before update
  const measureRef = (node: HTMLDivElement | null) => {
    if (node) {
      setPendingHeight(node.getBoundingClientRect().height);
      contentRef.current = node;
    }
  };

  // Animate after DOM updates
  useEffect(() => {
    if (!contentRef.current) return;
    if (pendingHeight === undefined) return;
    const startHeight = pendingHeight;
    const targetHeight = contentRef.current.scrollHeight;
    setMaxHeight(startHeight);
    let startTime: number | null = null;
    const duration = 320;
    function animate(time: number) {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 1 ? 1 - Math.pow(1 - t, 2.2) : 1;
      const newHeight = startHeight + (targetHeight - startHeight) * ease;
      setMaxHeight(newHeight);
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setMaxHeight(targetHeight);
      }
    }
    requestAnimationFrame(animate);
  }, [pendingHeight, tierIdx, layoutKey, categoryIdx]);
  const tier = TIERS.find(t => t.key === TIER_INDEX_MAP[tierIdx]);

  if (!tier) return null;

  // Only show category toggle for Essentials (index 0)
  const showCategoryToggle = tier.key === 'essentials' && tier.services.length > 1;
  const activeCategory = showCategoryToggle ? tier.services[categoryIdx] : null;

  // Essentials toggle bar styled as subheadings, all toggles on one line, font size matches subheading
  const essentialsToggleBar = showCategoryToggle ? (
    <div
      className="w-full mb-2 px-1 pt-6"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}
    >
      <div
        className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-2 sm:gap-0"
      >
        {tier.services.map((cat, idx) => {
          // For 2x2 stacking, order: 0,1 top row; 2,3 bottom row
          // If you want a specific order, you can use order classes or inline style
          let style: React.CSSProperties = {
            fontFamily: 'Reddit Mono, monospace',
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            border: 'none',
            background: categoryIdx === idx ? 'var(--interactive-highlight)' : 'none',
            color: categoryIdx === idx ? '#fff' : 'var(--interactive-highlight)',
            boxShadow: categoryIdx === idx ? '0 2px 12px rgba(255,62,191,0.15)' : 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            whiteSpace: 'nowrap',
            width: '100%',
          };
          // Set order for mobile stacking: switches(0), stabs(1), desoldering(2), foam(3)
          let order = idx;
          if (idx === 2) order = 2; // desoldering
          if (idx === 3) order = 3; // foam
          return (
            <button
              key={cat.category}
              className={`switcher__label font-bold tracking-wide uppercase transition-colors px-2 py-2 rounded-sm ${categoryIdx === idx ? 'bg-interactive text-white' : 'text-interactive bg-transparent'}`}
              style={{ ...style, order }}
              onClick={() => setCategoryIdx(idx)}
            >
              {cat.category}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div
      className="pricing-expand-bounce"
      style={maxHeight ? { maxHeight, transition: 'max-height 0.32s cubic-bezier(.34,1.56,.64,1)' } : undefined}
    >
      <div ref={measureRef}>
        <TierSwitcherGlass value={tierIdx} onChange={(idx) => { setTierIdx(idx); setCategoryIdx(0); }} className="mb-6" />
        {/* Tier Title and Description (always above toggle bar) */}
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <h2 className="text-xl font-semibold m-0 p-0">{tier.label}</h2>
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
                      <li key={item.name} className="flex justify-between items-center bg-black/5 dark:bg-white/5 rounded px-3 py-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="font-mono text-xs">
                        {
                          item.price[layoutKey as keyof typeof item.price] !== undefined
                            ? item.price[layoutKey as keyof typeof item.price]
                            : (item.price as any)['all'] !== undefined
                              ? (item.price as any)['all']
                              : 'Contact'
                        }
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
                      <li key={item.name} className="flex justify-between items-center bg-black/5 dark:bg-white/5 rounded px-3 py-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="font-mono text-xs">
                        {
                          item.price[layoutKey as keyof typeof item.price] !== undefined
                            ? item.price[layoutKey as keyof typeof item.price]
                            : (item.price as any)['all'] !== undefined
                              ? (item.price as any)['all']
                              : 'Contact'
                        }
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
          {/* Grey out and disable layout switcher for switches and stabilizers in essentials */}
          {tier.key === 'essentials' && (tier.services[categoryIdx]?.category === 'switches' || tier.services[categoryIdx]?.category === 'stabilizers') ? (
            <div style={{ opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(1)', width: '100%', maxWidth: 'unset', overflow: 'visible', display: 'flex', justifyContent: 'center' }}>
              <LayoutSwitcherGlass
                value={LAYOUTS.findIndex(l => l.key === layoutKey)}
                onChange={() => {}} // no-op
                className="w-full"
              />
            </div>
          ) : (
            <LayoutSwitcherGlass
              value={LAYOUTS.findIndex(l => l.key === layoutKey)}
              onChange={idx => setLayoutKey(LAYOUTS[idx].key)}
            />
          )}
        </div>
      </div>
    </div>
  );
};





import { useState, useRef, useEffect } from 'react';

import './LayoutSwitcherGlass.css';
import { LAYOUTS } from '../lib/pricingData';

export const LayoutSwitcherGlass: React.FC<{
  value: number;
  onChange: (idx: number) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  const [previous, setPrevious] = useState(0);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    if (fieldsetRef.current) {
      fieldsetRef.current.setAttribute('c-previous', (previous + 1).toString());
    }
  }, [previous]);

  const handleChange = (idx: number) => {
    setPrevious(value);
    onChange(idx);
  };

  // Use labels from LAYOUTS in pricingData
  const labels = LAYOUTS.map(l => l.label);
  const N = labels.length;
  const widthPercent = 100 / N;
  const leftPercent = `${value * widthPercent}%`;

  return (
    <fieldset
      className={`switcher switcher--compact ${className}`}
      ref={fieldsetRef}
      style={{ width: '80%', maxWidth: 420, minWidth: 220, margin: '0 auto', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, minHeight: 0, height: 44 }}
    >
      <legend className="switcher__legend sr-only">Choose layout</legend>
      {/* Selector bubble is now handled by .switcher::after in CSS, no extra div needed */}
      {labels.map((label, idx) => (
        <label className="switcher__option" key={label}>
          <input
            className="switcher__input"
            type="radio"
            name="layout"
            value={idx}
            c-option={idx + 1}
            checked={value === idx}
            onChange={() => handleChange(idx)}
          />
          <span className="switcher__label" style={{ whiteSpace: 'nowrap' }}>{label}</span>
        </label>
      ))}
      <div className="switcher__filter">
        {/* SVG filters for glass effect, if needed, can be added here */}
      </div>
    </fieldset>
  );
};

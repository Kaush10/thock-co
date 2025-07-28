import { useState } from 'react';

interface TierSwitcherProps {
  tiers: string[];
  onChange?: (tierIndex: number) => void;
  className?: string;
}

const tierIcons = [
  // You can replace these SVGs with custom icons for each tier
  (
    <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" key="basic">
      <circle cx="18" cy="18" r="8" fill="var(--c)" />
    </svg>
  ),
  (
    <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" key="standard">
      <rect x="10" y="10" width="16" height="16" rx="4" fill="var(--c)" />
    </svg>
  ),
  (
    <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" key="premium">
      <polygon points="18,6 30,30 6,30" fill="var(--c)" />
    </svg>
  ),
];

export const TierSwitcher: React.FC<TierSwitcherProps> = ({ tiers, onChange, className = '' }) => {
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState(0);

  const handleChange = (idx: number) => {
    setPrevious(selected);
    setSelected(idx);
    if (onChange) onChange(idx);
  };

  return (
    <fieldset className={`switcher ${className}`} c-previous={previous + 1}>
      <legend className="switcher__legend">Choose tier</legend>
      {tiers.map((tier, idx) => (
        <label className="switcher__option" key={tier}>
          <input
            className="switcher__input"
            type="radio"
            name="tier"
            value={idx}
            c-option={idx + 1}
            checked={selected === idx}
            onChange={() => handleChange(idx)}
          />
          {tierIcons[idx]}
        </label>
      ))}
      <div className="switcher__filter">
        {/* SVG filters for glass effect, if needed, can be added here */}
      </div>
    </fieldset>
  );
};

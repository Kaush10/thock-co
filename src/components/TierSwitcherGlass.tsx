import { useState, useRef, useEffect } from 'react';
import { PencilRuler, PocketKnife, Eye } from 'lucide-react';

const tierIcons = [
  <PencilRuler className="switcher__icon" key="basic" />,
  <PocketKnife className="switcher__icon" key="standard" />,
  <Eye className="switcher__icon" key="premium" />,
];

const tierLabels = ['Basic', 'Standard', 'Premium'];

export const TierSwitcherGlass: React.FC<{
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

  return (
    <fieldset className={`switcher switcher--tier ${className}`} ref={fieldsetRef}>
      <legend className="switcher__legend">Choose tier</legend>
      {tierLabels.map((label, idx) => (
        <label className="switcher__option" key={label}>
          <input
            className="switcher__input"
            type="radio"
            name="tier"
            value={idx}
            c-option={idx + 1}
            checked={value === idx}
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

import React, { useEffect, useState } from 'react';
import './RotatingHeadline.css';

interface RotatingHeadlineProps {
  keywords: string[];
}

export const RotatingHeadline: React.FC<RotatingHeadlineProps> = ({ keywords }) => {
  const [current, setCurrent] = useState(0);
  const intervalMs = 1655; // Slower rotation

  useEffect(() => {
    setCurrent(0);
    if (!keywords || keywords.length !== 3) return;
    let timerId: number | undefined;

    // Set custom delay for the third word
    const thirdWordDelay = 4000; // ms, set manually as desired

    const nextWord = (idx: number) => {
      setCurrent(idx);
      const delay = idx === 2 ? thirdWordDelay : intervalMs;
      timerId = window.setTimeout(() => {
        nextWord((idx + 1) % 3);
      }, delay);
    };

    nextWord(0);

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [keywords]);

  return (
    <div className="rotatingText-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90 }}>
      {keywords && keywords.length > 0 ? (
        <span
          key={current}
          className={
            current === 2
              ? "rotatingText-adjective rotating-play rotating-play-long"
              : "rotatingText-adjective rotating-play"
          }
          style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
        >
          {keywords[current]}
        </span>
      ) : null}
    </div>
  );
};

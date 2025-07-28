import { useEffect, useRef } from 'react';

/**
 * useTiltCard - Custom hook for VanillaTilt and clickback effect on cards.
 * @param options - VanillaTilt options (optional)
 * @returns ref to attach to the card element
 */
export function useTiltCard<T extends HTMLElement = HTMLDivElement>(options?: Record<string, any>) {
  const cardRef = useRef<T>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    let tiltInstance: any;
    // Dynamically import VanillaTilt to avoid SSR issues
    import('vanilla-tilt').then(({ default: VanillaTilt }) => {
      VanillaTilt.init(cardRef.current!, {
        max: 12,
        speed: 400,
        glare: true,
        'max-glare': 0.18,
        scale: 1.04,
        ...options,
      });
      tiltInstance = cardRef.current!._vanillaTilt;
    });

    // Clickback effect
    const handleClick = () => {
      if (!cardRef.current) return;
      cardRef.current.classList.add('glass-card-shrink');
      setTimeout(() => {
        cardRef.current?.classList.remove('glass-card-shrink');
      }, 120);
    };
    cardRef.current.addEventListener('mousedown', handleClick);
    cardRef.current.addEventListener('touchstart', handleClick);

    return () => {
      if (tiltInstance) tiltInstance.destroy();
      cardRef.current?.removeEventListener('mousedown', handleClick);
      cardRef.current?.removeEventListener('touchstart', handleClick);
    };
  }, [options]);

  return cardRef;
}

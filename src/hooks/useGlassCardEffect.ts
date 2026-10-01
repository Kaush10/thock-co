import { useCallback, useRef } from 'react';
import type { TiltOptions } from 'vanilla-tilt';

// vanilla-tilt keeps its resolved options on `element.vanillaTilt.settings`,
// which its type definitions don't declare.
type TiltedElement = HTMLElement & { vanillaTilt?: { settings: TiltOptions } };

export const useGlassCardEffect = () => {
  const isAnimating = useRef(false);

  const handleCardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating.current) {
      return;
    }

    const card = event.currentTarget;
    const tiltInstance = (card as TiltedElement).vanillaTilt;
    const perspective = tiltInstance?.settings.perspective ?? 1800;
    const scale       = tiltInstance?.settings.scale       ?? 1.03;
    const max         = tiltInstance?.settings.max         ?? 14;

    // Derive tilt direction from where on the card the click landed,
    // so the bounceback always responds to the actual click position.
    const rect    = card.getBoundingClientRect();
    const normX   = (event.clientX - rect.left)  / rect.width  - 0.5;  // -0.5 → 0.5
    const normY   = (event.clientY - rect.top)   / rect.height - 0.5;
    const rotateY =  normX * max * 2;   // left/right axis
    const rotateX = -normY * max * 2;   // top/bottom axis (negative = top tips toward viewer)

    isAnimating.current = true;

    const exaggeratedRotateX = rotateX * 1.4;
    const exaggeratedRotateY = rotateY * 1.4;

    // Manually set the transform to the exaggerated state
    card.style.transform = `perspective(${perspective}px) rotateX(${exaggeratedRotateX}deg) rotateY(${exaggeratedRotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    card.style.transition = `transform 0.1s ease-out`;

    // Set a timeout to start the bounce-back
    setTimeout(() => {
      card.style.transition = `transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      setTimeout(() => {
        isAnimating.current = false;
        card.style.transition = '';
        // For GSAP-driven cards: clear the inline transition so GSAP regains full control
        card.style.transform = '';
      }, 150);
    }, 100);
  }, []);

  return { handleCardClick };
};

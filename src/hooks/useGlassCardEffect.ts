import { useCallback, useRef } from 'react';

// Base64 encoded WAV file for the click sound
const clickSound = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

export const useGlassCardEffect = () => {
  const isAnimating = useRef(false);

  const handleCardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating.current) {
      return;
    }

    const card = event.currentTarget;
    const audio = new Audio(clickSound);
    audio.play();

    // The tilt instance is not reliably providing values, so let's read the transform directly from the style.
    const currentTransform = card.style.transform;
    if (!currentTransform) {
        return; // No transform applied yet
    }

    const rotateXMatch = currentTransform.match(/rotateX\(([^d]+)deg\)/);
    const rotateYMatch = currentTransform.match(/rotateY\(([^d]+)deg\)/);

    const rotateX = rotateXMatch ? parseFloat(rotateXMatch[1]) : 0;
    const rotateY = rotateYMatch ? parseFloat(rotateYMatch[1]) : 0;

    if (rotateX === 0 && rotateY === 0) {
      return; // No tilt, no animation
    }
    
    isAnimating.current = true;

    const exaggeratedRotateX = rotateX * 1.8;
    const exaggeratedRotateY = rotateY * 1.8;

    const tiltInstance = (card as any).vanillaTilt;
    if (!tiltInstance) {
        isAnimating.current = false;
        return;
    }
    const perspective = tiltInstance.settings.perspective;
    const scale = tiltInstance.settings.scale;

    // Manually set the transform to the exaggerated state
    card.style.transform = `perspective(${perspective}px) rotateX(${exaggeratedRotateX}deg) rotateY(${exaggeratedRotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    card.style.transition = `transform 0.1s ease-out`;

    // Set a timeout to start the bounce-back
    setTimeout(() => {
      // The bounce-back uses a different, slower transition
      card.style.transition = `transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
      // We set the transform back to the normal hover state
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // After the bounce-back is complete, allow clicks again
      setTimeout(() => {
        isAnimating.current = false;
        // Let vanilla-tilt take over again by resetting the transition to its default
        card.style.transition = '';
      }, 50);
    }, 100);
  }, []);

  return { handleCardClick };
};

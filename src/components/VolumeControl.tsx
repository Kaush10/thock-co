import { useEffect, useRef, useState, useCallback } from 'react';
import './VolumeControl.css';

interface VolumeControlProps {
  className?: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('thock-volume');
    if (savedVolume) {
      return parseFloat(savedVolume);
    } else {
      localStorage.setItem('thock-volume', '51');
      return 51;
    }
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0); // For smooth reveal animation
  const [animationTime, setAnimationTime] = useState(0); // For vibration animation timing
  // ...existing code...
  const revealAnimationRef = useRef<number>();
  const hoverDelayRef = useRef<NodeJS.Timeout>();

  // Volume icon pattern (9x9 grid) - based on attached examples
  const volumeIcon = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // Remove: Load volume from localStorage on mount (handled by useState initializer)

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('thock-volume', volume.toString());
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('thock-volume-change'));
  }, [volume]);

  // Setup canvas with high DPI support
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return null;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.scale(dpr, dpr);
    return ctx;
  }, []);

  // Draw the control
  const drawControl = useCallback(() => {
    const ctx = setupCanvas();
    if (!ctx) return;

    const canvas = canvasRef.current!;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get theme colors
    const isDark = !document.documentElement.classList.contains('light');
    const fillColor = isDark ? '#FF00AA' : '#b89c70';
    const bgDotColor = isDark ? '#333' : '#ccc';

    const cols = 36;
    const rows = 9;
    // Pack rows much closer - dots should be as far apart vertically as horizontally
    const cellWidth = width / cols;
    const cellHeight = cellWidth; // Make vertical spacing same as horizontal
    const actualHeight = cellHeight * rows;
    const yOffset = (height - actualHeight) / 2; // Center vertically
    
    const dotRadius = cellWidth * 0.35; // Slightly larger dots
    const centerRow = Math.floor(rows / 2);

    // Calculate fill width based on volume
    const fillPercentage = volume / 100;
    const fillWidth = width * fillPercentage;

    // Draw static line background when volume >= 50% for helix effect
    if (volume >= 50) {
      ctx.save();
      ctx.globalAlpha = 0.9; // 90% opacity as requested
      
      for (let col = 0; col < cols; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = yOffset + centerRow * cellHeight + cellHeight / 2;
        const isFilled = x <= fillWidth;
        
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isFilled ? fillColor : bgDotColor;
        ctx.fill();
      }
      
      ctx.restore();
    }

    // Always draw the vibrating line when not hovered (fade in during transition)
    if (!isHovered && !isDragging) {
      // Draw vibrating line with alpha based on how much matrix has faded
      const lineAlpha = Math.max(0, 1 - (revealProgress / 0.3)); // Fade in as matrix fades out
      
      ctx.save();
      ctx.globalAlpha = lineAlpha;
      
      for (let col = 0; col < cols; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const baseY = yOffset + centerRow * cellHeight + cellHeight / 2;
        
        // Add vibration effect with enhanced speed above 50% (only if volume > 0)
        let vibrationOffset = 0;
        if (volume > 0) {
          let animationSpeed = 0.005; // Base speed
          let intensity = (volume / 100) * 2; // Linear intensity scaling only
          
          if (volume >= 50) {
            // 10% speed increase after hitting 50%
            animationSpeed = 0.005 * 1.1;
            // No intensity boost - just keep linear scaling
          }
          
          const time = Date.now() * animationSpeed;
          const phaseOffset = col * 0.2;
          vibrationOffset = Math.sin(time + phaseOffset) * intensity;
        }
        
        const finalY = baseY + vibrationOffset;
        const isFilled = x <= fillWidth;
        
        ctx.beginPath();
        ctx.arc(x, finalY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isFilled ? fillColor : bgDotColor;
        ctx.fill();
      }
      
      ctx.restore();
    }

    // Show matrix with fade-out during transition
    if (isHovered || isDragging || revealProgress > 0) {
      // Full matrix mode with animated reveal
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cellWidth + cellWidth / 2;
          const y = yOffset + row * cellHeight + cellHeight / 2;

          // Calculate reveal progress with logarithmic timing - center fast, outer slow
          const distanceFromCenter = Math.abs(row - centerRow);
          
          // Logarithmic progression: center rows appear fastest, outer rows slower and later
          const levelStartDelay = distanceFromCenter * 0.2; // Each level waits 20% of total time
          const levelFadeDuration = 0.6; // Each level takes 60% of remaining time to fade
          
          // Calculate fade progress for this level
          let rowRevealProgress = 0;
          if (revealProgress > levelStartDelay) {
            const levelProgress = Math.min(1, (revealProgress - levelStartDelay) / levelFadeDuration);
            // Smooth ease-in-out curve for natural fade
            rowRevealProgress = 0.5 - 0.5 * Math.cos(levelProgress * Math.PI);
          }

          // Only draw if this row should be revealed
          if (distanceFromCenter === 0 || rowRevealProgress > 0) {
            const isFilled = x <= fillWidth;

            // Apply fade-in effect for revealing rows
            const alpha = distanceFromCenter === 0 ? 1 : rowRevealProgress;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            
            // All dots use regular fill colors (no volume icon)
            ctx.fillStyle = isFilled ? fillColor : bgDotColor;
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }
  }, [isHovered, isDragging, volume, setupCanvas, revealProgress, animationTime, volumeIcon]);

  // Handle mouse interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateVolumeFromPosition(e);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateVolumeFromPosition(e as any);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateVolumeFromPosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newVolume = Math.round(percentage * 100);
    setVolume(newVolume);
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Main drawing effect - simplified to prevent conflicts
  useEffect(() => {
    drawControl();
  }, [isHovered, isDragging, volume, revealProgress, animationTime, drawControl]);

  // Handle reveal animation on hover with delay and proper cleanup
  useEffect(() => {
    // Clear any existing reveal animation
    if (revealAnimationRef.current) {
      cancelAnimationFrame(revealAnimationRef.current);
      revealAnimationRef.current = undefined;
    }

    const targetProgress = isHovered || isDragging ? 1 : 0;
    
    // Start animation immediately for reverse (unhover), with delay only for forward (hover)
    const shouldDelay = false; // Remove delay entirely for now
    
    const startAnimation = () => {
      // ...existing code...
      
      const startTime = Date.now();
      let startProgress: number;
      let isExpanding: boolean;
      
      // Bounce easing function - overshoots and settles back (for expansion only)
      const easeOutBounce = (t: number): number => {
        if (t < 1 / 2.75) {
          return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
          return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
          return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
          return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
      };
      
      // Smooth ease-out for closing (cascade fade)
      const easeOut = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
      };
      
      const animateReveal = () => {
        const elapsed = Date.now() - startTime;
        
        // Use current state value for start progress on first frame and determine direction
        setRevealProgress(prev => {
          if (startProgress === undefined) {
            startProgress = prev;
            // Determine direction by comparing target to current progress
            isExpanding = targetProgress > startProgress;
          }
          
          // Set duration based on direction (20% longer for closing)
          const duration = isExpanding ? 800 : 960;
          let progress = Math.min(elapsed / duration, 1);
          
          // Apply different easing based on direction
          const easedProgress = isExpanding ? easeOutBounce(progress) : easeOut(progress);
          
          // Calculate actual progress value between start and target with easing
          const newProgress = startProgress + (targetProgress - startProgress) * easedProgress;
          return newProgress;
        });
        
        // Continue animation if not complete
        const duration = isExpanding ? 800 : 960;
        if (elapsed < duration) {
          revealAnimationRef.current = requestAnimationFrame(animateReveal);
        }
      };
      
      revealAnimationRef.current = requestAnimationFrame(animateReveal);
    };

    if (shouldDelay) {
      // Add delay only for hover (forward direction)
      hoverDelayRef.current = setTimeout(startAnimation, 100);
    } else {
      // Start immediately for unhover (reverse direction)
      startAnimation();
    }

    return () => {
      if (revealAnimationRef.current) {
        cancelAnimationFrame(revealAnimationRef.current);
      }
      if (hoverDelayRef.current) {
        clearTimeout(hoverDelayRef.current);
      }
    };
  }, [isHovered, isDragging]);

  // Continuous vibration animation - start immediately on unhover
  useEffect(() => {
    let vibrationAnimationId: number;
    
    const updateVibration = () => {
      // Always update and redraw when not hovered to show line (vibrating or static)
      if (!isHovered && !isDragging) {
        setAnimationTime(Date.now());
        drawControl(); // Force redraw to show line
      }
      vibrationAnimationId = requestAnimationFrame(updateVibration);
    };

    // Always run the animation loop when not hovered
    if (!isHovered && !isDragging) {
      vibrationAnimationId = requestAnimationFrame(updateVibration);
    }

    return () => {
      if (vibrationAnimationId) {
        cancelAnimationFrame(vibrationAnimationId);
      }
    };
  }, [isHovered, isDragging, volume, drawControl]);

  // Redraw on resize
  useEffect(() => {
    const handleResize = () => {
      drawControl();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawControl]);

  return (
    <div className={`volume-control ${className}`}>
      <canvas
        ref={canvasRef}
        className="volume-canvas"
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
};

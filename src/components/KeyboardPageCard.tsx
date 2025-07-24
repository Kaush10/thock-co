import React, { useEffect } from 'react';
import './KeyboardPageCard.css';

interface KeyboardPageCardProps {
  review: {
    id: number;
    title: string;
    date: string;
    image: string;
    snippet: string;
    testimonial: string;
    specs: string;
  };
}

// Since vanilla-tilt is loaded via a script tag, we need to declare it for TypeScript
declare const VanillaTilt: any;

export const KeyboardPageCard: React.FC<KeyboardPageCardProps> = ({ review }) => {
  useEffect(() => {
    // Initialize VanillaTilt on elements with data-tilt.
    // We check if VanillaTilt is defined to avoid errors during server-side rendering or if the script fails to load.
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 7, // 30% less intense than the default 10
            speed: 500,
            perspective: 1800,
            glare: true,
            "max-glare": 0.1,
            scale: 1.03,
            reset: true,
            reverse: true // This inverts the tilt direction
        });
    }
  }, []);

  return (
    <div className="k-card-container" data-tilt>
        <div className="k-card-content-area">
            <img src={review.image} alt={review.title} className="k-card-image" />
            <div className="k-card-text-block">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {review.title}
                </h3>
                <p className="text-sm sm:text-base font-light">
                    {review.snippet}
                </p>
            </div>
        </div>
    </div>
  );
};

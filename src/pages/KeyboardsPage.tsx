import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { LiquidButton } from '../components/LiquidButton';

const keyboardReviews = [
  {
    id: 1,
    title: 'review: project alpha',
    date: 'july 23, 2025',
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'an exceptional board with unmatched typing feel. the custom plate and foam dampening create the perfect thock.',
    testimonial: 'absolutely love the build quality and attention to detail. exactly what i was looking for!',
    specs: 'gasket mount • alu plate • 67g boba u4t'
  },
  {
    id: 2,
    title: 'review: dyna tkl',
    date: 'july 18, 2025',
    image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'incredible acoustics and premium feel. the typing experience is smooth and satisfying with every keystroke.',
    testimonial: 'the build exceeded my expectations. professional work and amazing communication throughout.',
    specs: 'top mount • pc plate • lubed alpacas'
  },
  {
    id: 3,
    title: 'review: alice layout',
    date: 'july 15, 2025',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'unique ergonomic design with flawless execution. the split layout takes some getting used to but feels great.',
    testimonial: 'my first alice board and it\'s perfect. the custom cable and artisan keycaps are beautiful touches.',
    specs: 'gasket mount • fr4 plate • silent alpacas'
  },
  {
    id: 4,
    title: 'review: 60% compact',
    date: 'july 12, 2025',
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'perfect for minimal setups. the compact size doesn\'t compromise on typing quality or premium materials.',
    testimonial: 'exactly what i needed for my small desk setup. the typing sound is crisp and clean.',
    specs: 'tray mount • alu plate • gateron yellows'
  },
  {
    id: 5,
    title: 'review: arisu split',
    date: 'july 8, 2025',
    image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'beautiful arisu layout with excellent build quality. the split spacebar and arrow keys are incredibly productive.',
    testimonial: 'love the unique layout and premium materials. shipping was fast and packaging was excellent.',
    specs: 'gasket mount • carbon fiber plate • holy pandas'
  },
  {
    id: 6,
    title: 'review: ortho 40%',
    date: 'july 5, 2025',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'ultra-compact ortholinear layout for maximum efficiency. takes time to learn but incredibly productive.',
    testimonial: 'challenging but rewarding layout. the build quality is top-notch and the keycaps feel amazing.',
    specs: 'tray mount • brass plate • box jades'
  }
];

export const KeyboardsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, keyboardReviews.length));
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold accent-text mb-12 text-center fade-in-up page-header">
          keyboard gallery & reviews
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {keyboardReviews.slice(0, visibleCount).map((review, index) => (
            <GlassCard key={review.id} className="p-6 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <img
                src={review.image}
                alt={review.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <h3 className="text-xl font-semibold accent-text mb-2">
                {review.title}
              </h3>
              
              <p className="text-sm opacity-70 mb-3">
                {review.date}
              </p>
              
              <p className="text-sm mb-4 leading-relaxed">
                {review.snippet}
              </p>
              
              <blockquote className="text-sm italic opacity-80 mb-4 pl-4 border-l-2 border-interactive">
                "{review.testimonial}"
              </blockquote>
              
              <p className="text-xs opacity-60 mb-4">
                {review.specs}
              </p>
              
              <LiquidButton className="w-full text-center">
                read more
              </LiquidButton>
            </GlassCard>
          ))}
        </div>

        {visibleCount < keyboardReviews.length && (
          <div className="flex justify-center">
            <LiquidButton onClick={loadMore} className="px-8 py-3">
              load more
            </LiquidButton>
          </div>
        )}
      </div>
    </div>
  );
};
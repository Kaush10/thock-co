import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { LiquidButton } from '../components/LiquidButton';
import { ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <GlassCard className="p-12 fade-in-up">
          <h1 className="text-4xl font-bold accent-text mb-8 text-center page-header">
            about thock & co.
          </h1>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              thock & co. is founded on a passion for the perfect keystroke. what started as 
              a personal obsession with mechanical keyboards has evolved into a dedicated service 
              for fellow enthusiasts who understand that typing is more than just input—it's an experience.
            </p>
            
            <p>
              every build begins with understanding your unique needs. whether you're a programmer 
              seeking the perfect tactile feedback, a writer craving smooth linear switches, or a 
              gamer demanding lightning-fast response times, we craft each keyboard to match your 
              exact specifications.
            </p>
            
            <p>
              our process combines traditional craftsmanship with modern techniques. from hand-lubing 
              switches to precision foam modding, every detail is carefully considered. we source only 
              premium materials and work with trusted vendors to ensure your keyboard not only sounds 
              amazing but will provide years of reliable service.
            </p>
            
            <p>
              based in urbana-champaign, illinois, we serve keyboard enthusiasts worldwide. each build 
              is documented with detailed photos, and we maintain open communication throughout the 
              entire process. your satisfaction is our priority, and we stand behind every keyboard 
              that leaves our workshop.
            </p>
            
            <p className="text-center italic opacity-80">
              my personal portfolio is coming soon at{' '}
              <a 
                href="https://kaush.me" 
                className="text-interactive hover:underline inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                kaush.me
                <ExternalLink size={16} />
              </a>
            </p>
          </div>
          
          <div className="flex justify-center mt-12">
            <LiquidButton className="px-8 py-3">
              start your build journey
            </LiquidButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
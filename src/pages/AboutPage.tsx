import { useRef } from 'react';
import { useTilt } from '../hooks/useTilt';
import '../components/KeyboardPageCard.css';
import { ExternalLink, Instagram, Youtube, Linkedin } from 'lucide-react';


export const AboutPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useTilt(cardRef, 'faint');

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-12 flex flex-col items-center justify-start">
        <div className="max-w-4xl w-full mx-auto flex flex-col">
          <div ref={cardRef} className="k-card-container">
            <div className="k-card-content-area p-12 fade-in-up">
              <h1 className="text-4xl font-bold accent-text mb-8 text-center page-header">
                about thock&co.
              </h1>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>hey there, i'm kaush.</p>
                <p>i started building custom mechanical keyboards when i was 17. at the time, the difference in sound and feel from a prebuilt was mind-blowing, and i was completely captivated by the creative tinkering process. i've since fallen in love with the sensory experience tied to each type of switch—from the deep thock of a heavy linear to the crisp responsivness of a tactile. to me, a keyboard isn't just a tool; it's a personal extension of your craft.</p>
                <p>thock&co. is my dedication to that idea. my goal is to hear what you want from your build and then, like an engineer and an artist, solve the problem of how to make it sound that way—be it with foams, tape, or meticulously tuned stabilizers. every build i create is a chance to not only experience a new combination of parts but to bring someone's personal vision to life in the most magical way possible.</p>
                <p className="text-center italic opacity-80">
                  my personal portfolio is coming soon at{' '}
                  <a 
                    href="https://..." 
                    className="text-interactive hover:underline inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    kaush.me
                    <ExternalLink size={16} />
                  </a>
                </p>
              </div>
            </div>
          </div>
          {/* Social buttons in a new k-card-container below */}
          <div className="k-card-container mt-8">
            <div className="k-card-content-area p-8 flex justify-center">
              <div className="flex flex-wrap justify-center gap-4">
                <a aria-label="Instagram"
                  href="https://instagram.com/kaush.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-full p-3 flex items-center justify-center shadow"
                  style={{ color: 'var(--primary-accent)' }}
                >
                  <Instagram size={28} strokeWidth={2} />
                </a>
                <a aria-label="YouTube"
                  href="https://youtube.com/@kaushme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-full p-3 flex items-center justify-center shadow"
                  style={{ color: 'var(--primary-accent)' }}
                >
                  <Youtube size={28} strokeWidth={2} />
                </a>
                <a aria-label="LinkedIn"
                  href="https://linkedin.com/in/kaushrajesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-full p-3 flex items-center justify-center shadow"
                  style={{ color: 'var(--primary-accent)' }}
                >
                  <Linkedin size={28} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
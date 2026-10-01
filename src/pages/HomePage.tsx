import { ScrollHero } from '../components/ScrollHero';
import { AnimatedHole } from '../components/AnimatedHole';
import { MessageComposer } from '../components/MessageComposer';


interface HomePageProps {
  isDark: boolean;
  overflowXHiddenClass?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ isDark, overflowXHiddenClass }) => {
  const bodyText = `to touch and to feel is deeply human. 
it's something i've always believed defines our connection to the world. 

to me, a keyboard is the most personal interface for interacting with our digital world... and even beyond that, it's a sensory experience—a beautiful fusion of sound and feel. 

thock&co. is where i keep the boards i've built: what went into each one, and what it sounds like.`;

  return (
    <div className="px-6 pt-0">
      {/* Remove top padding so ScrollHero is flush with top */}
      <ScrollHero bodyText={bodyText} isDark={isDark} />
      {/* Remove extra vertical space between heroes */}
      <div className={`${overflowXHiddenClass || ''} overflow-x-hidden w-full`}>
        <div className="h-[30vh] w-full" />
        <section aria-label="say hi" className="relative z-10 flex flex-col items-center px-1">
          <MessageComposer />
        </section>
        {/* The board floats over the hole; the hole sits up under it. */}
        <div className="relative z-0 -mt-[12vw] w-full">
          <AnimatedHole />
        </div>
      </div>
    </div>
  );
};

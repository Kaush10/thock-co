export interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  image: string;
  snippet: string;
  testimonial: string;
  specs: string;
  fullContent: string;
}

export const articles: Article[] = [
  {
    id: 1,
    slug: 'project-alpha',
    title: 'review: project alpha',
    date: 'july 23, 2025',
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'an exceptional board with unmatched typing feel. the custom plate and foam dampening create the perfect thock.',
    testimonial: 'absolutely love the build quality and attention to detail. exactly what i was looking for!',
    specs: 'gasket mount, alu plate, 67g boba u4t',
    fullContent: `
      <p>This is the full article content for Project Alpha. It was a challenging but rewarding build, focusing on achieving the perfect "thock" sound profile. The client was extremely pleased with the result.</p>
      <p>We used a combination of a gasket-mounted aluminum plate and custom-cut foam to dampen any unwanted high-frequency sounds, resulting in a deep, satisfying typing experience.</p>
    `
  },
  {
    id: 2,
    slug: 'dyna-tkl',
    title: 'review: dyna tkl',
    date: 'july 18, 2025',
    image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'incredible acoustics and premium feel. the typing experience is smooth and satisfying with every keystroke.',
    testimonial: 'the build exceeded my expectations. professional work and amazing communication throughout.',
    specs: 'top mount, pc plate, lubed alpacas',
    fullContent: `
      <p>The Dyna TKL is a classic for a reason. This build focused on a smooth, linear typing experience. The polycarbonate plate provides a softer bottom-out than metal plates, which was a key request from the client.</p>
      <p>Each switch was hand-lubed with Krytox 205g0 for maximum smoothness.</p>
    `
  },
  {
    id: 3,
    slug: 'alice-layout',
    title: 'review: alice layout',
    date: 'july 15, 2025',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'unique ergonomic design with flawless execution. the split layout takes some getting used to but feels great.',
    testimonial: 'my first alice board and it\'s perfect. the custom cable and artisan keycaps are beautiful touches.',
    specs: 'gasket mount, fr4 plate, silent alpacas',
    fullContent: `
      <p>The Alice layout is a popular ergonomic choice. This build was all about creating a comfortable and quiet keyboard for a professional office environment. The silent alpaca switches are perfect for this, providing a smooth linear feel without the noise.</p>
    `
  },
  {
    id: 4,
    slug: '60-compact',
    title: 'review: 60% compact',
    date: 'july 12, 2025',
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'perfect for minimal setups. the compact size doesn\'t compromise on typing quality or premium materials.',
    testimonial: 'exactly what i needed for my small desk setup. the typing sound is crisp and clean.',
    specs: 'tray mount, alu plate, gateron yellows',
    fullContent: `
      <p>A classic 60% build for a client who wanted a minimal desk setup. Gateron Yellow switches are a great budget-friendly linear option that still provides a great typing experience.</p>
    `
  },
  {
    id: 5,
    slug: 'arisu-split',
    title: 'review: arisu split',
    date: 'july 8, 2025',
    image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'beautiful arisu layout with excellent build quality. the split spacebar and arrow keys are incredibly productive.',
    testimonial: 'love the unique layout and premium materials. shipping was fast and packaging was excellent.',
    specs: 'gasket mount, carbon fiber plate, holy pandas',
    fullContent: `
      <p>The Arisu layout is a more aggressive ergonomic option than the Alice. This build used a carbon fiber plate for a firm typing feel and Holy Panda switches for maximum tactility.</p>
    `
  },
  {
    id: 6,
    slug: 'ortho-40',
    title: 'review: ortho 40%',
    date: 'july 5, 2025',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    snippet: 'ultra-compact ortholinear layout for maximum efficiency. takes time to learn but incredibly productive.',
    testimonial: 'challenging but rewarding layout. the build quality is top-notch and the keycaps feel amazing.',
    specs: 'tray mount, brass plate, box jades',
    fullContent: `
      <p>An ortholinear 40% is not for the faint of heart! This layout requires a significant learning curve but is incredibly efficient once mastered. The brass plate and clicky Box Jade switches make for a very loud and tactile typing experience.</p>
    `
  }
];

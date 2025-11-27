import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onSelectCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory }) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    // If clicking Shop Now, reset filter to All
    if (targetId === 'shopping-grid') {
        onSelectCategory('All');
    }
    
    const element = document.getElementById(targetId);
    if (element) {
       const headerOffset = 80; // Height of the sticky navbar
       const elementPosition = element.getBoundingClientRect().top;
       const offsetPosition = elementPosition + window.scrollY - headerOffset;
   
       window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
       });
    }
  };

  return (
    <div className="relative overflow-hidden bg-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-stone-100 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 min-h-[600px] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-bold text-stone-900 sm:text-5xl md:text-6xl font-serif">
                <span className="block xl:inline">GEEZ MADE IN ETHIOPIA</span>{' '}
                <span className="block text-stone-600 xl:inline">Wear Your Heritage</span>
              </h1>
              <div className="mt-3 text-base text-stone-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                <p className="mb-4">
                  Welcome to GEEZ MADE IN ETHIOPIA, where ancient aesthetics meet modern apparel.
                  We are a cultural cloth store dedicated to reviving and blending Ethiopian traditions with contemporary design. We transform the rich narratives and forgotten symbols of Ethiopia into wearable art—stylish T-shirts that tell a powerful story.
                </p>
              </div>
              
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4 mb-10">
                <div className="rounded-md shadow">
                  <a 
                    href="#shopping-grid" 
                    onClick={(e) => handleSmoothScroll(e, 'shopping-grid')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-stone-900 hover:bg-stone-800 md:py-4 md:text-lg transition-all"
                  >
                    Shop Now
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a 
                    href="#lookbook" 
                    onClick={(e) => handleSmoothScroll(e, 'lookbook')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-stone-300 text-base font-medium rounded-full text-stone-700 bg-white hover:bg-stone-50 md:py-4 md:text-lg transition-all"
                  >
                    View Lookbook <ArrowUpRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-stone-200 pt-6">
                <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">Why Choose GEEZ?</h3>
                <ul className="space-y-4 text-sm text-stone-600">
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span className="font-bold text-stone-900 min-w-fit">Ethiopian Essence:</span>
                        <span>Designs rooted in authentic motifs symbolizing prosperity, community, and pride.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                         <span className="font-bold text-stone-900 min-w-fit">Premium Quality:</span>
                         <span>Imported, 100% Cotton shirts utilizing advanced printing techniques, including our signature DTF printing, for vibrant, lasting results.</span>
                    </li>
                     <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                         <span className="font-bold text-stone-900 min-w-fit">Customization:</span>
                         <span>Design your own piece or choose from our curated collections to create a stylish, empowered, and comfortable cultural statement.</span>
                    </li>
                </ul>
                <p className="mt-8 text-stone-900 font-serif italic font-medium text-lg">
                    "Reborn traditions. Redefined style."
                </p>
            </div>

          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/800/1000?random=1"
          alt="Fashion model"
        />
      </div>
    </div>
  );
};
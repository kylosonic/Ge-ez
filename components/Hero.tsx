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
                <span className="block xl:inline">Unleash Your Style</span>{' '}
                <span className="block text-stone-600 xl:inline">Shop the Latest Trends</span>
              </h1>
              <p className="mt-3 text-base text-stone-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Discover the latest trends & express your style effortlessly. Shop exclusive collections with premium designs, just for you.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
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
            
            <div className="mt-10 flex gap-8 items-center text-stone-500 text-sm">
                <div>
                    <span className="block text-2xl font-bold text-stone-900">25K+</span>
                    <span>Happy Customers</span>
                </div>
                <div className="h-8 w-px bg-stone-300"></div>
                <div>
                    <span className="block text-2xl font-bold text-stone-900">100+</span>
                    <span>New Arrivals</span>
                </div>
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
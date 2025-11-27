import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
// Importing images directly from the assets folder
import storeEntranceImg from '../assets/IMG_7158.JPG';
import brandingWallImg from '../assets/IMG_7160.JPG';
import clothingRacksImg from '../assets/IMG_7159.JPG';
import storeMirrorImg from '../assets/IMG_7161.JPG';

export const StoreShowcase: React.FC = () => {
  return (
    <section id="visit-us" className="bg-stone-900 py-20 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white">
              Experience Ge'ez In Person
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-8">
              Step into our world where tradition meets modern streetwear. Visit our flagship store in Addis Ababa to feel the fabric, try on the latest drops, and vibe with the Ge'ez community.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-stone-800 rounded-lg">
                    <MapPin className="text-stone-200" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Visit Us</h4>
                  <p className="text-stone-400">Bole, Addis Ababa, Ethiopia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-stone-800 rounded-lg">
                    <Clock className="text-stone-200" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Opening Hours</h4>
                  <p className="text-stone-400">Mon - Sat: 10:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-stone-800 rounded-lg">
                    <Phone className="text-stone-200" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Contact</h4>
                  <p className="text-stone-400">+251 91 123 4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Image (Vertical Neon Sign - IMG_7158) */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
             <img 
               src={storeEntranceImg} 
               alt="Ge'ez Store Entrance Neon" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
             <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">Flagship Store</span>
             </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto md:h-96">
            
            {/* Branding Wall (IMG_7160) */}
            <div className="relative rounded-xl overflow-hidden group h-64 md:h-full lg:col-span-2">
                <img 
                    src={brandingWallImg} 
                    alt="Timeless Trends Branding" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Merchandise Racks (IMG_7159) */}
            <div className="relative rounded-xl overflow-hidden group h-64 md:h-full">
                <img 
                    src={clothingRacksImg} 
                    alt="Clothing Racks" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Mirror/Vibe (IMG_7161) */}
            <div className="relative rounded-xl overflow-hidden group h-64 md:h-full">
                <img 
                    src={storeMirrorImg} 
                    alt="Store Interior Mirror" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        </div>

      </div>
    </section>
  );
};
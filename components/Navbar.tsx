import React from 'react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenHistory: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const NAV_CATEGORIES = ['All', 'Shirts', 'Jackets', 'Hoodies', 'Pants', 'Outerwear'];

export const Navbar: React.FC<NavbarProps> = ({ cartItems, onOpenCart, onOpenHistory, activeCategory, onSelectCategory }) => {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 w-full bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 text-stone-600 hover:text-black md:hidden">
              <Menu size={24} />
            </button>
            <a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }} className="text-2xl font-bold tracking-tight text-stone-900 font-serif">
              STYLEHIVE
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_CATEGORIES.map((item) => (
              <button 
                key={item} 
                onClick={() => onSelectCategory(item)}
                className={`text-sm font-medium transition-colors ${
                    activeCategory === item ? 'text-stone-900 font-bold underline decoration-2 underline-offset-4' : 'text-stone-600 hover:text-black'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-stone-600 hover:text-black transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            <button 
              onClick={onOpenHistory}
              className="p-2 text-stone-600 hover:text-black transition-colors"
              title="Order History"
            >
              <User size={20} />
            </button>
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-stone-600 hover:text-black transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
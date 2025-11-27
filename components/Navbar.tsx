import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, User, LogOut, LayoutDashboard, History, X } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenHistory: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  user: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

const NAV_CATEGORIES = ['All', 'Shirts', 'Jackets', 'Hoodies', 'Pants', 'Outerwear'];

export const Navbar: React.FC<NavbarProps> = ({ 
    cartItems, 
    onOpenCart, 
    onOpenHistory, 
    activeCategory, 
    onSelectCategory,
    user,
    onLoginClick,
    onLogout,
    onOpenAdmin
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleMobileCategoryClick = (category: string) => {
    onSelectCategory(category);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-stone-600 hover:text-black md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }} className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
              GEEZ MADE IN ETHIOPIA
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
            
            {/* User Profile / Login */}
            <div className="relative">
                {user ? (
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-stone-200" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </button>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="p-2 text-stone-600 hover:text-black transition-colors"
                        title="Sign In"
                    >
                        <User size={20} />
                    </button>
                )}

                {/* Desktop Dropdown Menu */}
                {isProfileOpen && user && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <div className="px-4 py-2 border-b border-stone-100">
                                <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
                                <p className="text-xs text-stone-500 truncate">{user.email}</p>
                            </div>
                            {user.role === 'admin' && (
                                <button onClick={() => { onOpenAdmin(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                                    <LayoutDashboard size={16} /> Admin Dashboard
                                </button>
                            )}
                            {user.role === 'customer' && (
                                <button onClick={() => { onOpenHistory(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                                    <History size={16} /> Order History
                                </button>
                            )}
                            <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-stone-50 flex items-center gap-2">
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>
                    </>
                )}
            </div>

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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="space-y-1 px-4 pb-3 pt-2">
             {NAV_CATEGORIES.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMobileCategoryClick(item)}
                  className={`block w-full text-left py-2 px-3 text-base font-medium rounded-md ${
                    activeCategory === item ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  {item}
                </button>
             ))}
          </div>
        </div>
      )}
    </nav>
  );
};
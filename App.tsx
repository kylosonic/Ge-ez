import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { Product, CartItem } from './types';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Plain White Shirt', price: 29.00, category: 'Shirts', image: 'https://picsum.photos/400/500?random=10' },
  { id: 2, name: 'Classic Cardigan', price: 49.00, category: 'Outerwear', image: 'https://picsum.photos/400/500?random=11' },
  { id: 3, name: 'Brown Bomber Jacket', price: 89.00, category: 'Jackets', image: 'https://picsum.photos/400/500?random=12' },
  { id: 4, name: 'Grey Sweatshirt', price: 35.00, category: 'Hoodies', image: 'https://picsum.photos/400/500?random=13' },
  { id: 5, name: 'Checkered Overshirt', price: 55.00, category: 'Shirts', image: 'https://picsum.photos/400/500?random=14' },
  { id: 6, name: 'Navy Trousers', price: 45.00, category: 'Pants', image: 'https://picsum.photos/400/500?random=15' },
  { id: 7, name: 'Beige Trench Coat', price: 120.00, category: 'Coats', image: 'https://picsum.photos/400/500?random=16' },
  { id: 8, name: 'Striped Polo', price: 32.00, category: 'Shirts', image: 'https://picsum.photos/400/500?random=17' },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Smooth scroll to grid with offset
    setTimeout(() => {
        const element = document.getElementById('shopping-grid');
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    }, 50);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      <Navbar 
        cartItems={cartItems} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenHistory={() => setIsHistoryOpen(true)}
        activeCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <main>
        <Hero onSelectCategory={handleCategorySelect} />
        <ProductGrid 
          products={MOCK_PRODUCTS} 
          onAddToCart={handleAddToCart}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        
        {/* Footer */}
        <footer className="bg-stone-100 border-t border-stone-200 mt-20 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h4 className="font-bold text-lg mb-4 font-serif">About</h4>
                    <ul className="space-y-2 text-stone-500 text-sm">
                        <li><a href="#" className="hover:text-stone-900">Company</a></li>
                        <li><a href="#" className="hover:text-stone-900">Leadership</a></li>
                        <li><a href="#" className="hover:text-stone-900">Press</a></li>
                        <li><a href="#" className="hover:text-stone-900">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 font-serif">Help</h4>
                    <ul className="space-y-2 text-stone-500 text-sm">
                        <li><a href="#" className="hover:text-stone-900">Help Center</a></li>
                        <li><a href="#" className="hover:text-stone-900">Support Team</a></li>
                        <li><a href="#" className="hover:text-stone-900">Community</a></li>
                        <li><a href="#" className="hover:text-stone-900">FAQs</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 font-serif">Menu</h4>
                    <ul className="space-y-2 text-stone-500 text-sm">
                        <li><button onClick={() => handleCategorySelect('Shirts')} className="hover:text-stone-900">Shirts</button></li>
                        <li><button onClick={() => handleCategorySelect('Jackets')} className="hover:text-stone-900">Jackets</button></li>
                        <li><button onClick={() => handleCategorySelect('Hoodies')} className="hover:text-stone-900">Hoodies</button></li>
                        <li><button onClick={() => handleCategorySelect('All')} className="hover:text-stone-900">Popular</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 font-serif">Company</h4>
                    <ul className="space-y-2 text-stone-500 text-sm">
                        <li><a href="#" className="hover:text-stone-900">About Treadly</a></li>
                        <li><a href="#" className="hover:text-stone-900">Contact</a></li>
                        <li><a href="#" className="hover:text-stone-900">News & Blog</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-stone-400 text-sm">
                &copy; 2024 StyleHive. All rights reserved.
            </div>
        </footer>
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleOpenCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={cartTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <OrderHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StoreShowcase } from './components/StoreShowcase';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product, CartItem, User, Order } from './types';
import { getCurrentUser, logoutUser } from './services/authService';
import { Toaster, toast } from 'sonner';
import { HelmetProvider, Helmet } from 'react-helmet-async';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [user, setUser] = useState<User | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) setUser(currentUser);

    const savedProducts = localStorage.getItem('stylehive_products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS);
    if (!savedProducts) localStorage.setItem('stylehive_products', JSON.stringify(MOCK_PRODUCTS));

    const savedOrders = localStorage.getItem('stylehive_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    // Load wishlist
    const savedWishlist = localStorage.getItem('stylehive_wishlist');
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsAdminOpen(false);
    toast.success('Logged out successfully');
  };

  const toggleWishlist = (productId: number) => {
    setWishlistItems(prev => {
      const newWishlist = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('stylehive_wishlist', JSON.stringify(newWishlist));

      if (!prev.includes(productId)) {
        toast.success('Added to wishlist');
      } else {
        toast.info('Removed from wishlist');
      }

      return newWishlist;
    });
  };

  // Precise scrolling logic using scrollIntoView
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Use requestAnimationFrame to ensure React has updated the DOM if necessary,
    // though with synchronous state updates usually it's fine, but semantic 'flush'
    requestAnimationFrame(() => {
      const element = document.getElementById('shopping-grid');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    toast.success(`Added ${product.name} to cart`);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
        <Helmet>
          <title>GEEZ MADE IN ETHIOPIA | Cultural Apparel</title>
          <meta name="description" content="Authentic Ethiopian cultural clothing blended with modern design. Shop T-shirts, hoodies, and more." />
        </Helmet>
        <Toaster position="top-center" richColors />
        <Navbar
          cartItems={cartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          activeCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          user={user}
          onLoginClick={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onOpenAdmin={() => setIsAdminOpen(true)}
          wishlistCount={wishlistItems.length}
        />
        <main>
          <Hero onSelectCategory={handleCategorySelect} />

          {/* New Store Showcase Section */}
          <StoreShowcase />

          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onProductClick={setSelectedProduct}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
          />
        </main>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
          onUpdateQuantity={(id, q) => q > 0 && setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i))}
          onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          totalAmount={cartTotal}
          onPaymentSuccess={() => {
            setCartItems([]);
            const savedOrders = localStorage.getItem('stylehive_orders');
            if (savedOrders) setOrders(JSON.parse(savedOrders));
          }}
          user={user}
          onOpenLogin={() => { setIsCheckoutOpen(false); setIsAuthOpen(true); }}
        />

        <OrderHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} user={user} />

        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          relatedProducts={selectedProduct ? products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4) : []}
          onAddToCart={handleAddToCart}
          onSelectProduct={setSelectedProduct}
          isWishlisted={selectedProduct ? wishlistItems.includes(selectedProduct.id) : false}
          onToggleWishlist={selectedProduct ? () => toggleWishlist(selectedProduct.id) : () => { }}
        />

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={setUser} />

        {user?.role === 'admin' && (
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            products={products}
            onAddProduct={(p) => {
              const updated = [...products, p];
              setProducts(updated);
              localStorage.setItem('stylehive_products', JSON.stringify(updated));
            }}
            onDeleteProduct={(id) => {
              const updated = products.filter(p => p.id !== id);
              setProducts(updated);
              localStorage.setItem('stylehive_products', JSON.stringify(updated));
            }}
            orders={orders}
            onUpdateOrderStatus={(id, s) => {
              const updated = orders.map(o => o.id === id ? { ...o, status: s } : o);
              setOrders(updated);
              localStorage.setItem('stylehive_orders', JSON.stringify(updated));
            }}
          />
        )}
      </div>
    </HelmetProvider>
  );
}
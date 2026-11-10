import React, { useMemo, useState } from 'react';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LibraryShowcase } from './components/LibraryShowcase';
import { ProductGrid } from './components/ProductGrid';
import { BundleBanner } from './components/BundleBanner';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhopCheckoutModal } from './components/WhopCheckoutModal';
import { PurchaseReturn } from './components/PurchaseReturn';
import type { Product } from './types';
import { BUNDLE, PRODUCTS } from './data/catalog';

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const isCheckoutReturn = window.location.pathname === '/checkout/return';

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.isBundle) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (product) =>
        product.category === selectedProduct.category && product.id !== selectedProduct.id,
    ).slice(0, 4);
  }, [selectedProduct]);

  const browse = () => {
    setSelectedCategory('All');
    scrollToSection('library');
  };

  if (isCheckoutReturn) {
    return (
      <PurchaseReturn
        paymentId={query.get('payment')}
        paymentStatus={query.get('status')}
        productSlug={query.get('product')}
        onReturnHome={() => window.location.assign('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200">
      <Toaster position="top-center" richColors />
      <Navbar />

      <main>
        <Hero onBrowse={browse} />
        <LibraryShowcase onSelectProduct={setSelectedProduct} />
        <ProductGrid
          products={PRODUCTS}
          onAddToCart={setCheckoutProduct}
          onProductClick={setSelectedProduct}
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            scrollToSection('library');
          }}
        />
        <BundleBanner
          onBuyBundle={() => setCheckoutProduct(BUNDLE)}
          onBrowse={browse}
        />
      </main>

      <Footer onBrowse={browse} onBuyBundle={() => setCheckoutProduct(BUNDLE)} />

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        relatedProducts={relatedProducts}
        onSelectProduct={setSelectedProduct}
        onBuy={setCheckoutProduct}
      />

      <WhopCheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
    </div>
  );
}

import React, { useMemo } from 'react';
import { ShoppingBag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';
import { CATEGORIES } from '../types';
import { formatUSD } from '../data/catalog';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onProductClick,
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = useMemo(() => ['All', ...CATEGORIES], []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section id="library" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-900">The library</h2>
          <p className="mt-2 max-w-xl text-stone-500">
            {selectedCategory === 'All'
              ? `All ${products.length} guides. Buy the one you need, or take the bundle.`
              : `${filteredProducts.length} guide${filteredProducts.length === 1 ? '' : 's'} in ${selectedCategory}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7"
      >
        <AnimatePresence initial={false}>
          {filteredProducts.map((product) => {
            return (
              <motion.article
                layout
                key={product.id}
                transition={{ duration: 0.2 }}
                className="group relative"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onProductClick(product)}
                    className="block w-full text-left"
                    aria-label={`View ${product.name}`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-200 shadow-sm ring-1 ring-stone-900/5 transition-shadow duration-300 group-hover:shadow-xl">
                      <img
                        src={product.image}
                        alt={`${product.name} cover`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {product.badge && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-lg transition-all hover:bg-black hover:text-white sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                    aria-label={`Buy ${product.name}`}
                    title="Buy now"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                <div className="mt-4 min-w-0">
                  <button
                    type="button"
                    onClick={() => onProductClick(product)}
                    className="block w-full text-left"
                  >
                    <h3 className="line-clamp-2 min-h-10 break-words text-[14px] font-semibold leading-5 text-stone-900 group-hover:underline group-hover:decoration-stone-300 group-hover:underline-offset-4 sm:text-[15px]">
                      {product.name}
                    </h3>
                  </button>
                  <p className="mt-1 line-clamp-2 min-h-8 break-words text-[11px] leading-4 text-stone-500 sm:text-xs sm:leading-relaxed">
                    {product.tagline}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <p className="flex min-w-0 items-center gap-1 whitespace-nowrap text-[10px] uppercase tracking-wide text-stone-400 sm:text-[11px]">
                      <FileText size={11} className="flex-shrink-0" />
                      <span>
                        {product.pages} pages · PDF
                      </span>
                    </p>
                    <p className="ml-auto whitespace-nowrap text-sm font-semibold text-stone-900 sm:text-[15px]">
                      {formatUSD(product.price)}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="rounded-lg bg-stone-50 py-20 text-center text-stone-500">
          <p>No guides in this category yet.</p>
          <button
            onClick={() => onSelectCategory('All')}
            className="mt-4 font-medium text-stone-900 underline"
          >
            View all guides
          </button>
        </div>
      )}

      <p className="mt-12 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
        Checkout and download happen right here. Payments are processed securely by Whop.
      </p>
    </section>
  );
};

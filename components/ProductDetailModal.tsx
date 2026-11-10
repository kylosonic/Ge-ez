import React from 'react';
import { X, ShoppingBag, ArrowRight, Check, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';
import { formatUSD } from '../data/catalog';
import { TrustBadges } from './TrustBadges';
import { FAQ } from './FAQ';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  relatedProducts: Product[];
  onBuy: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  relatedProducts,
  onBuy,
  onSelectProduct,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[calc(100dvh-2rem)] w-full transform flex-col overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-h-[calc(100dvh-4rem)] sm:w-full sm:max-w-5xl"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-stone-500 transition-colors hover:bg-white hover:text-stone-900"
                aria-label="Close"
              >
                <X size={22} />
              </button>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
                {/* Cover */}
                <div className="relative flex items-start justify-center bg-stone-100 p-5 sm:p-8 md:p-10">
                  <div className="w-full max-w-[320px]">
                    <img
                      src={product.image}
                      alt={`${product.name} cover`}
                      className="w-full rounded-sm shadow-2xl ring-1 ring-black/10"
                    />
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-stone-700 shadow-sm">
                        <FileText size={12} /> PDF
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-stone-700 shadow-sm">
                        {product.pages} pages
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-stone-700 shadow-sm">
                        {product.chapters.length} chapters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-9">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {product.category}
                  </span>
                  <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-stone-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-stone-500">{product.tagline}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="text-2xl font-semibold text-stone-900">
                      {formatUSD(product.price)}
                    </span>
                    {product.compareAt && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatUSD(product.compareAt)}
                      </span>
                    )}
                    {product.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        <Sparkles size={10} /> {product.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 leading-relaxed text-stone-600">{product.description}</p>

                  <h3 className="mt-7 font-serif text-base font-bold text-stone-900">
                    What you will be able to do
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {product.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-stone-600">
                        <Check size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-7 font-serif text-base font-bold text-stone-900">
                    What is inside the download
                  </h3>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {product.includes.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-600"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-7 font-serif text-base font-bold text-stone-900">
                    {product.isBundle ? 'The ten guides' : 'Chapter list'}
                  </h3>
                  <ol className="mt-3 max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-600">
                    {product.chapters.map((chapter, index) => (
                      <li key={chapter} className="flex gap-3">
                        <span className="w-5 flex-shrink-0 text-right text-xs font-semibold text-stone-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-snug">{chapter}</span>
                      </li>
                    ))}
                  </ol>

                  <TrustBadges />

                  <div className="mt-2 hidden flex-col gap-3 sm:flex sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        onBuy(product);
                        onClose();
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-base font-medium text-white shadow-lg transition-all hover:bg-stone-800 active:scale-[0.99]"
                    >
                      <ShoppingBag size={18} />
                      Buy now — {formatUSD(product.price)}
                    </button>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-stone-500">
                    Secure Whop payment · Instant download · 30-day guarantee
                  </p>

                  <FAQ />
                </div>
              </div>

              {relatedProducts.length > 0 && (
                <div className="border-t border-stone-200 bg-stone-50 p-7 sm:p-9">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Also in {product.category}
                    </h3>
                    <span className="text-[11px] uppercase tracking-wide text-stone-500">
                      {relatedProducts.length} guide{relatedProducts.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {relatedProducts.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectProduct(item)}
                        className="group rounded-lg border border-stone-100 bg-white p-2 text-left transition-all hover:shadow-md"
                      >
                        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded bg-stone-200">
                          <img
                            src={item.image}
                            alt={`${item.name} cover`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h4 className="truncate px-1 text-sm font-medium text-stone-900">
                          {item.name}
                        </h4>
                        <div className="mt-1 flex items-center justify-between px-1">
                          <p className="text-sm text-stone-500">{formatUSD(item.price)}</p>
                          <ArrowRight size={12} className="text-stone-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>

              <div className="flex-shrink-0 border-t border-stone-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:hidden">
                <button
                  type="button"
                  onClick={() => {
                    onBuy(product);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl bg-stone-900 px-5 py-3.5 text-left text-white shadow-lg transition-colors hover:bg-stone-800 active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <ShoppingBag size={17} />
                    Buy PDF now
                  </span>
                  <span className="text-base font-semibold">{formatUSD(product.price)}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

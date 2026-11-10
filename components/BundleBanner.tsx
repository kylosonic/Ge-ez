import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { BUNDLE, PRODUCTS, formatUSD } from '../data/catalog';

interface BundleBannerProps {
  onBuyBundle: () => void;
  onBrowse: () => void;
  isOwned?: boolean;
}

export const BundleBanner: React.FC<BundleBannerProps> = ({ onBuyBundle, onBrowse, isOwned }) => {
  const saving = (BUNDLE.compareAt ?? 0) - BUNDLE.price;

  return (
    <section id="bundle" className="border-y border-stone-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-3xl bg-stone-950 p-6 text-white sm:gap-12 sm:p-12 lg:grid-cols-[300px_1fr] lg:gap-16">
          <div className="mx-auto w-48 sm:w-56 lg:mx-0">
            <img
              src={BUNDLE.image}
              alt="The Complete Library bundle cover"
              className="w-full rounded-sm shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
              The whole library
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
              All ten guides for {formatUSD(BUNDLE.price)}.
            </h2>
            <p className="mt-3 max-w-xl text-stone-400">
              Bought separately the library costs {formatUSD(BUNDLE.compareAt ?? 0)}. The bundle saves
              you {formatUSD(saving)} and gives you every template, script and checklist in one place.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-stone-300 sm:grid-cols-2">
              {[
                `${PRODUCTS.length} PDFs, ${BUNDLE.pages} pages`,
                'Every template and checklist',
                'Free updates to each edition',
                '30-day money-back guarantee',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-amber-300" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBuyBundle}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-stone-900 transition-colors hover:bg-stone-100"
              >
                Buy now — {formatUSD(BUNDLE.price)}
                <ArrowRight size={18} />
              </motion.button>
              <button
                onClick={onBrowse}
                className="rounded-full px-2 py-1 text-sm font-medium text-stone-400 underline decoration-stone-600 underline-offset-4 transition-colors hover:text-white"
              >
                or buy the guides individually
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

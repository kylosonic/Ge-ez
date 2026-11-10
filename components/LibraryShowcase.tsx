import React from 'react';
import { BookOpen, ListChecks, CreditCard, RefreshCw } from 'lucide-react';
import { PRODUCTS, TOTAL_PAGES } from '../data/catalog';
import type { Product } from '../types';

interface LibraryShowcaseProps {
  onSelectProduct: (product: Product) => void;
}

const PILLARS = [
  {
    icon: BookOpen,
    title: 'One outcome per chapter',
    body: 'Chapters are short by design. Each one ends with a task, so you finish a sitting with something done rather than highlighted.',
  },
  {
    icon: ListChecks,
    title: 'Templates, not theory',
    body: 'Proposal scripts, audit forms, price tables, content calendars and checklists you can copy into your own work the same day.',
  },
  {
    icon: CreditCard,
    title: 'Payment routes that exist',
    body: 'Dedicated chapters on pricing in dollars and getting paid from countries where the usual processors do not operate.',
  },
  {
    icon: RefreshCw,
    title: 'Free updates, forever',
    body: 'Buy once. When an edition is revised you get the new PDF in your library, and the price only changes for new readers.',
  },
];

export const LibraryShowcase: React.FC<LibraryShowcaseProps> = ({ onSelectProduct }) => {
  return (
    <section id="inside" className="overflow-hidden bg-stone-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
              Inside the library
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">
              Ten guides, {TOTAL_PAGES} pages, one standard.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-stone-400 lg:justify-self-end">
            Every guide is written the same way: a problem worth paying for, the steps that solve it,
            and the scripts to sell the solution. Nothing is padded to hit a page count.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-stone-800 bg-stone-800/40 p-6 transition-colors hover:border-stone-700 hover:bg-stone-800/70"
            >
              <div className="mb-4 inline-flex rounded-lg bg-stone-800 p-2.5">
                <Icon className="text-stone-100" size={22} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-stone-400">{body}</p>
            </div>
          ))}
        </div>

        {/* The shelf */}
        <div className="border-t border-stone-800 pt-10">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-serif text-xl font-bold text-white">On the shelf</h3>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Tap a cover</span>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group w-28 flex-shrink-0 snap-start text-left sm:w-32"
                title={`${product.name} — ${product.pages} pages`}
              >
                <div className="overflow-hidden rounded-sm ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-1.5">
                  <img
                    src={product.image}
                    alt={`${product.name} cover`}
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-stone-400 group-hover:text-stone-200">
                  {product.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

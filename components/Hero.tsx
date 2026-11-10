import React from 'react';
import { ArrowDown, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { FREE_INDEX } from '../data/catalog';

interface HeroProps {
  onBrowse: () => void;
}

const PROOF = [
  {
    title: 'Written for your market',
    body: 'Every guide assumes you are selling from outside the usual hiring countries, and deals with payment routes that actually exist there.',
  },
  {
    title: 'Action, not theory',
    body: 'Each chapter ends in a task you can finish the same day: a script to send, a price table to fill in, a calendar to start.',
  },
  {
    title: 'Buy one, not a course',
    body: 'No subscription and no drip feed. One PDF, yours forever, and free updates when an edition is revised.',
  },
];

export const Hero: React.FC<HeroProps> = ({ onBrowse }) => {
  return (
    <section id="top" className="relative overflow-hidden border-b border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* No entrance animation here on purpose: above-the-fold copy must be
            painted on the first frame, without waiting for JavaScript. */}
        <div className="grid items-center gap-14 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              <span>10 guides</span>
              <span className="h-1 w-1 rounded-full bg-stone-400" />
              <span>907 pages</span>
              <span className="h-1 w-1 rounded-full bg-stone-400" />
              <span>Instant PDF download</span>
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Ten guides to
              <span className="block text-stone-500">earning online.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Short, practical playbooks for people who want the work explained without the gurus:
              what to sell, what to charge in dollars, how to get paid from where you live, and a
              calendar that ends in a real invoice.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBrowse}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-stone-800"
              >
                Browse the library <ArrowDown size={18} />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={FREE_INDEX.file}
                download
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-3.5 text-base font-medium text-stone-800 transition-colors hover:bg-stone-50"
              >
                <Download size={18} /> Free index
              </motion.a>
            </div>

            <div className="mt-10 space-y-4 border-t border-stone-200 pt-8">
              <h2 className="font-serif text-base font-bold text-stone-900">Why these guides</h2>
              <ul className="space-y-4 text-sm text-stone-600">
                {PROOF.map((item) => (
                  <li key={item.title} className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <span className="min-w-fit font-bold text-stone-900">{item.title}:</span>
                    <span>{item.body}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 font-serif text-lg italic text-stone-900">
                "No audience. No budget. Just a plan."
              </p>
            </div>
          </div>

          {/* Cover collage — built from the same SVGs the store sells */}
          <div className="relative mx-auto h-[440px] w-full max-w-lg sm:h-[520px]">
            <img
              src="/covers/01-first-500-dollars-online.svg"
              alt="The First $500 Online guide cover"
              className="absolute left-0 top-10 hidden w-[45%] -rotate-[9deg] rounded-sm shadow-xl ring-1 ring-black/10 sm:block"
            />
            <img
              src="/covers/complete-library.svg"
              alt="The Complete Library bundle cover"
              className="absolute right-0 top-0 hidden w-[42%] rotate-[7deg] rounded-sm shadow-xl ring-1 ring-black/10 sm:block"
            />
            <img
              src="/covers/06-sell-digital-products.svg"
              alt="Sell Digital Products guide cover"
              className="absolute left-1/2 top-14 z-10 w-[62%] -translate-x-1/2 rounded-sm shadow-2xl ring-1 ring-black/10 sm:top-20 sm:w-[54%]"
            />
            <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-lg">
              <FileText size={14} className="text-stone-500" />
              907 pages, delivered as PDF
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

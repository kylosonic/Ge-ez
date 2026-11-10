import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQ_ITEMS = [
  {
    question: 'What format are the guides?',
    answer:
      'Every guide is a PDF sized for both phone and laptop, with a linked table of contents. Your purchase stays available through Whop, and paid files are never exposed on this public storefront.',
  },
  {
    question: 'How do I get the files after paying?',
    answer:
      'Whop confirms your payment and opens the product immediately. Sign in to the same Whop account later to return to everything you purchased.',
  },
  {
    question: 'How do I pay?',
    answer:
      'Checkout is handled securely by Whop. The payment methods available to you are shown on the Whop checkout page.',
  },
  {
    question: 'Do I need an audience, a company or a big budget?',
    answer:
      'No. The guides are written for people starting with a phone, a laptop or a borrowed computer, no following and no registered business. Several chapters deal specifically with getting paid without a foreign company.',
  },
  {
    question: 'Are updates included?',
    answer:
      'Yes. When a guide is revised you get the new edition at no cost, and the price on this page only goes up for new buyers.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'Thirty days, any reason, even though the files are already downloaded. Reply to your receipt email and the refund is processed — no forms and no questions.',
  },
  {
    question: 'Can I share a guide with my team?',
    answer:
      'Purchases are a single-reader licence. Sharing the templates with your own clients is fine; redistributing the PDF is not. For team or classroom licences, contact us and we will price it.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-8 border-t border-stone-200 pt-6">
      <h3 className="mb-4 font-serif text-lg font-bold text-stone-900">Frequently asked questions</h3>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, index) => (
          <div key={item.question} className="overflow-hidden rounded-lg border border-stone-200">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between bg-stone-50 p-4 text-left transition-colors hover:bg-stone-100"
            >
              <span className="text-sm font-medium text-stone-900">{item.question}</span>
              {openIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="border-t border-stone-100 bg-white p-4 text-sm leading-relaxed text-stone-600">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

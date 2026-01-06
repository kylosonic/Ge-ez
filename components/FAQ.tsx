import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
    { question: 'What is the material?', answer: 'Our shirts are made from 100% premium Ethiopian cotton, known for its softness and durability.' },
    { question: 'How do I care for this item?', answer: 'Machine wash cold with like colors. Tumble dry low or hang dry for best results. Do not bleach.' },
    { question: 'What is your return policy?', answer: 'We offer free returns within 30 days of purchase. Items must be unworn and in original condition.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide! Shipping times vary by location but typically take 7-14 business days.' },
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
                {FAQ_ITEMS.map((item, index) => (
                    <div key={index} className="border border-stone-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-center p-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                        >
                            <span className="font-medium text-stone-900 text-sm">{item.question}</span>
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
                                    <div className="p-4 bg-white text-sm text-stone-600 border-t border-stone-100">
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

import React from 'react';
import { Star } from 'lucide-react';

const MOCK_REVIEWS = [
    { id: 1, user: 'Sarah M.', rating: 5, date: '2 days ago', text: 'Absolutely love the quality! The fabric feels premium and fits perfectly.' },
    { id: 2, user: 'Michael K.', rating: 5, date: '1 week ago', text: 'Great design, exactly like the photos. Shipping was super fast too.' },
    { id: 3, user: 'Jessica T.', rating: 4, date: '2 weeks ago', text: 'Beautiful shirt. Sizing runs slightly large, but I like the oversized fit.' },
];

export const ReviewSection = () => {
    return (
        <div className="mt-12 pt-10 border-t border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-serif mb-6">Customer Reviews</h3>
            <div className="space-y-6">
                {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-stone-100 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-stone-900">{review.user}</span>
                                <span className="text-xs text-stone-500">{review.date}</span>
                            </div>
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-stone-300"} />
                                ))}
                            </div>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed">{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

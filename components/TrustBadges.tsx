import React from 'react';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const TrustBadges = () => {
    return (
        <div className="grid grid-cols-3 gap-4 py-6 border-t border-stone-200 my-6">
            <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-stone-900" />
                <span className="text-xs font-medium text-stone-600">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-stone-900" />
                <span className="text-xs font-medium text-stone-600">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="w-6 h-6 text-stone-900" />
                <span className="text-xs font-medium text-stone-600">Free Returns</span>
            </div>
        </div>
    );
};

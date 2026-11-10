import React from 'react';
import { CreditCard, Infinity, ShieldCheck } from 'lucide-react';

export const TrustBadges = () => {
  return (
    <div className="my-6 grid grid-cols-3 gap-4 border-t border-stone-200 py-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <CreditCard className="h-6 w-6 text-stone-900" />
        <span className="text-xs font-medium text-stone-600">Secure Whop checkout</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <Infinity className="h-6 w-6 text-stone-900" />
        <span className="text-xs font-medium text-stone-600">Instant access + updates</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <ShieldCheck className="h-6 w-6 text-stone-900" />
        <span className="text-xs font-medium text-stone-600">30-day guarantee</span>
      </div>
    </div>
  );
};

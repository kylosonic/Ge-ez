import React, { useEffect, useMemo } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { Checkout, CheckoutElement, WhopElements } from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import type { Product } from '../types';

const whopElements = loadWhop();

interface WhopCheckoutModalProps {
  product: Product | null;
  onClose: () => void;
}

export const WhopCheckoutModal: React.FC<WhopCheckoutModalProps> = ({ product, onClose }) => {
  const orderId = useMemo(
    () => (product ? `${product.slug}-${Date.now()}` : ''),
    [product?.slug],
  );

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const returnUrl =
    `${window.location.origin}/checkout/return` +
    `?order=${encodeURIComponent(orderId)}` +
    `&product=${encodeURIComponent(product.slug)}`;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <button
        type="button"
        className="fixed inset-0 cursor-default bg-black/65 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close checkout"
      />

      <div className="relative flex min-h-full items-center justify-center p-3 sm:p-6">
        <section className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4 sm:px-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Secure checkout
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-stone-950">{product.name}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              aria-label="Close checkout"
            >
              <X size={21} />
            </button>
          </div>

          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto bg-stone-50 p-3 sm:p-5">
            <WhopElements elements={whopElements}>
              <Checkout
                key={product.slug}
                plan={product.planId}
                metadata={{
                  order_id: orderId,
                  product_slug: product.slug,
                }}
                returnUrl={returnUrl}
                locale="en"
                analytics={false}
                fallback={
                  <div className="flex min-h-48 items-center justify-center rounded-xl bg-white text-sm text-stone-500">
                    Loading secure checkout…
                  </div>
                }
              >
                <CheckoutElement />
              </Checkout>
            </WhopElements>
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-stone-200 bg-white px-5 py-3 text-xs text-stone-500">
            <ShieldCheck size={14} className="text-emerald-700" />
            Payment is processed securely by Whop. Your download is released after verification.
          </div>
        </section>
      </div>
    </div>
  );
};

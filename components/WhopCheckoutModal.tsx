import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  Checkout,
  CheckoutElement,
  WhopElements,
} from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import type { Product } from '../types';

const whopElements = loadWhop();

interface WhopCheckoutModalProps {
  product: Product | null;
  onClose: () => void;
}

type CheckoutStage = 'email' | 'checking' | 'payment' | 'owned' | 'error';

function savedCheckoutEmail() {
  try {
    return window.sessionStorage.getItem('geez-checkout-email') || '';
  } catch {
    return '';
  }
}

function rememberCheckoutEmail(email: string) {
  try {
    window.sessionStorage.setItem('geez-checkout-email', email);
  } catch {
    // Checkout still works when browser storage is unavailable.
  }
}

export const WhopCheckoutModal: React.FC<WhopCheckoutModalProps> = ({ product, onClose }) => {
  const [stage, setStage] = useState<CheckoutStage>('email');
  const [email, setEmail] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const orderId = useMemo(
    () => (product ? `${product.slug}-${Date.now()}` : ''),
    [product?.slug],
  );

  useEffect(() => {
    if (!product) return;
    setStage('email');
    setCheckoutEmail('');
    setErrorMessage('');
    setEmail(savedCheckoutEmail());
  }, [product]);

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStage('error');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setStage('checking');
    setErrorMessage('');

    try {
      const response = await fetch('/api/check-entitlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ email: normalizedEmail, planId: product.planId }),
      });
      const payload = await response.json();

      if (response.status === 409 && payload.status === 'owned') {
        setStage('owned');
        setErrorMessage(payload.message);
        return;
      }

      if (!response.ok || payload.status !== 'allowed') {
        setStage('error');
        setErrorMessage(payload.message || 'We could not check this email. Please try again.');
        return;
      }

      rememberCheckoutEmail(payload.email);
      setEmail(payload.email);
      setCheckoutEmail(payload.email);
      setStage('payment');
    } catch {
      setStage('error');
      setErrorMessage('We could not check this email. Check your connection and try again.');
    }
  };

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
        <section className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
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

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-stone-50 p-3 sm:p-5">
            {stage === 'email' || stage === 'checking' || stage === 'error' ? (
              <form
                onSubmit={submitEmail}
                className="mx-auto flex min-h-72 max-w-md flex-col justify-center rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800">
                  <Mail size={20} />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-stone-950">
                  First, enter your email
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  We will check that this email does not already own the guide, then take you
                  straight to Whop payment. Your email is locked for this checkout.
                </p>
                <label
                  htmlFor="checkout-email"
                  className="mt-5 text-sm font-semibold text-stone-800"
                >
                  Email address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (stage === 'error') {
                      setStage('email');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-base text-stone-950 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                />
                {stage === 'error' && errorMessage && (
                  <div
                    role="alert"
                    className="mt-3 flex gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  >
                    <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={stage === 'checking' || !email.trim()}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {stage === 'checking' ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Checking ownership…
                    </>
                  ) : (
                    'Continue to secure payment'
                  )}
                </button>
                <p className="mt-3 text-center text-[11px] leading-5 text-stone-500">
                  One email per licence. This check prevents buying the same guide twice.
                </p>
              </form>
            ) : stage === 'owned' ? (
              <div className="mx-auto flex min-h-72 max-w-md flex-col justify-center rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200 sm:p-8">
                <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" />
                <h3 className="mt-4 font-serif text-2xl font-bold text-stone-950">
                  You already own this
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{errorMessage}</p>
                <a
                  href="https://whop.com/geez-digital/"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Open Whop library
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setStage('email');
                    setErrorMessage('');
                  }}
                  className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950"
                >
                  <ArrowLeft size={15} /> Use a different email
                </button>
              </div>
            ) : (
              <WhopElements elements={whopElements}>
                <Checkout
                  key={`${product.slug}:${checkoutEmail}`}
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
                  <CheckoutElement buyerEmail={checkoutEmail} lockBuyerEmail />
                </Checkout>
              </WhopElements>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center justify-center gap-2 border-t border-stone-200 bg-white px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-center text-xs text-stone-500">
            <ShieldCheck size={14} className="text-emerald-700" />
            Payment is processed securely by Whop. Your download is released after verification.
          </div>
        </section>
      </div>
    </div>
  );
};

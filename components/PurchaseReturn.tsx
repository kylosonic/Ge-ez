import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Download, LoaderCircle, XCircle } from 'lucide-react';

interface DownloadItem {
  slug: string;
  name: string;
  filename: string;
}

interface PurchaseReturnProps {
  paymentId: string | null;
  paymentStatus: string | null;
  productSlug: string | null;
  onReturnHome: () => void;
}

type VerificationState =
  | { status: 'checking' }
  | { status: 'ready'; downloads: DownloadItem[] }
  | { status: 'pending'; message: string }
  | { status: 'error'; message: string };

export const PurchaseReturn: React.FC<PurchaseReturnProps> = ({
  paymentId,
  paymentStatus,
  productSlug,
  onReturnHome,
}) => {
  const [state, setState] = useState<VerificationState>({ status: 'checking' });

  useEffect(() => {
    if (paymentStatus === 'failed' || paymentStatus === 'canceled') {
      setState({
        status: 'error',
        message: 'The payment was not completed and you were not charged.',
      });
      return;
    }

    if (!paymentId || !/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
      setState({ status: 'error', message: 'This payment link is missing or invalid.' });
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    const verify = async () => {
      attempts += 1;
      try {
        const params = new URLSearchParams({ payment: paymentId });
        if (productSlug) params.set('product', productSlug);
        const response = await fetch(`/api/verify-payment?${params}`, { cache: 'no-store' });
        const payload = await response.json();

        if (cancelled) return;

        if (response.ok && payload.status === 'paid') {
          setState({ status: 'ready', downloads: payload.downloads });
          return;
        }

        if (attempts < 12 && (response.status === 409 || response.status >= 500)) {
          setState({ status: 'checking' });
          timer = window.setTimeout(verify, 1500);
          return;
        }

        setState({
          status: payload.status === 'open' ? 'pending' : 'error',
          message: payload.message || 'We could not verify this payment.',
        } as VerificationState);
      } catch {
        if (attempts < 12 && !cancelled) {
          timer = window.setTimeout(verify, 1500);
          return;
        }
        if (!cancelled) {
          setState({
            status: 'error',
            message: 'We could not verify the payment. Please try again shortly.',
          });
        }
      }
    };

    verify();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [paymentId, paymentStatus, productSlug]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <section className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-7 shadow-xl sm:p-10">
        {state.status === 'checking' && (
          <div className="py-10 text-center">
            <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-stone-700" />
            <h1 className="mt-5 font-serif text-3xl font-bold text-stone-950">
              Verifying your payment
            </h1>
            <p className="mt-3 text-stone-500">This usually takes only a few seconds.</p>
          </div>
        )}

        {state.status === 'ready' && (
          <div>
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            <h1 className="mt-5 font-serif text-3xl font-bold text-stone-950">
              Payment confirmed
            </h1>
            <p className="mt-3 text-stone-600">
              Your purchase is ready. Download your PDF{state.downloads.length === 1 ? '' : 's'} now.
            </p>
            <div className="mt-7 space-y-3">
              {state.downloads.map((item) => (
                <a
                  key={item.slug}
                  href={`/api/download?payment=${encodeURIComponent(paymentId!)}&slug=${encodeURIComponent(item.slug)}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 font-semibold text-stone-900 transition hover:border-stone-300 hover:bg-stone-100"
                >
                  <span>{item.name}</span>
                  <Download size={18} className="flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {(state.status === 'pending' || state.status === 'error') && (
          <div>
            {state.status === 'pending' ? (
              <LoaderCircle className="h-12 w-12 text-amber-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
            <h1 className="mt-5 font-serif text-3xl font-bold text-stone-950">
              {state.status === 'pending' ? 'Payment still processing' : 'Checkout not completed'}
            </h1>
            <p className="mt-3 leading-relaxed text-stone-600">{state.message}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onReturnHome}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-950"
        >
          <ArrowLeft size={16} /> Back to the library
        </button>
      </section>
    </main>
  );
};

import React from 'react';
import { Download, ArrowUp, ExternalLink } from 'lucide-react';
import { FREE_INDEX } from '../data/catalog';

interface FooterProps {
  onBrowse: () => void;
  onBuyBundle: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBrowse, onBuyBundle }) => {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-2 text-white">
              <span className="font-serif text-2xl font-bold">Ge'ez</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Digital
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              A library of short, practical playbooks for earning online from anywhere. Ten
              guides, 907 pages, no subscriptions.
            </p>
            <a
              href="https://whop.com/geez-digital/"
              className="mt-5 inline-flex items-center gap-2 text-sm text-stone-300 transition-colors hover:text-white"
            >
              Visit the Whop store <ExternalLink size={14} />
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Library
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={onBrowse} className="transition-colors hover:text-white">
                  All ten guides
                </button>
              </li>
              <li>
                <button onClick={onBuyBundle} className="transition-colors hover:text-white">
                  The Complete Library
                </button>
              </li>
              <li>
                <a
                  href={FREE_INDEX.file}
                  download
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  Free index <Download size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Checkout
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>Secure payment by Whop</li>
              <li>Immediate digital access</li>
              <li>Updates through Whop</li>
              <li>
                <a
                  href="https://whop.com/home/"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  Open my library <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-stone-800 pt-6 text-xs sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Ge'ez Digital. All guides are digital products.</p>
          <div className="flex items-center gap-5">
            <span>Prices in USD</span>
            <span className="hidden sm:inline">Checkout powered by Whop</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              Back to top <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

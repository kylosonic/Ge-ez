import React, { useState } from 'react';
import { Menu, X, ExternalLink, Download } from 'lucide-react';
import { FREE_INDEX } from '../data/catalog';

const NAV_LINKS = [
  { label: 'Guides', id: 'library' },
  { label: 'Bundle', id: 'bundle' },
  { label: 'Inside', id: 'inside' },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top, behavior: 'smooth' });
}

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="-ml-2 p-2 text-stone-600 hover:text-black md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="#top" className="flex items-baseline gap-2 text-stone-900">
              <span className="font-serif text-xl font-bold tracking-tight sm:text-2xl">Ge'ez</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 sm:text-[11px]">
                Digital
              </span>
            </a>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-black"
              >
                {link.label}
              </button>
            ))}
            <a
              href={FREE_INDEX.file}
              download
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-black"
            >
              Free index <Download size={13} />
            </a>
            <a
              href="https://whop.com/home/"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
            >
              My Whop library <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="space-y-1 border-t border-stone-200 py-3 md:hidden">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  scrollToSection(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {link.label}
              </button>
            ))}
            <a
              href={FREE_INDEX.file}
              download
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              <Download size={15} /> Free index
            </a>
            <a
              href="https://whop.com/home/"
              className="flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2.5 text-sm font-semibold text-white"
            >
              <ExternalLink size={15} /> My Whop library
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

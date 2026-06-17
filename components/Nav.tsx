"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '#overview', label: 'Overview' },
  { href: '#the-crimes', label: 'Crimes' },
  { href: '#survivor-testimony', label: 'Testimony' },
  { href: '#demographics-culture', label: 'Demographics' },
  { href: '#influence-of-islam', label: 'Islam' },
  { href: '#institutional-failures', label: 'Institutions' },
  { href: '#political-failure', label: 'Politics' },
  { href: '#recommendations', label: 'Recommendations' },
  { href: '/full-report', label: 'Full Report' },
];

interface NavProps {
  activeSection: string;
}

export function Nav({ activeSection }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="max-w-[var(--page-max)] mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <a
            href="#top"
            className="font-semibold tracking-tight text-[var(--text)] ui-label text-xs sm:text-sm shrink-0 no-underline hover:text-[var(--text)]"
          >
            THE RAPE GANG INQUIRY
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-x-4 xl:gap-x-5">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#')
                ? activeSection === item.href.slice(1)
                : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-[var(--bg)]/98 backdrop-blur-sm">
          <div className="px-5 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#')
                ? activeSection === item.href.slice(1)
                : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 ui-label text-base border-l-2 transition-colors no-underline ${
                    isActive
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-subtle)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
"use client";

import React, { useState } from 'react';

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

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.mobile-nav-container')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#262626]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          <a href="#top" className="font-semibold tracking-tight text-[#f5f5f4] ui-label text-sm md:text-base shrink-0">THE RAPE GANG INQUIRY</a>

          {/* Desktop nav - compact, fits all items cleanly without scroll */}
          <div className="hidden lg:flex items-center gap-x-2.5 xl:gap-x-3.5 text-[13px] xl:text-sm">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#')
                ? activeSection === item.href.slice(1)
                : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`ui-label whitespace-nowrap px-1 py-0.5 transition-colors ${isActive ? 'active text-[#7f1d1d] font-medium' : 'text-[#a3a3a3] hover:text-[#f5f5f4]'}`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Mobile / Tablet menu button + improved dropdown */}
          <div className="lg:hidden relative mobile-nav-container">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ui-label text-xs px-3 py-1.5 border border-[#262626] rounded hover:bg-[#1a1a1a] focus:outline focus:outline-2 focus:outline-[#7f1d1d] active:bg-[#222]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#0f0f0f] border border-[#262626] rounded-md shadow-xl py-1.5 z-50 text-sm">
                {navItems.map((item) => {
                  const isActive = item.href.startsWith('#')
                    ? activeSection === item.href.slice(1)
                    : false;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 ui-label transition-colors ${isActive ? 'text-[#7f1d1d] bg-[#1a1a1a]' : 'text-[#c9c9c9] hover:bg-[#1a1a1a] hover:text-[#f5f5f4]'}`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

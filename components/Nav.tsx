"use client";

import React from 'react';

const navItems = [
  { href: '#overview', label: 'Overview' },
  { href: '#the-crimes', label: 'The Crimes' },
  { href: '#survivor-testimony', label: 'Survivor Testimony' },
  { href: '#demographics-culture', label: 'Demographics & Culture' },
  { href: '#influence-of-islam', label: 'The Influence of Islam' },
  { href: '#institutional-failures', label: 'Institutional Failures' },
  { href: '#political-failure', label: 'Political Failure' },
  { href: '#recommendations', label: 'Recommendations' },
  { href: '/full-report', label: 'Full Report' },
];

interface NavProps {
  activeSection: string;
}

export function Nav({ activeSection }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#262626]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between py-3 text-sm">
          <a href="#top" className="font-semibold tracking-tight text-[#f5f5f4] ui-label">THE RAPE GANG INQUIRY</a>
          {/* Desktop + mobile: horizontally scrollable nav for all items (serious record must be navigable at every width) */}
          <div className="flex items-center gap-x-4 overflow-x-auto pb-1 -mb-1 text-sm">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#')
                ? activeSection === item.href.slice(1)
                : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`ui-label whitespace-nowrap px-1 py-1 transition-colors flex-shrink-0 ${isActive ? 'active text-[#7f1d1d]' : 'text-[#a3a3a3] hover:text-[#f5f5f4]'}`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import React from 'react';

const regionInfo: Record<string, string> = {
  YORKSHIRE: 'Yorkshire & Humber — heavily affected (Rotherham, Bradford, Huddersfield, Leeds, Sheffield and surrounding districts).',
  'GTR MANCHESTER': 'Greater Manchester & Lancashire — Rochdale, Tameside, Oldham, Bolton, Blackburn and many others.',
  'WEST MIDS': 'West Midlands — Birmingham, Telford, Walsall, Wolverhampton, Coventry area.',
  LONDON: 'London — major under-reported epicentre with widespread activity across multiple boroughs.'
};

const regionPositions = [
  { region: 'YORKSHIRE' as const, x: 320, y: 260, w: 80, h: 22, label: 'YORKSHIRE' },
  { region: 'GTR MANCHESTER' as const, x: 280, y: 295, w: 110, h: 22, label: 'GTR MANCHESTER' },
  { region: 'WEST MIDS' as const, x: 290, y: 375, w: 80, h: 22, label: 'WEST MIDS' },
  { region: 'LONDON' as const, x: 345, y: 460, w: 60, h: 22, label: 'LONDON' },
];

interface UKMapProps {
  selectedRegion: string | null;
  onSelectRegion: (region: string) => void;
}

export function UKMap({ selectedRegion, onSelectRegion }: UKMapProps) {
  return (
    <div className="my-8">
      <svg viewBox="0 0 620 720" className="w-full max-w-[520px] mx-auto" role="img" aria-labelledby="map-title" aria-describedby="map-desc">
        <title id="map-title">Map of United Kingdom — 149 local authority districts affected</title>
        <desc id="map-desc">Stylized outline highlighting concentrations in Yorkshire, Greater Manchester, West Midlands, and London.</desc>
        <rect x="0" y="0" width="620" height="720" fill="var(--bg-elevated)" rx="4" />
        <path d="M300 40 Q340 80 310 160 Q280 220 320 280 Q300 340 340 400 Q310 480 290 560 Q260 620 280 680" fill="none" stroke="var(--border)" strokeWidth="18" strokeLinecap="round" />
        <path d="M220 120 Q260 160 240 240 Q210 300 250 380 Q230 450 210 520 Q190 580 220 650" fill="none" stroke="var(--border)" strokeWidth="14" />
        <path d="M280 300 Q240 340 260 420 Q290 480 260 550" fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle cx="170" cy="280" r="22" fill="var(--bg-subtle)" stroke="var(--border)" />
        <g fill="var(--accent-muted)" opacity="0.8">
          <circle cx="310" cy="280" r="18" />
          <circle cx="270" cy="310" r="14" />
          <circle cx="290" cy="390" r="15" />
          <circle cx="340" cy="480" r="16" />
          <circle cx="260" cy="370" r="10" />
          <circle cx="295" cy="260" r="12" />
        </g>
        {regionPositions.map(({ region, x, y, w, h, label }) => {
          const isSelected = selectedRegion === region;
          return (
            <g
              key={region}
              className="cursor-pointer"
              onClick={() => onSelectRegion(region)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectRegion(region); } }}
            >
              <rect
                x={x - w / 2}
                y={y - 14}
                width={w}
                height={h}
                rx="3"
                fill={isSelected ? 'var(--accent-muted)' : 'var(--bg-subtle)'}
                stroke={isSelected ? 'var(--accent)' : 'var(--border)'}
                strokeWidth="1"
              />
              <text
                x={x}
                y={y}
                fill={isSelected ? 'var(--text)' : 'var(--text-secondary)'}
                fontSize="11"
                className="ui-label"
                textAnchor="middle"
                fontWeight={isSelected ? '600' : '400'}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {selectedRegion && (
        <div className="info-panel max-w-[520px] mx-auto" role="status">
          <strong className="ui-label text-[var(--text)]">{selectedRegion}:</strong>{' '}
          <span className="text-[var(--text-secondary)]">{regionInfo[selectedRegion]}</span>
        </div>
      )}

      <p className="text-center text-xs text-[var(--text-faint)] mt-3 ui-label max-w-lg mx-auto leading-relaxed">
        149 local authority districts (Appendix IV). Red markers show major documented concentrations. Click labels for details.
      </p>
    </div>
  );
}
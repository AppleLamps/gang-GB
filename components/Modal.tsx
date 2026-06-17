"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  contentWarning?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, contentWarning, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef<number>(0);

  // Body scroll lock + restore position
  useEffect(() => {
    if (!open) return;

    scrollYRef.current = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  // Focus trap + return focus
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    // Focus the close button (or dialog) on open
    const t = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(t);
      // Return focus
      if (previouslyFocused.current && document.body.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto pt-10 pb-16 modal-overlay"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-4xl mx-4 rounded-lg modal-content shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#262626] px-6 py-4">
          <h2 id="modal-title" className="text-xl font-semibold pr-8 text-[#f5f5f4]">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-[#a3a3a3] hover:text-[#f5f5f4] p-1 rounded focus:outline focus:outline-2 focus:outline-[#7f1d1d]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Optional content warning */}
        {contentWarning && (
          <div className="mx-6 mt-6 rounded-md p-4 content-warning" role="alert">
            <p className="font-semibold text-sm tracking-wide">CONTENT WARNING</p>
            <p className="mt-1 text-sm">{contentWarning}</p>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6 max-h-[72vh] overflow-y-auto text-[15.5px] leading-relaxed text-[#e5e5e5]">
          {children}
        </div>

        {/* Footer close */}
        <div className="border-t border-[#262626] px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-[#262626] hover:bg-[#1a1a1a] focus:outline focus:outline-2 focus:outline-[#7f1d1d]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

"use client";

import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!open) return;

    scrollYRef.current = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

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
      if (previouslyFocused.current && document.body.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center modal-overlay"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full sm:max-w-3xl lg:max-w-4xl sm:mx-4 sm:rounded-lg modal-content sm:max-h-[90vh] flex flex-col max-h-[95vh] rounded-t-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[var(--border-subtle)] px-5 sm:px-6 py-4 shrink-0">
          <h2 id="modal-title" className="text-lg sm:text-xl font-semibold pr-4 text-[var(--text)] leading-snug">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1.5 -mr-1.5 rounded shrink-0"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {contentWarning && (
          <div className="mx-5 sm:mx-6 mt-5 rounded-sm p-4 content-warning shrink-0" role="alert">
            <p className="font-semibold text-xs tracking-widest ui-label">CONTENT WARNING</p>
            <p className="mt-1.5 text-sm leading-relaxed">{contentWarning}</p>
          </div>
        )}

        <div className="modal-body px-5 sm:px-6 py-5 sm:py-6 flex-1 overflow-y-auto">
          {children}
        </div>

        <div className="border-t border-[var(--border-subtle)] px-5 sm:px-6 py-3.5 flex justify-end shrink-0">
          <button onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
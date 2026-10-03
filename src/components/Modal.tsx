import React, { useEffect } from 'react';
import { cn } from '../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  tone?: 'default' | 'beast' | 'gold';
}

export function Modal({ isOpen, onClose, children, tone = 'default' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'w-full sm:max-w-sm animate-rise rounded-t-3xl sm:rounded-3xl border p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl',
          tone === 'beast' && 'bg-gradient-to-b from-rose-50 to-white dark:from-rose-950 dark:to-ink-950 border-rose-500/30',
          tone === 'gold' && 'bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/80 dark:to-ink-950 border-amber-400/30',
          tone === 'default' && 'bg-white dark:bg-ink-900 border-slate-200 dark:border-white/10'
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20 sm:hidden" />
        {children}
      </div>
    </div>
  );
}

export function ModalButton({
  onClick, children, variant = 'primary', className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'beast' | 'ghost' | 'gold';
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-12 rounded-2xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]',
        variant === 'primary' && 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25',
        variant === 'beast' && 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25',
        variant === 'gold' && 'bg-amber-400 hover:bg-amber-300 text-ink-950 shadow-lg shadow-amber-400/20',
        variant === 'ghost' && 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200',
        className
      )}
    >
      {children}
    </button>
  );
}

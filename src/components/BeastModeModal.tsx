import React from 'react';
import { Zap } from 'lucide-react';
import { Modal, ModalButton } from './Modal';

interface BeastModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  onStart: () => void;
}

export function BeastModeModal({ isOpen, onClose, onOverlayClick, onStart }: BeastModeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onOverlayClick} tone="beast">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20">
          <Zap className="h-8 w-8 text-rose-600 dark:text-rose-300" />
        </div>
        <h2 className="font-display text-3xl font-bold">Beast Mode</h2>
        <p className="mt-2 mb-6 text-rose-700 dark:text-rose-100/80">
          Not for everyone. 12 seconds to fill the whole board, no number changes.
          Win and you get <b className="text-rose-700 dark:text-rose-200">3 brags</b> instead of 1.
        </p>
        <div className="space-y-2.5">
          <ModalButton onClick={onStart} variant="beast">Start Beast Mode</ModalButton>
          <ModalButton onClick={onClose} variant="ghost">Maybe later</ModalButton>
        </div>
      </div>
    </Modal>
  );
}

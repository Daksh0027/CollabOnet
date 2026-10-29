import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-150">
      <div
        className={cn(
          'relative w-full max-w-lg rounded-[8px] border border-[#e0dfdc] bg-white p-5 shadow-xl text-[#191919] animate-in zoom-in-95 duration-150',
          className
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#e8e7e3]">
          <div>
            {title && <h3 className="text-base font-semibold text-[#191919]">{title}</h3>}
            {description && <p className="text-xs text-[#666666] mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="py-4 text-[#191919]">{children}</div>
      </div>
    </div>
  );
}

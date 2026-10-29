import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 disabled:opacity-40 disabled:pointer-events-none rounded-full select-none cursor-pointer tracking-tight';

    const variants = {
      primary:
        'bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.98] shadow-sm',
      secondary:
        'bg-neutral-100 text-neutral-900 hover:bg-neutral-200/80 active:scale-[0.98] border border-neutral-200/60',
      outline:
        'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98]',
      ghost:
        'bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80',
      destructive:
        'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm',
      accent:
        'bg-[#0057FF] text-white hover:bg-[#0047D6] active:scale-[0.98] shadow-sm shadow-[#0057FF]/25',
      emerald:
        'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm shadow-emerald-600/20',
    };

    const sizes = {
      sm: 'h-8 px-3.5 text-xs gap-1.5',
      md: 'h-9 px-4 text-xs gap-2',
      lg: 'h-11 px-6 text-sm gap-2.5',
      icon: 'h-8 w-8 p-0 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

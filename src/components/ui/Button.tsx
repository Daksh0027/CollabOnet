import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2] disabled:opacity-50 disabled:pointer-events-none rounded-full select-none cursor-pointer';
    
    const variants = {
      primary: 'bg-[#0a66c2] text-white hover:bg-[#004182] active:bg-[#003163]',
      secondary: 'bg-[#edf3f8] text-[#0a66c2] hover:bg-[#d0e8ff] active:bg-[#b8ddff]',
      outline: 'border border-[#0a66c2] bg-white text-[#0a66c2] hover:bg-[#ebf4fd] hover:border-[#004182]',
      ghost: 'bg-transparent text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919]',
      destructive: 'bg-[#cc1016] text-white hover:bg-[#b20d13] active:bg-[#990a10]',
      accent: 'bg-[#057642] text-white hover:bg-[#046237] active:bg-[#034d2b]',
    };

    const sizes = {
      sm: 'h-8 px-3.5 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
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

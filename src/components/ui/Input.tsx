import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-[4px] border border-[#b2b2b2] bg-white px-3 py-1.5 text-sm text-[#191919] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a66c2] focus-visible:border-[#0a66c2] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

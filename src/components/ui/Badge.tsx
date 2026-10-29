import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent' | 'warning' | 'destructive' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#ebf4fd] text-[#0a66c2] border-[#cce4f9]',
    secondary: 'bg-[#f3f2ef] text-[#5e5e5e] border-[#e0dfdc]',
    outline: 'border-[#c7c7c7] text-[#191919] bg-white',
    accent: 'bg-[#e6f4ea] text-[#057642] border-[#c6ebd1]',
    warning: 'bg-[#fef3d6] text-[#915907] border-[#f9e2a8]',
    destructive: 'bg-[#ffedea] text-[#cc1016] border-[#fcd4cd]',
    info: 'bg-[#edf3f8] text-[#0a66c2] border-[#d0e8ff]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

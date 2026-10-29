import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent' | 'warning' | 'destructive' | 'info' | 'emerald';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 border-neutral-200/80',
    secondary: 'bg-neutral-100/70 text-neutral-600 border-neutral-200/50',
    outline: 'border-neutral-200 text-neutral-800 bg-white/80',
    accent: 'bg-[#0057FF]/10 text-[#0057FF] border-[#0057FF]/25',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/70',
    destructive: 'bg-rose-50 text-rose-700 border-rose-200/70',
    info: 'bg-sky-50 text-sky-700 border-sky-200/60',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-tight transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

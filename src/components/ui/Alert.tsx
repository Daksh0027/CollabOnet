import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'accent' | 'info';
}

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  const variants = {
    default: 'bg-[#f4f2ee] border-[#e0dfdc] text-[#191919]',
    destructive: 'bg-[#fff5f5] border-[#fcd4cd] text-[#cc1016]',
    warning: 'bg-[#fffbeb] border-[#f9e2a8] text-[#915907]',
    accent: 'bg-[#f0fbf4] border-[#c6ebd1] text-[#057642]',
    info: 'bg-[#f0f7fe] border-[#cce4f9] text-[#0a66c2]',
  };

  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-[8px] border p-3.5 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-3.5', variants[variant], className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mb-1 font-semibold text-sm leading-none tracking-tight', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-xs leading-relaxed opacity-90', className)} {...props} />;
}

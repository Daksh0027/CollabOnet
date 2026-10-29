import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "violet" | "mono";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const variantStyles = {
    default: "bg-[#1c1d20] text-neutral-300 border-[#2a2b2f]",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-800/60",
    warning: "bg-amber-950/40 text-amber-400 border-amber-800/60",
    danger: "bg-rose-950/40 text-rose-400 border-rose-800/60",
    violet: "bg-violet-950/40 text-violet-400 border-violet-800/60",
    mono: "bg-[#16171a] text-neutral-400 border-[#26272b] font-mono",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

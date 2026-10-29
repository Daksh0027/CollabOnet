import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-[#121316] border border-[#222326] rounded-lg p-5 shadow-sm transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

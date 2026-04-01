"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  theme?: "light" | "dark";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, icon, theme = "dark", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    const isLight = theme === "light";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn("block text-xs font-bold uppercase tracking-widest font-sans ml-1", 
              isLight ? "text-slate-500 dark:text-gray-400" : "text-white/50"
            )}
           >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
              isLight ? "text-slate-400 dark:text-gray-500 group-focus-within:text-[#9333EA]" : "text-white/40 group-focus-within:text-[#9333EA]"
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-12 rounded-[1rem] px-5 text-sm transition-all duration-300 outline-none backdrop-blur-md",
              isLight ? "bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-gray-200 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-[#9333EA]/50 focus:bg-white dark:focus:bg-[#141414] focus:ring-4 focus:ring-[#9333EA]/10 group-hover:border-slate-300 dark:group-hover:border-[#333333] shadow-sm" : "bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#9333EA]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#9333EA]/10 group-hover:border-white/20",
              error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" : "",
              icon ? "pl-12" : "",
              className
            )}
            {...props}
          />

          {/* Subtle bottom border glow on focus */}
          <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-focus-within:w-full transition-all duration-500 rounded-full",
            isLight ? "bg-[#9333EA] shadow-[0_0_10px_#9333EA]" : "bg-[#9333EA] shadow-[0_0_10px_#9333EA]"
          )} />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-400 font-medium ml-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;


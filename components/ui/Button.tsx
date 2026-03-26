"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "cosmic" | "dashboard";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "relative inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] overflow-hidden group font-sans";

    const variants = {
      primary:
        "bg-[#9333EA] text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-[#9333EA]/20",
      secondary:
        "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md",
      cosmic:
        "bg-gradient-to-r from-ai-blue to-ai-purple text-white shadow-[0_0_20px_rgba(124,77,255,0.3)] hover:shadow-[0_0_30px_rgba(124,77,255,0.5)]",
      ghost: "hover:bg-white/5 text-white/70 hover:text-white",
      outline:
        "border border-white/20 bg-transparent hover:bg-white/5 text-white/80 hover:text-white",
      danger:
        "bg-red-500/80 text-white hover:bg-red-600 border border-red-500/20",
      dashboard:
        "bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 border-none",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-7 text-sm",
      lg: "h-14 px-10 text-base",
    };

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        disabled={disabled || loading}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : null}
          {children as React.ReactNode}
        </span>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;


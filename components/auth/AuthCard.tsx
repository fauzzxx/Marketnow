"use client";

import { type ReactNode } from "react";

import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center gap-2 group">
          <div className="relative h-12 w-28 scale-125 transition-transform group-hover:scale-135">
            <svg viewBox="0 0 120 40" className="h-full w-full">
              {/* M */}
              <path d="M5 35 V10 L15 25 L25 10 V35" fill="none" stroke="#005A9C" strokeWidth="6" strokeLinejoin="round" />
              {/* N */}
              <path d="M30 35 V10 L45 35 V10" fill="none" stroke="#FF6422" strokeWidth="6" strokeLinejoin="round" />
              {/* Arrow */}
              <path d="M45 35 L65 5 M65 5 L55 5 M65 5 L65 15" fill="none" stroke="#00AEEF" strokeWidth="4" strokeLinecap="round" />
              {/* Clock Circle */}
              <circle cx="85" cy="25" r="12" fill="none" stroke="#005A9C" strokeWidth="3" />
              {/* Clock Face */}
              <circle cx="85" cy="25" r="1" fill="#FF6422" />
              <path d="M85 25 L85 18" stroke="#005A9C" strokeWidth="2" strokeLinecap="round" />
              <path d="M85 25 L92 25" stroke="#FF6422" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter text-[#1B1040]">MARKET NOW</span>
        </Link>
      </div>
      <div className="rounded-3xl border border-border/10 bg-white/70 backdrop-blur-2xl shadow-2xl p-8 pt-10 ring-1 ring-[#1B1040]/5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-[#1B1040]">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm font-medium text-gray-500">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

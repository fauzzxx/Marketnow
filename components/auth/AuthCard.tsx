"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Rocket, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center"
      >
        <Link href="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-ai-purple flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white font-sans tracking-tighter uppercase leading-none">Market <span className="text-primary">Now</span></span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mt-1">Intelligence Platform</span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-premium rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden relative group"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="p-10 lg:p-12 relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-white font-sans mb-3 uppercase">{title}</h1>
            {subtitle && (
              <p className="text-[11px] font-black uppercase tracking-widest text-white/30 leading-relaxed max-w-[280px] mx-auto italic">{subtitle}</p>
            )}
          </div>

          <div className="space-y-6">
            {children}
          </div>
        </div>

        <div className="px-10 py-6 bg-white/[0.03] border-t border-white/5 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Secure Protocol v2.4</span>
          </div>
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </motion.div>

      <style jsx global>{`
        .glass-premium {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px) saturate(180%);
        }
      `}</style>
    </div>
  );
}


"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 selection:bg-primary/30 overflow-hidden bg-cosmic-dark font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ai-purple/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <LoginForm />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all flex items-center justify-center gap-3 group">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            Abort to Neural Home
          </Link>
        </motion.p>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import { Mail, Lock, LogIn, ChevronRight } from "lucide-react";
import AuthCard from "./AuthCard";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Invalid Protocol";
    if (!password) next.password = "Access Key Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const supabase = createClient();
      if (!supabase) {
        toast("Auth not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.", "error");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrors({ password: "Authentication Failure" });
          toast("Invalid credentials provided.", "error");
        } else {
          setErrors({ password: error.message });
          toast(error.message, "error");
        }
        return;
      }

      if (data.user) {
        toast("Neural link established.", "success");
        router.push(redirect);
        router.refresh();
      }
    } catch {
      toast("System error. Re-authentication required.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Access Nexus"
      subtitle="Establish a secure connection to your brand intelligence dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">Identity Identifier</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                autoComplete="email"
                placeholder="operator@nexus.com"
                className={cn(
                  "w-full bg-white/5 rounded-2xl border border-white/20 pl-14 pr-4 py-5 text-white font-sans placeholder:text-white/30 focus:outline-none focus:border-[#9333EA]/50 focus:ring-4 focus:ring-[#9333EA]/10 transition-all text-sm",
                  errors.email && "border-red-500/50 bg-red-500/5"
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {errors.email && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">Security Encryption</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                className={cn(
                  "w-full bg-white/5 rounded-2xl border border-white/20 pl-14 pr-4 py-5 text-white font-sans placeholder:text-white/30 focus:outline-none focus:border-[#9333EA]/50 focus:ring-4 focus:ring-[#9333EA]/10 transition-all text-sm",
                  errors.password && "border-red-500/50 bg-red-500/5"
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {errors.password && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.password}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" />
              <div className="h-5 w-5 rounded-md border-2 border-white/10 bg-white/5 peer-checked:bg-primary peer-checked:border-primary transition-all" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Persistent Link</span>
          </label>
          <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[#9333EA]/60 hover:text-[#9333EA] transition-colors">Key Recovery</Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg" className="h-16 rounded-[2rem] group">
          Authenticate Session
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">New Operator? </span>
          <Link href="/signup" className="text-[10px] font-black uppercase tracking-widest text-[#9333EA] hover:underline ml-1">
            Initialize Account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

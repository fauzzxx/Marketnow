"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import { Mail, Lock, ShieldCheck, UserPlus, ChevronRight } from "lucide-react";
import AuthCard from "./AuthCard";
import { cn } from "@/lib/utils";

const MIN_PASSWORD_LENGTH = 6;

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const next: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    if (!email.trim()) next.email = "Email Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Invalid Protocol";
    if (!password) next.password = "Access Key Required";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Minimum ${MIN_PASSWORD_LENGTH} Characters`;
    if (password !== confirmPassword)
      next.confirmPassword = "Vector Mismatch";
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard` },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setErrors({ email: "Identity Already Registered" });
          toast("An account with this email already exists.", "error");
        } else if (error.message.toLowerCase().includes("password")) {
          setErrors({ password: error.message });
          toast(error.message, "error");
        } else {
          setErrors({ email: error.message });
          toast(error.message, "error");
        }
        return;
      }

      if (data.user) {
        if (data.user.identities?.length === 0) {
          setErrors({ email: "Identity Already Registered" });
          toast("An account with this email already exists.", "error");
          return;
        }
        toast("Neural link initialized. Check your email.", "success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast("System error. Re-initialization required.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Initialize Identity"
      subtitle="Join the elite network of brand architects today."
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
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">Access Cipher</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                autoComplete="new-password"
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-1">Verify Cipher</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                className={cn(
                  "w-full bg-white/5 rounded-2xl border border-white/20 pl-14 pr-4 py-5 text-white font-sans placeholder:text-white/30 focus:outline-none focus:border-[#9333EA]/50 focus:ring-4 focus:ring-[#9333EA]/10 transition-all text-sm",
                  errors.confirmPassword && "border-red-500/50 bg-red-500/5"
                )}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {errors.confirmPassword && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 ml-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg" className="h-16 rounded-[2rem] group">
          Synchronize Identity
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Existing Operator? </span>
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-[#9333EA] hover:underline ml-1">
            Access Nexus
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

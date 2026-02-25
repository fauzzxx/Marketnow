"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthCard from "./AuthCard";

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
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Invalid email";
    if (!password) next.password = "Password is required";
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrors({ password: "Invalid email or password." });
          toast("Invalid email or password.", "error");
        } else {
          setErrors({ password: error.message });
          toast(error.message, "error");
        }
        return;
      }

      if (data.user) {
        toast("Welcome back!", "success");
        router.push(redirect);
        router.refresh();
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Enter your credentials to continue winning every search."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />
        <div className="flex items-center text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded border-border" />
            Remember me
          </label>
        </div>
        <Button type="submit" fullWidth loading={loading} size="lg">
          Log in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

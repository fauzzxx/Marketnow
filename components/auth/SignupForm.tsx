"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthCard from "./AuthCard";

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
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Invalid email";
    if (!password) next.password = "Password is required";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (password !== confirmPassword)
      next.confirmPassword = "Passwords do not match";
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard` },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setErrors({ email: "An account with this email already exists." });
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
          setErrors({ email: "An account with this email already exists." });
          toast("An account with this email already exists.", "error");
          return;
        }
        toast("Account created! Check your email to confirm.", "success");
        router.push("/dashboard");
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
      title="Start your free trial"
      subtitle="Join Market Now and watch your visibility explode."
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={loading}
        />
        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign up
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

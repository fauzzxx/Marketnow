import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2A195E] to-[#1B1040] px-4 py-32">
      <LoginForm />
      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-white/60 hover:text-white hover:underline transition-colors">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

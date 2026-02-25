"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { getAvatarPlaceholder, getInitials } from "@/utils/avatar";
import { toast } from "@/utils/toast";
import ThemeToggle from "./ThemeToggle";
import Button from "@/components/ui/Button";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const router = useRouter();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast("Logged out successfully.", "success");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="relative h-8 w-8">
            <svg viewBox="0 0 120 40" className="h-full w-full">
              {/* M */}
              <path d="M5 35 V10 L15 25 L25 10 V35" fill="none" stroke="#005A9C" strokeWidth="8" strokeLinejoin="round" />
              {/* N */}
              <path d="M30 35 V10 L45 35 V10" fill="none" stroke="#FF6422" strokeWidth="8" strokeLinejoin="round" />
              {/* Arrow */}
              <path d="M45 35 L65 5 M65 5 L55 5 M65 5 L65 15" fill="none" stroke="#00AEEF" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tighter text-foreground">MARKET NOW</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {showAuth && (
            <>
              {loading ? (
                <div className="h-10 w-24 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/80"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ${getAvatarPlaceholder(user.email ?? "")}`}
                      title={user.email ?? ""}
                    >
                      {getInitials(user.email ?? "")}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-muted-foreground"
                    >
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/80"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-90"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

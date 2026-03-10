"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { getAvatarPlaceholder, getInitials } from "@/utils/avatar";
import { toast } from "@/utils/toast";
import { useDashboardSidebar } from "@/contexts/DashboardSidebarContext";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const sidebarContext = useDashboardSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast("Logged out successfully.", "success");
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md ${
        isDashboard ? "border-border bg-background/90" : "border-border/50 bg-background/80"
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between px-2 sm:px-3">
        {/* Extreme left: hamburger + MARKET NOW (no gap at corner) */}
        <div className="flex shrink-0 items-center gap-2">
          {isDashboard && sidebarContext && (
            <button
              type="button"
              onClick={() => sidebarContext.setSidebarOpen((o) => !o)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
              aria-label={sidebarContext.sidebarOpen ? "Close menu" : "Open menu"}
            >
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </button>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-black/30">
              MN
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              MARKET NOW
            </span>
          </Link>
        </div>
        {/* Extreme right: Light/Dark/System + Dashboard + profile (no gap at corner) */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {showAuth && (
            <>
              {loading ? (
                <div className="h-10 w-10 shrink-0 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/80 sm:block"
                  >
                    Dashboard
                  </Link>
                  <div className="relative shrink-0" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((o) => !o)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ring-2 ring-border/50 transition-transform hover:ring-primary/50 active:scale-95 ${getAvatarPlaceholder(user.email ?? "")}`}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      {getInitials(user.email ?? "")}
                    </button>
                    {userMenuOpen && (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card py-2 shadow-xl"
                        role="menu"
                      >
                        <div className="border-b border-border px-4 py-3">
                          <p className="truncate text-sm font-medium text-card-foreground">
                            {user.email}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Account
                          </p>
                        </div>
                        <div className="p-2">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10"
                            role="menuitem"
                          >
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/80"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-90"
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

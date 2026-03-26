"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { getAvatarPlaceholder, getInitials } from "@/utils/avatar";
import { toast } from "@/utils/toast";
import { useDashboardSidebar } from "@/contexts/DashboardSidebarContext";
import ThemeToggle from "./ThemeToggle";
import Button from "@/components/ui/Button";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const sidebarContext = useDashboardSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (supabase) await supabase.auth.signOut();
    toast("Logged out successfully.", "success");
    router.push("/");
    router.refresh();
  };

  // Conditionally render the new light-mode public header if NOT in dashboard
  if (!isDashboard) {
    return (
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="w-full px-4 md:px-6 flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold tracking-tight text-[#1A1625] leading-none flex items-center">
                Market<span className="text-[#EC4899]">NOW</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Features", href: "/#features" },
                { label: "SEO Tools", href: "/seo-tools" },
                { label: "Keyword Tools", href: "/keyword-tools" },
                { label: "GEO (AI) Tools", href: "/geo-tools" },
                { label: "Pricing", href: "/services" },
              ].map((item) => {
                const hasDropdown = ["Features", "SEO Tools", "Keyword Tools", "GEO (AI) Tools"].includes(item.label);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-1 text-[15px] font-medium text-slate-600 hover:text-[#9333EA] transition-colors"
                  >
                    {item.label}
                    {hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showAuth && (
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="hidden sm:block">
                      <button className="px-5 py-2 rounded-full font-semibold text-sm text-[#9333EA] bg-purple-50 hover:bg-purple-100 transition-colors">
                        Dashboard
                      </button>
                    </Link>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 shadow-sm overflow-hidden bg-white text-slate-700`}
                      title={user.email ?? ""}
                    >
                      <span className="text-xs font-bold">{getInitials(user.email ?? "")}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="hidden items-center gap-3 sm:flex">
                    <Link href="/login">
                      <button className="px-5 py-2.5 rounded-full font-semibold text-sm text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                        Login
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button className="px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-[#EC4899] to-[#9333EA] shadow-md hover:shadow-lg hover:opacity-90 transition-all">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? <X className="h-6 w-6" key="x" /> : <Menu className="h-6 w-6" key="menu" />}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-100 p-6 space-y-2 bg-white"
            >
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Features", href: "/#features" },
                { label: "SEO Tools", href: "/seo-tools" },
                { label: "Keyword Tools", href: "/keyword-tools" },
                { label: "GEO (AI) Tools", href: "/geo-tools" },
                { label: "Pricing", href: "/services" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:text-[#9333EA] hover:bg-slate-50 rounded-lg transition-all"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="w-full">
                      <button className="w-full py-3 rounded-full font-semibold text-sm text-[#9333EA] bg-purple-50">Dashboard</button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 rounded-full font-semibold text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <button className="w-full py-3 rounded-full font-semibold text-sm text-slate-700 bg-white border border-slate-200">Login</button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <button className="w-full py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-[#EC4899] to-[#9333EA]">Sign Up</button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  }

  // Nullify Dashboard Header since DashboardClient handles its own layout
  return null;
}


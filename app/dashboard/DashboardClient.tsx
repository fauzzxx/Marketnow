"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboardSidebar } from "@/contexts/DashboardSidebarContext";
import AIVisibilityTab from "@/components/toolkit/AIVisibilityTab";
import PPCTab from "@/components/toolkit/PPCTab";
import KeywordResearchTab from "@/components/toolkit/KeywordResearchTab";
import CompetitorTab from "@/components/toolkit/CompetitorTab";
import ContentMarketingTab from "@/components/toolkit/ContentMarketingTab";
import LocalSeoTab from "@/components/toolkit/LocalSeoTab";
import AdvancedSeoTab from "@/components/toolkit/AdvancedSeoTab";
import YTScriptTab from "@/components/toolkit/YTScriptTab";
import LinkedInPostTab from "@/components/toolkit/LinkedInPostTab";
import BulkEmailsTab from "@/components/toolkit/BulkEmailsTab";
import FloatingChatbot from "@/components/FloatingChatbot";
import DashboardHome from "@/components/dashboard/DashboardHome";
import { getStoredTheme, setStoredTheme, applyTheme } from "@/utils/theme";
import { setActivityUserId } from "@/lib/activityTracker";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Home, BarChart3, Rocket, LayoutDashboard, Settings,
  Search, Bell, Target, Edit3, Globe, ShieldCheck, Play, Linkedin, Mail,
  Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS_WITH_ICONS = [
  { id: "ai-visibility", label: "AI Visibility", Component: AIVisibilityTab, icon: Sparkles, category: "seo" },
  { id: "ppc", label: "PPC & Ads", Component: PPCTab, icon: Rocket, category: "seo" },
  { id: "keyword", label: "Keyword Research", Component: KeywordResearchTab, icon: BarChart3, category: "seo" },
  { id: "competitor", label: "Competitor Analysis", Component: CompetitorTab, icon: Target, category: "data" },
  { id: "content", label: "Content Marketing", Component: ContentMarketingTab, icon: Edit3, category: "engagement" },
  { id: "local", label: "Local SEO", Component: LocalSeoTab, icon: Globe, category: "seo" },
  { id: "advanced", label: "Advanced SEO", Component: AdvancedSeoTab, icon: ShieldCheck, category: "seo" },
  { id: "yt-script", label: "YT Script Gen", Component: YTScriptTab, icon: Play, category: "social" },
  { id: "linkedin-post", label: "Auto LinkedIn", Component: LinkedInPostTab, icon: Linkedin, category: "social" },
  { id: "bulk-emails", label: "Bulk Emails", Component: BulkEmailsTab, icon: Mail, category: "social" },
];

const CATEGORIES = [
  { id: "social", label: "Social Media Publisher" },
  { id: "engagement", label: "Engagement Booster" },
  { id: "data", label: "Data Extraction" },
  { id: "seo", label: "SEO" },
];

interface DashboardClientProps {
  user: { id: string; email: string; name?: string };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeCategory, setActiveCategory] = useState("seo");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [toolInitialValues, setToolInitialValues] = useState<Record<string, string> | undefined>(undefined);
  const sidebarContext = useDashboardSidebar();
  const sidebarOpen = sidebarContext?.sidebarOpen ?? true;

  const isDashboard = activeTab === "dashboard";
  const current = TABS_WITH_ICONS.find((t) => t.id === activeTab);
  const Component = current?.Component;

  const displayName = user.name || user.email.split("@")[0];

  // Scope activity data to the logged-in user
  useEffect(() => {
    setActivityUserId(user.id);
  }, [user.id]);

  // Initialize theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    applyTheme(stored);
    setIsDark(stored === "dark" || (stored === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setStoredTheme(next);
    setIsDark(next === "dark");
  }, [isDark]);

  function navigateToTab(tabId: string, initialValues?: Record<string, string>) {
    const tab = TABS_WITH_ICONS.find((t) => t.id === tabId);
    if (tab) {
      setActiveCategory(tab.category);
      setToolInitialValues(initialValues);
      setActiveTab(tabId);
    }
  }

  return (
    <div className="flex h-screen bg-[#F4F7FE] dark:bg-[#0a0a0a] text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-40 w-[270px] shrink-0 flex flex-col bg-white dark:bg-[#141414] h-full border-r border-[#E2E8F0]/60 dark:border-[#2a2a2a] shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
          >
            <div className="p-6 pb-2">
              <Link href="/" className="flex items-center gap-2 mb-6 group pl-2">
                <span className="text-[28px] font-bold tracking-tight text-[#1A1625] dark:text-white leading-none flex items-center">
                  <svg className="w-8 h-8 mr-1.5 text-[#9333EA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  Market<span className="text-[#EC4899]">NOW</span>
                </span>
              </Link>

              {/* Dashboard Home Button */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3.5 rounded-[12px] text-[15px] font-semibold transition-all duration-200 mb-4",
                  isDashboard
                    ? "bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white shadow-md shadow-purple-200/50 dark:shadow-purple-900/30"
                    : "text-[#64748B] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Home className="h-[20px] w-[20px] shrink-0" strokeWidth={isDashboard ? 2.5 : 2} />
                <span>Dashboard</span>
              </button>

              {/* AI Copilot Link */}
              <Link
                href="/ai-copilot"
                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-[12px] text-[15px] font-semibold transition-all duration-200 mb-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 text-pink-500 dark:text-pink-400 hover:from-pink-500/20 hover:to-purple-600/20 border border-pink-500/20 dark:border-pink-500/10"
              >
                <Sparkles className="h-[20px] w-[20px] shrink-0" strokeWidth={2} />
                <span>AI Copilot</span>
              </Link>

              <div className="border-t border-slate-100 dark:border-[#2a2a2a] pt-3 mb-2">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 mb-2">Tools</p>
              </div>

              <nav className="space-y-1.5 custom-scrollbar overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
                {TABS_WITH_ICONS.filter(t => t.category === activeCategory).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-3.5 rounded-[12px] text-[15px] font-semibold transition-all duration-200",
                      activeTab === t.id
                        ? "bg-[#F3E8FF] dark:bg-[#9333EA]/20 text-[#9333EA] dark:text-purple-300"
                        : "text-[#64748B] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <t.icon className={cn("h-[20px] w-[20px] shrink-0", activeTab === t.id ? "text-[#9333EA] dark:text-purple-300" : "opacity-80")} strokeWidth={activeTab === t.id ? 2.5 : 2} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-6 space-y-4 border-t border-slate-100 dark:border-[#2a2a2a]">
              {/* Theme Toggle */}
              <div className="flex items-center gap-3">
                <span className={cn("font-semibold text-sm mr-2 transition-colors", !isDark ? "text-slate-700 dark:text-white" : "text-slate-400 dark:text-slate-500")}>Light</span>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    "h-8 w-14 rounded-full flex items-center px-1 cursor-pointer border transition-colors duration-300",
                    isDark
                      ? "bg-[#1E293B] border-[#334155] justify-end"
                      : "bg-slate-100 border-slate-200 justify-start"
                  )}
                >
                  <div className="h-6 w-6 rounded-full bg-[#EC4899] shadow-sm flex items-center justify-center text-white transition-all duration-300">
                    {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                  </div>
                </button>
                <span className={cn("font-semibold text-sm transition-colors", isDark ? "text-white" : "text-slate-400")}>Dark</span>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-[#1a1a1a] overflow-hidden text-slate-500 dark:text-slate-300 flex items-center justify-center font-bold text-lg bg-center bg-cover border-2 border-white dark:border-[#2a2a2a] shadow-sm" style={{ backgroundImage: "none" }}>{user.email.substring(0,2).toUpperCase()}</div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#1A1625] border-2 border-white dark:border-[#111827] flex items-center justify-center text-[#EC4899] shadow-sm">
                    <Sparkles className="h-2.5 w-2.5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-[96px] shrink-0 flex items-center justify-between px-8 lg:px-10 z-30 pt-6">
          <div className="flex-1 w-full bg-white dark:bg-[#141414] rounded-2xl h-[72px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] px-4 md:px-6 flex items-center justify-between border border-slate-100 dark:border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button onClick={() => sidebarContext?.setSidebarOpen((prev) => !prev)} className="p-2 -ml-2 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors">
                  <LayoutDashboard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-[#1A1625] dark:text-white tracking-tight">
                Hello, {displayName}
              </h1>
            </div>

            <div className="hidden xl:flex items-center gap-2 ml-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "text-xs font-semibold transition-all cursor-pointer px-3 py-1.5 rounded-full whitespace-nowrap",
                  isDashboard
                    ? "bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
                )}
              >
                Overview
              </button>
              {TABS_WITH_ICONS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateToTab(tab.id)}
                  className={cn(
                    "text-xs font-semibold transition-all cursor-pointer px-3 py-1.5 rounded-full whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-[#F3E8FF] dark:bg-[#9333EA]/20 text-[#9333EA] dark:text-purple-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto pl-4">
              <button className="h-10 w-10 rounded-full bg-[#1A1625] dark:bg-[#1a1a1a] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                <Search className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-[#1A1625] dark:bg-[#1a1a1a] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                <Bell className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-[#1A1625] dark:bg-[#1a1a1a] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 lg:px-10 pb-12 pt-8 custom-scrollbar scroll-smooth">
          <div className="w-full h-full px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative overflow-hidden",
                  isDashboard
                    ? ""
                    : "bg-white dark:bg-[#141414] text-slate-900 dark:text-slate-100 rounded-[2rem] p-8 lg:p-12 border border-slate-100 dark:border-[#2a2a2a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] min-h-[700px]"
                )}
              >
                {!isDashboard && (
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-1000 bg-[#D946EF]" />
                )}
                <div className="relative z-10 w-full h-full">
                  {isDashboard ? (
                    <DashboardHome onNavigateToTab={navigateToTab} />
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white tracking-tight">{current?.label} Dashboard</h2>
                      {Component && <Component initialValues={toolInitialValues} />}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <FloatingChatbot />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a2a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }
      `}</style>
    </div>
  );
}

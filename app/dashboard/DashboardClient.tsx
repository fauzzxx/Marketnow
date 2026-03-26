"use client";

import { useState } from "react";
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

import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Home, BarChart3, Rocket, LayoutDashboard, Settings, User, 
  Search, Bell, Target, Edit3, Globe, ShieldCheck, Play, Linkedin, Mail,
  Sun
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
  user: { id: string; email: string };
}
export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeCategory, setActiveCategory] = useState("seo");
  const [activeTab, setActiveTab] = useState<string>("ai-visibility");
  const sidebarContext = useDashboardSidebar();
  const sidebarOpen = sidebarContext?.sidebarOpen ?? true;

  const current = TABS_WITH_ICONS.find((t) => t.id === activeTab);
  const Component = current?.Component;

  return (
    <div className="flex h-screen bg-[#F4F7FE] text-slate-800 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-40 w-[270px] shrink-0 flex flex-col bg-white h-full border-r border-[#E2E8F0]/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
          >
            <div className="p-6 pb-2">
              <Link href="/" className="flex items-center gap-2 mb-10 group pl-2">
                <span className="text-[28px] font-bold tracking-tight text-[#1A1625] leading-none flex items-center">
                  <svg className="w-8 h-8 mr-1.5 text-[#9333EA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  Market<span className="text-[#EC4899]">NOW</span>
                </span>
              </Link>

              <nav className="space-y-1.5 custom-scrollbar overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
                {TABS_WITH_ICONS.filter(t => t.category === activeCategory).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-3.5 rounded-[12px] text-[15px] font-semibold transition-all duration-200",
                      activeTab === t.id
                        ? "bg-[#F3E8FF] text-[#9333EA]"
                        : "text-[#64748B] hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <t.icon className={cn("h-[20px] w-[20px] shrink-0", activeTab === t.id ? "text-[#9333EA]" : "opacity-80")} strokeWidth={activeTab === t.id ? 2.5 : 2} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-6 space-y-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-semibold text-sm mr-2">Light</span>
                <div className="h-8 w-14 bg-slate-100 rounded-full flex items-center px-1 cursor-pointer border border-slate-200">
                  <div className="h-6 w-6 rounded-full bg-[#EC4899] shadow-sm flex items-center justify-center text-white">
                    <Sun className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="text-slate-400 font-semibold text-sm">Dark</span>
              </div>
              <div className="pt-4 flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden text-slate-500 flex items-center justify-center font-bold text-lg bg-center bg-cover border-2 border-white shadow-sm" style={{ backgroundImage: "none" }}>{user.email.substring(0,2).toUpperCase()}</div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#1A1625] border-2 border-white flex items-center justify-center text-[#EC4899] shadow-sm">
                    <Sparkles className="h-2.5 w-2.5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.email.split('@')[0]}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-[96px] shrink-0 flex items-center justify-between px-8 lg:px-10 z-30 pt-6">
          <div className="flex-1 w-full bg-white rounded-2xl h-[72px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] px-4 md:px-6 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button onClick={() => sidebarContext?.setSidebarOpen((prev) => !prev)} className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <LayoutDashboard className="h-5 w-5 text-slate-600" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-[#1A1625] tracking-tight">
                Hello, {user.email.split('@')[0]}
              </h1>
            </div>

            <div className="hidden xl:flex items-center gap-8 ml-8">
              <Link href="/" className="text-slate-400 hover:text-[#EC4899] transition-colors"><Home className="h-[18px] w-[18px]" strokeWidth={2} /></Link>
              {CATEGORIES.map((cat) => (
                <span
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const firstInCat = TABS_WITH_ICONS.find(t => t.category === cat.id);
                    if (firstInCat) setActiveTab(firstInCat.id);
                  }}
                  className={cn(
                    "text-sm font-semibold transition-all cursor-pointer",
                    activeCategory === cat.id ? "text-[#EC4899] font-bold" : "text-slate-600 hover:text-[#9333EA]"
                  )}
                >
                  {cat.label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="h-10 w-10 rounded-full bg-[#1A1625] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                <Search className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-[#1A1625] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                <Bell className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-[#1A1625] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
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
                className="bg-white text-slate-900 rounded-[2rem] p-8 lg:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[700px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-1000 bg-[#D946EF]" />
                <div className="relative z-10 w-full h-full">
                  <h2 className="text-2xl font-bold mb-8 text-slate-800 tracking-tight">{current?.label} Dashboard</h2>
                  {Component && <Component />}
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

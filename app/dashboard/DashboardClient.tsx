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

const TABS = [
  { id: "ai-visibility", label: "AI Visibility", Component: AIVisibilityTab },
  { id: "ppc", label: "PPC & Ads", Component: PPCTab },
  { id: "keyword", label: "Keyword Research", Component: KeywordResearchTab },
  { id: "competitor", label: "Competitor Analysis", Component: CompetitorTab },
  { id: "content", label: "Content Marketing", Component: ContentMarketingTab },
  { id: "local", label: "Local SEO", Component: LocalSeoTab },
  { id: "advanced", label: "Advanced SEO", Component: AdvancedSeoTab },
  { id: "yt-script", label: "YT Script Generator", Component: YTScriptTab },
  { id: "linkedin-post", label: "Auto LinkedIn Post", Component: LinkedInPostTab },
  { id: "bulk-emails", label: "Bulk Emails", Component: BulkEmailsTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface DashboardClientProps {
  user: { id: string; email: string };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ai-visibility");
  const sidebarContext = useDashboardSidebar();
  const sidebarOpen = sidebarContext?.sidebarOpen ?? false;
  const current = TABS.find((t) => t.id === activeTab);
  const Component = current?.Component;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background text-foreground">
      {/* Sidebar - only visible when hamburger in nav bar is clicked; no MARKET NOW, no email; 7 features only */}
      {sidebarOpen && (
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-muted">
          <div className="flex-1 overflow-y-auto px-3 pt-4 pb-4">
            <div className="rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <div className="rounded-t-2xl border-b border-border bg-background/30 px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground tracking-wide">Mini Semrush</h2>
              </div>
              <nav className="flex flex-col py-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`text-left px-4 py-3 text-sm font-medium transition-all duration-200 border-b border-border/60 last:border-b-0 ${
                      activeTab === t.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="border-t border-border p-3">
            <Link
              href="/"
              className="block rounded-xl border border-border bg-card px-3 py-2.5 text-center text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-background/40 hover:text-foreground"
            >
              Home
            </Link>
          </div>
        </aside>
      )}

      {/* Right: main content area */}
      <div className="min-w-0 flex-1 overflow-auto bg-background">
        <div className="p-6">
          {Component && <Component />}
        </div>
      </div>

      {/* Floating chatbot - bottom right on every page */}
      <FloatingChatbot />
    </div>
  );
}

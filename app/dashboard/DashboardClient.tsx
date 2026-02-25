"use client";

import { useState } from "react";
import Link from "next/link";
import { getAvatarPlaceholder, getInitials } from "@/utils/avatar";
import Button from "@/components/ui/Button";
import AIVisibilityTab from "@/components/toolkit/AIVisibilityTab";
import PPCTab from "@/components/toolkit/PPCTab";
import KeywordResearchTab from "@/components/toolkit/KeywordResearchTab";
import CompetitorTab from "@/components/toolkit/CompetitorTab";
import ContentMarketingTab from "@/components/toolkit/ContentMarketingTab";
import LocalSeoTab from "@/components/toolkit/LocalSeoTab";
import AdvancedSeoTab from "@/components/toolkit/AdvancedSeoTab";

const TABS = [
  { id: "ai-visibility", label: "AI Visibility", Component: AIVisibilityTab },
  { id: "ppc", label: "PPC & Ads", Component: PPCTab },
  { id: "keyword", label: "Keyword Research", Component: KeywordResearchTab },
  { id: "competitor", label: "Competitor Analysis", Component: CompetitorTab },
  { id: "content", label: "Content Marketing", Component: ContentMarketingTab },
  { id: "local", label: "Local SEO", Component: LocalSeoTab },
  { id: "advanced", label: "Advanced SEO", Component: AdvancedSeoTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface DashboardClientProps {
  user: { id: string; email: string };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ai-visibility");
  const current = TABS.find((t) => t.id === activeTab);
  const Component = current?.Component;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-semibold text-white ${getAvatarPlaceholder(user.email)}`}
          >
            {getInitials(user.email)}
          </div>
          <div>
            <p className="font-medium text-foreground">{user.email}</p>
            <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px] sm:max-w-none">
              {user.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">Home</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-2 py-2">
          <h1 className="text-xl font-bold text-foreground px-2 mb-2">Mini Semrush – All In One Toolkit</h1>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 min-h-[400px]">
          {Component && <Component />}
        </div>
      </div>
    </div>
  );
}

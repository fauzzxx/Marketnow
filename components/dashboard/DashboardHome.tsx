"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Search, Wrench, FileText, Globe, Sparkles, Rocket, BarChart3, Target,
  Edit3, ShieldCheck, Play, Linkedin, Mail, Clock, ArrowRight, TrendingUp,
} from "lucide-react";
import {
  getUsageStats, getUsageChartData, getRecentActivity, getLastQueryForTool,
  getDomainOverview, timeAgo, type UsageStats, type ActivityEntry,
} from "@/lib/activityTracker";
import { cn } from "@/lib/utils";

const TOOL_ICONS: Record<string, any> = {
  "ai-visibility": Sparkles,
  ppc: Rocket,
  keyword: BarChart3,
  competitor: Target,
  content: Edit3,
  local: Globe,
  advanced: ShieldCheck,
  "yt-script": Play,
  "linkedin-post": Linkedin,
  "bulk-emails": Mail,
};

const TOOL_COLORS: Record<string, string> = {
  "Local SEO": "#9333EA",
  Competitor: "#EC4899",
  Keywords: "#7C3AED",
  "AI Visibility": "#A855F7",
  "Advanced SEO": "#6366F1",
  "YT Scripts": "#D946EF",
  "Bulk Email": "#F43F5E",
  "PPC & Ads": "#8B5CF6",
  Content: "#C084FC",
  LinkedIn: "#0EA5E9",
};

const QUICK_ACTIONS = [
  { id: "local", label: "Local SEO", icon: Globe },
  { id: "competitor", label: "Competitor Analysis", icon: Target },
  { id: "keyword", label: "Keyword Research", icon: BarChart3 },
  { id: "advanced", label: "Advanced SEO", icon: ShieldCheck },
  { id: "ai-visibility", label: "AI Visibility", icon: Sparkles },
  { id: "yt-script", label: "YT Script Gen", icon: Play },
];

interface DashboardHomeProps {
  onNavigateToTab: (tabId: string, initialValues?: Record<string, string>) => void;
}

export default function DashboardHome({ onNavigateToTab }: DashboardHomeProps) {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">("weekly");
  const [domainOverview, setDomainOverview] = useState<ReturnType<typeof getDomainOverview>>(null);

  useEffect(() => {
    setStats(getUsageStats());
    setActivity(getRecentActivity(5));
    setDomainOverview(getDomainOverview());
  }, []);

  const chartData = useMemo(() => getUsageChartData(chartPeriod), [chartPeriod]);

  const toolAggregateData = useMemo(() => {
    const toolKeys = ["Local SEO", "Competitor", "Keywords", "AI Visibility", "Advanced SEO", "YT Scripts", "Bulk Email", "PPC & Ads"] as const;
    return toolKeys.map((tool) => ({
      name: tool,
      uses: chartData.reduce((sum, day) => sum + ((day as any)[tool] || 0), 0),
      color: TOOL_COLORS[tool] || "#9333EA",
    }));
  }, [chartData]);

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Searches",
      value: stats.totalSearches,
      weekly: stats.weeklySearches,
      icon: Search,
      gradient: true,
    },
    {
      label: "Tools Used",
      value: stats.toolsUsed,
      weekly: stats.weeklyTools,
      icon: Wrench,
      gradient: false,
    },
    {
      label: "Reports Generated",
      value: stats.reportsGenerated,
      weekly: stats.weeklyReports,
      icon: FileText,
      gradient: false,
    },
    {
      label: "Active Domain",
      value: stats.activeDomain,
      weekly: null,
      icon: Globe,
      gradient: false,
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={cn(
              "rounded-2xl p-5 transition-all duration-200 hover:shadow-lg",
              card.gradient
                ? "bg-gradient-to-br from-[#9333EA] to-[#EC4899] text-white shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30"
                : "bg-white dark:bg-[#141414] border border-slate-100 dark:border-[#2a2a2a] shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  card.gradient ? "bg-white/20" : "bg-[#F3E8FF] dark:bg-[#9333EA]/20"
                )}
              >
                <card.icon
                  className={cn("h-5 w-5", card.gradient ? "text-white" : "text-[#9333EA] dark:text-purple-400")}
                  strokeWidth={2}
                />
              </div>
              {card.weekly !== null && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
                    card.gradient
                      ? "bg-white/20 text-white"
                      : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  )}
                >
                  <TrendingUp className="h-3 w-3" />+{card.weekly} this week
                </span>
              )}
            </div>
            <p
              className={cn(
                "text-sm font-medium mb-1",
                card.gradient ? "text-white/80" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {card.label}
            </p>
            <p
              className={cn(
                "font-bold",
                card.gradient ? "text-white" : "text-slate-900 dark:text-white",
                card.isText ? "text-lg truncate" : "text-2xl"
              )}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#141414] rounded-2xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Usage Insights</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tool usage overview</p>
            </div>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value as "weekly" | "monthly")}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="h-[280px]">
            {toolAggregateData.some((d) => d.uses > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolAggregateData} barSize={32} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #f1f5f9)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--chart-text, #64748b)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--chart-axis, #e2e8f0)" }}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--chart-text, #64748b)" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--chart-axis, #e2e8f0)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      color: "var(--tooltip-text, #1e293b)",
                    }}
                  />
                  <Bar dataKey="uses" radius={[6, 6, 0, 0]}>
                    {toolAggregateData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <BarChart3 className="h-12 w-12 mb-3 opacity-40" />
                <p className="text-sm font-medium">No usage data yet</p>
                <p className="text-xs mt-1">Start using tools to see your analytics here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Recent Activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your latest actions</p>

          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((entry) => {
                const Icon = TOOL_ICONS[entry.toolId] || Search;
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F3E8FF]/50 dark:hover:bg-[#9333EA]/10 hover:shadow-sm transition-all duration-200 cursor-pointer group border border-transparent hover:border-purple-200/50 dark:hover:border-purple-800/30"
                    onClick={() => onNavigateToTab(entry.toolId, entry.inputValues)}
                  >
                    <div className="h-9 w-9 rounded-lg bg-[#F3E8FF] dark:bg-[#9333EA]/20 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[#9333EA] dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#9333EA] dark:group-hover:text-purple-300 transition-colors">
                        {entry.toolName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{entry.query}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {timeAgo(entry.timestamp)}
                      </span>
                      <ArrowRight className="h-3 w-3 text-[#9333EA] dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
              <Clock className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">No activity yet</p>
              <p className="text-xs mt-1">Your recent searches will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const lastQuery = getLastQueryForTool(action.id);
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigateToTab(action.id)}
                  className="group bg-white dark:bg-[#141414] rounded-2xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm p-4 text-left hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#F3E8FF] dark:bg-[#9333EA]/20 flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-[#9333EA] group-hover:to-[#EC4899] transition-all duration-200">
                    <action.icon className="h-5 w-5 text-[#9333EA] dark:text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Run {action.label}
                  </p>
                  {lastQuery && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">Last: {lastQuery}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-xs font-medium text-[#9333EA] dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open tool <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Domain Overview */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Domain Overview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Most analyzed domain</p>

          {domainOverview ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#9333EA] to-[#EC4899] flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{domainOverview.domain}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{domainOverview.searches} total searches</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Tools used</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{domainOverview.tools.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Analyses run</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{domainOverview.searches}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {domainOverview.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-medium px-2 py-1 rounded-full bg-[#F3E8FF] dark:bg-[#9333EA]/20 text-[#9333EA] dark:text-purple-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onNavigateToTab("advanced")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                View Full Report
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-500">
              <Globe className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">No domain data yet</p>
              <p className="text-xs mt-1 text-center">
                Analyze a domain to see overview stats here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

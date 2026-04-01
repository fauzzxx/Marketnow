const STORAGE_KEY_PREFIX = "marketnow_activity";
const MAX_ENTRIES = 200;

let _currentUserId: string | null = null;

/** Call once after login to scope activity data to the current user */
export function setActivityUserId(userId: string) {
  _currentUserId = userId;
}

function getStorageKey(): string {
  return _currentUserId
    ? `${STORAGE_KEY_PREFIX}_${_currentUserId}`
    : STORAGE_KEY_PREFIX;
}

export interface ActivityEntry {
  id: string;
  toolId: string;
  toolName: string;
  query: string;
  domain?: string;
  timestamp: number;
  inputValues?: Record<string, string>;
}

export interface UsageStats {
  totalSearches: number;
  toolsUsed: number;
  reportsGenerated: number;
  activeDomain: string;
  weeklySearches: number;
  weeklyTools: number;
  weeklyReports: number;
}

export interface DailyToolUsage {
  date: string;
  "Local SEO": number;
  "Competitor": number;
  "Keywords": number;
  "AI Visibility": number;
  "Advanced SEO": number;
  "YT Scripts": number;
  "Bulk Email": number;
  "PPC & Ads": number;
  "Content": number;
  "LinkedIn": number;
}

function getEntries(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey());
    // Also migrate old non-scoped data if present
    if (!raw && _currentUserId) {
      const legacy = localStorage.getItem(STORAGE_KEY_PREFIX);
      if (legacy) {
        localStorage.setItem(getStorageKey(), legacy);
        localStorage.removeItem(STORAGE_KEY_PREFIX);
        return JSON.parse(legacy);
      }
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: ActivityEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(), JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  "ai-visibility": "AI Visibility",
  "ppc": "PPC & Ads",
  "keyword": "Keywords",
  "competitor": "Competitor",
  "content": "Content",
  "local": "Local SEO",
  "advanced": "Advanced SEO",
  "yt-script": "YT Scripts",
  "linkedin-post": "LinkedIn",
  "bulk-emails": "Bulk Email",
};

export function trackActivity(toolId: string, query: string, domain?: string, inputValues?: Record<string, string>) {
  const entries = getEntries();
  entries.unshift({
    id: crypto.randomUUID?.() ?? Date.now().toString(36),
    toolId,
    toolName: TOOL_DISPLAY_NAMES[toolId] || toolId,
    query,
    domain: domain || extractDomain(query),
    timestamp: Date.now(),
    inputValues,
  });
  saveEntries(entries);
}

function extractDomain(query: string): string | undefined {
  const match = query.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
  return match ? match[1] : undefined;
}

export function getRecentActivity(limit = 5): ActivityEntry[] {
  return getEntries().slice(0, limit);
}

export function getUsageStats(): UsageStats {
  const entries = getEntries();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekEntries = entries.filter((e) => e.timestamp >= oneWeekAgo);

  const allTools = new Set(entries.map((e) => e.toolId));
  const weekTools = new Set(weekEntries.map((e) => e.toolId));

  const domainCounts: Record<string, number> = {};
  for (const e of entries) {
    const d = e.domain;
    if (d) domainCounts[d] = (domainCounts[d] || 0) + 1;
  }
  const activeDomain = Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    totalSearches: entries.length,
    toolsUsed: allTools.size,
    reportsGenerated: entries.length,
    activeDomain,
    weeklySearches: weekEntries.length,
    weeklyTools: weekTools.size,
    weeklyReports: weekEntries.length,
  };
}

export function getUsageChartData(period: "weekly" | "monthly" = "weekly"): DailyToolUsage[] {
  const entries = getEntries();
  const days = period === "weekly" ? 7 : 30;
  const now = new Date();
  const result: DailyToolUsage[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = dayStart + 86400000;

    const dayEntries = entries.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd);

    const row: DailyToolUsage = {
      date: dateStr,
      "Local SEO": 0,
      "Competitor": 0,
      "Keywords": 0,
      "AI Visibility": 0,
      "Advanced SEO": 0,
      "YT Scripts": 0,
      "Bulk Email": 0,
      "PPC & Ads": 0,
      "Content": 0,
      "LinkedIn": 0,
    };

    for (const e of dayEntries) {
      const name = TOOL_DISPLAY_NAMES[e.toolId] || e.toolName;
      if (name in row) (row as any)[name]++;
    }

    result.push(row);
  }

  return result;
}

export function getLastQueryForTool(toolId: string): string | undefined {
  const entries = getEntries();
  return entries.find((e) => e.toolId === toolId)?.query;
}

export function getDomainOverview(): { domain: string; searches: number; tools: string[] } | null {
  const entries = getEntries();
  const domainCounts: Record<string, { count: number; tools: Set<string> }> = {};

  for (const e of entries) {
    const d = e.domain;
    if (d) {
      if (!domainCounts[d]) domainCounts[d] = { count: 0, tools: new Set() };
      domainCounts[d].count++;
      domainCounts[d].tools.add(e.toolName);
    }
  }

  const top = Object.entries(domainCounts).sort((a, b) => b[1].count - a[1].count)[0];
  if (!top) return null;

  return {
    domain: top[0],
    searches: top[1].count,
    tools: Array.from(top[1].tools),
  };
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

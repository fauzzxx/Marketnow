"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#eab308"];

export default function AdvancedSeoTab() {
  const [subTab, setSubTab] = useState<"audit" | "onpage" | "position" | "backlinks">("audit");
  const [auditUrl, setAuditUrl] = useState("");
  const [onpageUrl, setOnpageUrl] = useState("");
  const [onpageKeyword, setOnpageKeyword] = useState("");
  const [positionDomain, setPositionDomain] = useState("");
  const [positionKeyword, setPositionKeyword] = useState("");
  const [backlinkDomain, setBacklinkDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<{ title: string; meta_description: string } | null>(null);
  const [onpageResult, setOnpageResult] = useState<number | null>(null);
  const [positionResult, setPositionResult] = useState<{ position: number | null; found: boolean } | null>(null);
  const [backlinkResult, setBacklinkResult] = useState<number | null>(null);

  const runSiteAudit = async () => {
    if (!auditUrl.trim()) {
      toast("Enter URL.", "error");
      return;
    }
    setLoading(true);
    setAuditResult(null);
    try {
      const data = await api.advanced.siteAudit(auditUrl.trim());
      setAuditResult(data);
      toast("Audit done.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Audit failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runOnpage = async () => {
    if (!onpageUrl.trim() || !onpageKeyword.trim()) {
      toast("Enter URL and keyword.", "error");
      return;
    }
    setLoading(true);
    setOnpageResult(null);
    try {
      const data = await api.advanced.onpage(onpageUrl.trim(), onpageKeyword.trim());
      setOnpageResult(data.keyword_count);
      toast("Analysis done.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runPosition = async () => {
    if (!positionDomain.trim() || !positionKeyword.trim()) {
      toast("Enter domain and keyword.", "error");
      return;
    }
    setLoading(true);
    setPositionResult(null);
    try {
      const data = await api.advanced.position(positionDomain.trim(), positionKeyword.trim());
      setPositionResult(data);
      toast(data.found ? "Position found." : "Not in top 100.", "info");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runBacklinks = async () => {
    if (!backlinkDomain.trim()) {
      toast("Enter domain.", "error");
      return;
    }
    setLoading(true);
    setBacklinkResult(null);
    try {
      const data = await api.advanced.backlinks(backlinkDomain.trim());
      setBacklinkResult(data.estimated_mentions);
      toast("Analysis done.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: typeof subTab; label: string }[] = [
    { id: "audit", label: "Site Audit" },
    { id: "onpage", label: "On-Page SEO" },
    { id: "position", label: "Position Tracking" },
    { id: "backlinks", label: "Backlink Analysis" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Advanced SEO Toolkit</h2>
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              subTab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "audit" && (
        <>
          <Input
            label="Website URL"
            value={auditUrl}
            onChange={(e) => setAuditUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
          />
          <Button onClick={runSiteAudit} loading={loading}>
            Run Site Audit
          </Button>
          {auditResult && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-2 text-sm font-medium text-card-foreground">Page elements length</h4>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Title", chars: (auditResult.title || "").length, fill: CHART_COLORS[0] },
                        { name: "Meta desc", chars: (auditResult.meta_description || "").length, fill: CHART_COLORS[1] },
                      ]}
                      margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                      <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Bar dataKey="chars" radius={[4, 4, 0, 0]}>
                        <Cell fill={CHART_COLORS[0]} />
                        <Cell fill={CHART_COLORS[1]} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                <p><span className="text-muted-foreground">Title:</span> {auditResult.title}</p>
                <p><span className="text-muted-foreground">Meta description:</span> {auditResult.meta_description}</p>
              </div>
            </div>
          )}
        </>
      )}

      {subTab === "onpage" && (
        <>
          <Input
            label="Page URL"
            value={onpageUrl}
            onChange={(e) => setOnpageUrl(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Target Keyword"
            value={onpageKeyword}
            onChange={(e) => setOnpageKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={runOnpage} loading={loading}>
            Analyze On-Page SEO
          </Button>
          {onpageResult !== null && (
            <div className="space-y-2">
              <div className="rounded-2xl border border-border bg-card p-4 max-w-xs shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-2 text-sm font-medium text-card-foreground">Keyword occurrences</h4>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{ name: "Keyword count", value: onpageResult, fill: CHART_COLORS[0] }]}
                      margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                      <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-card-foreground">Keyword count: <strong>{onpageResult}</strong></p>
            </div>
          )}
        </>
      )}

      {subTab === "position" && (
        <>
          <Input
            label="Your Domain (example.com)"
            value={positionDomain}
            onChange={(e) => setPositionDomain(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Keyword to Track"
            value={positionKeyword}
            onChange={(e) => setPositionKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={runPosition} loading={loading}>
            Check Ranking
          </Button>
          {positionResult && (
            <div className="space-y-2">
              <div className="rounded-2xl border border-border bg-card p-4 max-w-xs shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-2 text-sm font-medium text-card-foreground">Ranking position</h4>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: positionResult.found ? `Position ${positionResult.position}` : "Not in top 100",
                          value: positionResult.found ? 101 - (positionResult.position ?? 0) : 0,
                          fill: positionResult.found ? CHART_COLORS[2] : CHART_COLORS[3],
                        },
                      ]}
                      margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} hide />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(_, __, props) => [positionResult.found ? `#${positionResult.position}` : "Not in top 100", "Position"]} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-card-foreground">
                {positionResult.found ? (
                  <>Position: <strong>{positionResult.position}</strong></>
                ) : (
                  "Not found in top 100."
                )}
              </p>
            </div>
          )}
        </>
      )}

      {subTab === "backlinks" && (
        <>
          <Input
            label="Domain for Backlink Analysis"
            value={backlinkDomain}
            onChange={(e) => setBacklinkDomain(e.target.value)}
            placeholder="example.com"
            disabled={loading}
          />
          <Button onClick={runBacklinks} loading={loading}>
            Analyze Backlinks
          </Button>
          {backlinkResult !== null && (
            <div className="space-y-2">
              <div className="rounded-2xl border border-border bg-card p-4 max-w-xs shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-2 text-sm font-medium text-card-foreground">Estimated mentions</h4>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{ name: "Mentions", value: Math.min(backlinkResult, 1000000), fill: CHART_COLORS[0] }]}
                      margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                      <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}k` : String(v))} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(v) => [backlinkResult.toLocaleString(), "Estimated mentions"]} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-card-foreground">Estimated mentions: <strong>{backlinkResult.toLocaleString()}</strong></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

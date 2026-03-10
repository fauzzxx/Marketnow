"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#eab308"];

export default function CompetitorTab() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ranking_keywords: { keyword: string; position: number }[];
    estimated_indexed_pages: number;
    top_ranking_content: { title: string; url: string }[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!domain.trim()) {
      toast("Enter competitor domain.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await api.competitor.analyze(domain.trim());
      setResult(data);
      toast("Analysis complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Competitor Analysis</h2>
      <Input
        label="Competitor Domain (e.g. example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="competitor.com"
        disabled={loading}
      />
      <Button onClick={handleAnalyze} loading={loading}>
        Analyze Competitor
      </Button>
      {result && (
        <div className="space-y-6">
          {result.ranking_keywords.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <h3 className="mb-3 font-semibold text-card-foreground">Ranking positions (lower is better)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.ranking_keywords.map((r, i) => ({
                      name: r.keyword.length > 12 ? r.keyword.slice(0, 10) + "…" : r.keyword,
                      position: r.position,
                      fullName: r.keyword,
                    }))}
                    margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
                  >
                    <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 11 }} angle={-45} textAnchor="end" height={48} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(val, _, props) => [val, (props.payload as { fullName: string }).fullName]} />
                    <Bar dataKey="position" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h3 className="mb-2 font-semibold text-card-foreground">Indexed Pages (Traffic Proxy)</h3>
            <div className="flex items-center gap-4">
              <div className="h-24 min-w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{ name: "Indexed", pages: result.estimated_indexed_pages, fill: CHART_COLORS[1] }]}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  >
                    <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}k` : String(v))} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(v) => [Number(v).toLocaleString(), "Pages"]} />
                    <Bar dataKey="pages" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-muted-foreground">Estimated indexed pages: <strong className="text-foreground">{result.estimated_indexed_pages.toLocaleString()}</strong></p>
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-semibold text-card-foreground">Keywords They Rank For</h3>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="p-3 text-left font-medium">Keyword</th>
                    <th className="p-3 text-left font-medium">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {result.ranking_keywords.map((r, i) => (
                    <tr key={i} className="border-b border-border/50 transition-colors hover:bg-background/30">
                      <td className="p-3">{r.keyword}</td>
                      <td className="p-3">{r.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.ranking_keywords.length === 0 && (
                <p className="p-4 text-muted-foreground">No ranking keywords found.</p>
              )}
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-semibold text-card-foreground">Top Ranking Content</h3>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="p-3 text-left font-medium">Title</th>
                    <th className="p-3 text-left font-medium">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {result.top_ranking_content.map((t, i) => (
                    <tr key={i} className="border-b border-border/50 transition-colors hover:bg-background/30">
                      <td className="p-3">{t.title}</td>
                      <td className="p-3 break-all">{t.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

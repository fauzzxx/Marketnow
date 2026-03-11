"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#eab308"];

type CompareResult = {
  keywords_used: string[];
  keyword_comparison: { keyword: string; company1_position: number | null; company2_position: number | null }[];
  graph_data: { labels: string[]; company1: number[]; company2: number[] };
  summary: {
    domain1: { domain: string; indexed_pages: number; top_pages: { title: string; url: string }[] };
    domain2: { domain: string; indexed_pages: number; top_pages: { title: string; url: string }[] };
  };
};

export default function CompetitorTab() {
  const [domain1, setDomain1] = useState("");
  const [domain2, setDomain2] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

  const handleCompare = async () => {
    if (!domain1.trim() || !domain2.trim() || !query.trim()) {
      toast("Enter both domains and a query.", "error");
      return;
    }
    setLoading(true);
    setCompareResult(null);
    try {
      const data = await api.competitor.compare(domain1.trim(), domain2.trim(), query.trim());
      setCompareResult(data);
      toast("Comparison complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Compare failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Competitor Analysis</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Domain 1 (e.g. example.com)"
          value={domain1}
          onChange={(e) => setDomain1(e.target.value)}
          placeholder="company1.com"
          disabled={loading}
        />
        <Input
          label="Domain 2 (e.g. competitor.com)"
          value={domain2}
          onChange={(e) => setDomain2(e.target.value)}
          placeholder="company2.com"
          disabled={loading}
        />
      </div>
      <Input
        label="Query / seed keyword (e.g. best CRM software)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Keyword to compare rankings for"
        disabled={loading}
      />
      <Button onClick={handleCompare} loading={loading}>
        Compare domains
      </Button>

      {compareResult && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h3 className="mb-3 font-semibold text-card-foreground">Position comparison (lower is better)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compareResult.keyword_comparison.map((row) => ({
                    name: row.keyword.length > 12 ? row.keyword.slice(0, 10) + "…" : row.keyword,
                    fullName: row.keyword,
                    company1: row.company1_position ?? 0,
                    company2: row.company2_position ?? 0,
                  }))}
                  margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
                >
                  <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 11 }} angle={-45} textAnchor="end" height={48} />
                  <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Legend />
                  <Bar dataKey="company1" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name={compareResult.summary.domain1.domain} />
                  <Bar dataKey="company2" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} name={compareResult.summary.domain2.domain} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-x-auto">
            <h3 className="mb-2 p-4 font-semibold text-card-foreground">Keyword comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="p-3 text-left font-medium">Keyword</th>
                  <th className="p-3 text-left font-medium">{compareResult.summary.domain1.domain} position</th>
                  <th className="p-3 text-left font-medium">{compareResult.summary.domain2.domain} position</th>
                </tr>
              </thead>
              <tbody>
                {compareResult.keyword_comparison.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 transition-colors hover:bg-background/30">
                    <td className="p-3">{row.keyword}</td>
                    <td className="p-3">{row.company1_position ?? "—"}</td>
                    <td className="p-3">{row.company2_position ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <h3 className="mb-2 font-semibold text-card-foreground">{compareResult.summary.domain1.domain}</h3>
              <p className="text-sm text-muted-foreground">Indexed pages: <strong className="text-foreground">{compareResult.summary.domain1.indexed_pages.toLocaleString()}</strong></p>
              {compareResult.summary.domain1.top_pages?.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Top pages</p>
                  <ul className="space-y-1 text-xs">
                    {compareResult.summary.domain1.top_pages.slice(0, 5).map((p, i) => (
                      <li key={i} className="truncate" title={p.url}>{p.title || p.url}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <h3 className="mb-2 font-semibold text-card-foreground">{compareResult.summary.domain2.domain}</h3>
              <p className="text-sm text-muted-foreground">Indexed pages: <strong className="text-foreground">{compareResult.summary.domain2.indexed_pages.toLocaleString()}</strong></p>
              {compareResult.summary.domain2.top_pages?.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Top pages</p>
                  <ul className="space-y-1 text-xs">
                    {compareResult.summary.domain2.top_pages.slice(0, 5).map((p, i) => (
                      <li key={i} className="truncate" title={p.url}>{p.title || p.url}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

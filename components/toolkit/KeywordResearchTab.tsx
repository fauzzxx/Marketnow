"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#eab308", "#ef4444"];

export default function KeywordResearchTab() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<
    { keyword: string; estimated_search_volume_proxy: number; difficulty: string }[] | null
  >(null);

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      toast("Enter a keyword.", "error");
      return;
    }
    setLoading(true);
    setKeywords(null);
    try {
      const data = await api.keywordResearch.analyze(keyword.trim());
      setKeywords(data.keywords);
      toast("Analysis complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!keywords || keywords.length === 0) return;
    const header = "Keyword,Estimated Search Volume (Proxy),Difficulty\n";
    const rows = keywords
      .map((k) => `"${k.keyword}",${k.estimated_search_volume_proxy},"${k.difficulty}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keyword_analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV downloaded.", "success");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Keyword Research Tool</h2>
      <Input
        label="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="e.g. digital marketing"
        disabled={loading}
      />
      <Button onClick={handleAnalyze} loading={loading}>
        Analyze Keyword
      </Button>
      {keywords && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={downloadCsv}>
              Download CSV
            </Button>
          </div>
          {keywords.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-2 text-sm font-medium text-card-foreground">Search volume (top keywords)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={keywords.slice(0, 10).map((k, i) => ({
                        name: k.keyword.length > 14 ? k.keyword.slice(0, 12) + "…" : k.keyword,
                        volume: k.estimated_search_volume_proxy,
                        fullName: k.keyword,
                      }))}
                      margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 11 }} angle={-45} textAnchor="end" height={48} />
                      <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}k` : String(v))} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(_, __, props) => [props.payload.fullName, props.payload.volume.toLocaleString()]} labelFormatter={() => "Volume"} />
                      <Bar dataKey="volume" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-2 text-sm font-medium text-card-foreground">Difficulty distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          keywords.reduce<Record<string, number>>((acc, k) => {
                            acc[k.difficulty] = (acc[k.difficulty] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={72}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {Object.entries(
                          keywords.reduce<Record<string, number>>((acc, k) => {
                            acc[k.difficulty] = (acc[k.difficulty] || 0) + 1;
                            return acc;
                          }, {})
                        ).map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="p-3 text-left font-medium">Keyword</th>
                  <th className="p-3 text-left font-medium">Est. Search Volume (Proxy)</th>
                  <th className="p-3 text-left font-medium">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, i) => (
                  <tr key={i} className="border-b border-border/50 transition-colors hover:bg-background/30">
                    <td className="p-3">{k.keyword}</td>
                    <td className="p-3">{k.estimated_search_volume_proxy.toLocaleString()}</td>
                    <td className="p-3">{k.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Swords, ExternalLink, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { trackActivity } from "@/lib/activityTracker";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED"];

type CompareResult = {
  keywords_used: string[];
  keyword_comparison: { keyword: string; company1_position: number | null; company2_position: number | null }[];
  graph_data: { labels: string[]; company1: number[]; company2: number[] };
  summary: {
    domain1: { domain: string; indexed_pages: number; top_pages: { title: string; url: string }[] };
    domain2: { domain: string; indexed_pages: number; top_pages: { title: string; url: string }[] };
  };
};

export default function CompetitorTab({ initialValues }: { initialValues?: Record<string, string> }) {
  const [domain1, setDomain1] = useState("");
  const [domain2, setDomain2] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (initialValues) {
      if (initialValues.domain1) setDomain1(initialValues.domain1);
      if (initialValues.domain2) setDomain2(initialValues.domain2);
      if (initialValues.query) setQuery(initialValues.query);
    }
  }, [initialValues]);
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
      trackActivity("competitor", `${domain1.trim()} vs ${domain2.trim()}`, domain1.trim(), { domain1: domain1.trim(), domain2: domain2.trim(), query: query.trim() });
      toast("Comparison complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Compare failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <Input theme="light"
            label="Your Vector (Domain 1)"
            value={domain1}
            onChange={(e) => setDomain1(e.target.value)}
            placeholder="e.g. apple.com"
            disabled={loading}
          />
          <Input theme="light"
            label="Target Rival (Domain 2)"
            value={domain2}
            onChange={(e) => setDomain2(e.target.value)}
            placeholder="e.g. samsung.com"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <Input theme="light"
              label="Comparison Matrix (Query)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. best smartphone cameras"
              disabled={loading}
            />
          </div>
          <Button variant="dashboard" onClick={handleCompare} loading={loading} className="px-12 rounded-2xl group">
            <Swords className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
            Initialize Conflict Analysis
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {compareResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10">
              <div className="flex items-center gap-3 mb-10">
                <Activity className="h-5 w-5 text-ai-blue" />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Rank Displacement Analysis</h4>
              </div>
              <div style={{ height: Math.max(400, 320 + (compareResult.graph_data.labels.reduce((m, l) => Math.max(m, l.length), 0)) * 3) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={compareResult.graph_data.labels.map((label, idx) => ({
                      name: label,
                      company1: compareResult.graph_data.company1[idx],
                      company2: compareResult.graph_data.company2[idx],
                    }))}
                    margin={{ top: 20, right: 20, bottom: 120, left: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }}
                      angle={-40}
                      textAnchor="end"
                      interval={0}
                      height={120}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b", maxWidth: 350 }}
                      labelStyle={{ fontWeight: 700, fontSize: 12, marginBottom: 4, whiteSpace: "normal", wordBreak: "break-word" }}
                      formatter={(v: any) => [v + " / 12", "Market Strength"]}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="company1" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} name={compareResult.summary.domain1.domain} barSize={32} />
                    <Bar dataKey="company2" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} name={compareResult.summary.domain2.domain} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {[
                { data: compareResult.summary.domain1, color: "text-[#9333EA]" },
                { data: compareResult.summary.domain2, color: "text-ai-blue" }
              ].map((rival, idx) => (
                <div key={idx} className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 border border-slate-100 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className={cn("text-2xl font-black font-sans truncate max-w-[200px]", rival.color)}>
                        {rival.data.domain}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Vector Profile</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black font-sans tabular-nums">{rival.data.indexed_pages.toLocaleString()}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Total Pages</p>
                    </div>
                  </div>

                  {rival.data.top_pages?.length > 0 && (
                    <div className="space-y-4 flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-ai-purple">Core Assets</p>
                      <div className="space-y-2">
                        {rival.data.top_pages.slice(0, 4).map((p, i) => (
                          <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#141414] border border-slate-100 dark:border-[#222222] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors">
                            <span className="text-sm font-bold truncate max-w-[250px]" title={p.url}>{p.title || p.url}</span>
                            <ExternalLink className="h-3 w-3 text-slate-800/20 dark:text-gray-200/20 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white dark:bg-[#141414] border-b border-slate-200 dark:border-[#2a2a2a] font-sans uppercase tracking-widest text-[10px] text-slate-500 dark:text-gray-400">
                    <th className="p-6 text-left">Target Pulse</th>
                    <th className="p-6 text-left">{compareResult.summary.domain1.domain}</th>
                    <th className="p-6 text-left">{compareResult.summary.domain2.domain}</th>
                    <th className="p-6 text-left">Differential</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-gray-400">
                  {compareResult.keyword_comparison.map((row, i) => {
                    const diff = (row.company1_position || 100) - (row.company2_position || 100);
                    return (
                      <tr key={i} className="border-b border-slate-100 dark:border-[#222222] group hover:bg-white dark:hover:bg-[#1a1a1a] transition-colors">
                        <td className="p-6 font-bold">{row.keyword}</td>
                        <td className="p-6 font-black tabular-nums text-[#9333EA]">{row.company1_position ?? "—"}</td>
                        <td className="p-6 font-black tabular-nums text-ai-blue">{row.company2_position ?? "—"}</td>
                        <td className="p-6 font-black tabular-nums">
                          {diff === 0 ? "0" : diff < 0 ? <span className="text-emerald-600">{diff}</span> : <span className="text-red-500">+{diff}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Download, Database } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED", "#A855F7"];

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
    <div className="space-y-10">
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1">
          <Input theme="light"
            label="Root Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. artificial intelligence"
            disabled={loading}
          />
        </div>
        <Button variant="dashboard" onClick={handleAnalyze} loading={loading} className="px-10 rounded-2xl">
          Extract Keyword Data
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {keywords && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-ai-blue" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Discovery Results</h3>
              </div>
              <Button variant="outline" size="sm" onClick={downloadCsv} className="rounded-xl border-slate-200 hover:bg-white">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {keywords.length > 0 && (
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                  <h4 className="text-xl font-black font-sans uppercase tracking-widest mb-10 text-center">Volume Saturation</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={keywords.slice(0, 10).map((k, i) => ({
                          name: k.keyword.length > 14 ? k.keyword.slice(0, 12) + "…" : k.keyword,
                          volume: k.estimated_search_volume_proxy,
                          fullName: k.keyword,
                          fill: CHART_COLORS[i % CHART_COLORS.length]
                        }))}
                        margin={{ top: 0, bottom: 40 }}
                      >
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} angle={-45} textAnchor="end" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }}
                          formatter={(v: any) => [v.toLocaleString(), "Est. Volume"]}
                        />
                        <Bar dataKey="volume" radius={[12, 12, 0, 0]} barSize={32}>
                          {keywords.slice(0, 10).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                  <h4 className="text-xl font-black font-sans uppercase tracking-widest mb-10 text-center">Difficulty Dynamics</h4>
                  <div className="h-72 relative">
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
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          stroke="none"
                        >
                          {Object.entries(keywords.reduce<Record<string, number>>((acc, k) => { acc[k.difficulty] = (acc[k.difficulty] || 0) + 1; return acc; }, {})).map((_, i) => (
                            <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 font-sans uppercase tracking-widest text-[10px] text-slate-500">
                    <th className="p-6 text-left">Vector Keyword</th>
                    <th className="p-6 text-left">Est. Sync Volume</th>
                    <th className="p-6 text-left">Opportunity Score</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {keywords.map((k, i) => (
                    <tr key={i} className="border-b border-slate-100 group hover:bg-white transition-colors">
                      <td className="p-6 font-bold">{k.keyword}</td>
                      <td className="p-6 font-black tabular-nums text-ai-blue">{k.estimated_search_volume_proxy.toLocaleString()}</td>
                      <td className="p-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          k.difficulty.toLowerCase().includes('easy') ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            k.difficulty.toLowerCase().includes('medium') ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                              "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          {k.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


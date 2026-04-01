"use client";

import { useState, useEffect } from "react";
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
import { api } from "@/lib/api";
import { trackActivity } from "@/lib/activityTracker";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED"];

export default function AIVisibilityTab({ initialValues }: { initialValues?: Record<string, string> }) {
  const [brandName, setBrandName] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (initialValues) {
      if (initialValues.brandName) setBrandName(initialValues.brandName);
      if (initialValues.keyword) setKeyword(initialValues.keyword);
    }
  }, [initialValues]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    brand_positions: number[];
    google_score: number;
    ai_response_preview: string;
    ai_score: number;
    final_visibility_score: number;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!brandName.trim() || !keyword.trim()) {
      toast("Please enter both brand name and keyword.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await api.aiVisibility.analyze(brandName.trim(), keyword.trim());
      setResult(data);
      trackActivity("ai-visibility", `${brandName.trim()} - ${keyword.trim()}`, undefined, { brandName: brandName.trim(), keyword: keyword.trim() });
      toast("Analysis complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const scoreBarData = result
    ? [
      { name: "Google", score: result.google_score, fill: CHART_COLORS[1] },
      { name: "AI", score: result.ai_score, fill: CHART_COLORS[2] },
      { name: "Final", score: result.final_visibility_score, fill: CHART_COLORS[0] },
    ]
    : [];

  const scorePieData = result
    ? [
      { name: "Google Score", value: result.google_score * 0.6, fill: CHART_COLORS[1] },
      { name: "AI Score", value: result.ai_score * 0.4, fill: CHART_COLORS[2] },
    ]
    : [];

  const positionBarData =
    result && result.brand_positions.length > 0
      ? result.brand_positions.map((pos, i) => ({
        name: `#${pos}`,
        position: 13 - pos, // 1st Rank = 12 Strength
        realPosition: pos,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      }))
      : [];

  return (
    <div className="space-y-10">
      <div className="grid gap-8 sm:grid-cols-2 bg-white dark:bg-[#141414] p-8 rounded-[2rem] border border-slate-200 dark:border-[#2a2a2a] backdrop-blur-md">
        <Input theme="light"
          label="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="yourbrand.com"
          disabled={loading}
          className="bg-transparent"
        />
        <Input theme="light"
          label="Target Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. best organic soda"
          disabled={loading}
          className="bg-transparent"
        />
      </div>
      <div className="flex justify-center">
        <Button variant="dashboard" onClick={handleAnalyze} loading={loading} size="lg" className="px-12 rounded-2xl shadow-2xl shadow-purple-500/20">
          Run Deep Visibility Scan
        </Button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Google Results */}
            <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-1 items-center overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-black font-sans uppercase tracking-widest text-slate-800 dark:text-gray-200 mb-6">Google Search Matrix</h3>
                {result.brand_positions.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {result.brand_positions.map((pos, i) => (
                        <div key={i} className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-black">
                          Rank #{pos}
                        </div>
                      ))}
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={positionBarData} layout="vertical" margin={{ left: 0, right: 30 }}>
                          <XAxis type="number" domain={[0, 12]} hide />
                          <YAxis type="category" dataKey="name" width={40} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }}
                            labelStyle={{ fontWeight: 900, color: '#EC4899' }}
                          />
                          <Bar dataKey="position" radius={[0, 10, 10, 0]} barSize={20}>
                            {positionBarData.map((entry, index) => (
                              <Cell key={index} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-red-400 font-bold uppercase tracking-widest text-xs">Brand Invisiblity Detected in Top 10</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Preview */}
            <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-8">
              <h3 className="text-xl font-black font-sans uppercase tracking-widest text-slate-800 dark:text-gray-200 mb-6">Gemini Intelligence Sync</h3>
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-slate-100 dark:border-[#222222] space-y-6">
                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed italic">&quot;{result.ai_response_preview}&quot;</p>
                <div className="pt-4 border-t border-slate-100 dark:border-[#222222] flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">AI Mention Status</span>
                  {result.ai_score === 100 ? (
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Mentioned</span>
                  ) : (
                    <span className="bg-red-50 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Not Found</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-8 items-center overflow-hidden">
            <h3 className="text-xl font-black font-sans uppercase tracking-widest text-slate-800 dark:text-gray-200 mb-10 text-center">Visibility Score Optimization</h3>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreBarData} margin={{ top: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 12]} hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }}
                    />
                    <Bar dataKey="score" radius={[12, 12, 0, 0]} barSize={40}>
                      {scoreBarData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scorePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {scorePieData.map((_, i) => (
                        <Cell key={i} fill={scorePieData[i].fill} className="filter drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-3xl font-black text-slate-800 dark:text-gray-200">{result.final_visibility_score}</span>
                  <span className="text-[8px] font-black uppercase text-slate-500 dark:text-gray-400 tracking-widest">/ 12 Score</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Google Score", val: result.google_score, color: "text-ai-blue" },
              { label: "AI Score", val: result.ai_score, color: "text-ai-purple" },
              { label: "Final Visibility", val: result.final_visibility_score, color: "text-[#9333EA]" },
            ].map(item => (
              <div key={item.label} className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-8 border border-slate-100 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-400 mb-2">{item.label}</p>
                <p className={cn("text-4xl font-black font-sans", item.color)}>{item.val}<span className="text-lg opacity-40 ml-1">/12</span></p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}


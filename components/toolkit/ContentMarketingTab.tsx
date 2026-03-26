"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookOpen, PenTool, Sparkles, Layout } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED", "#A855F7"];

export default function ContentMarketingTab() {
  const [subTab, setSubTab] = useState<"topic" | "seo" | "ai">("topic");
  const [topicKeyword, setTopicKeyword] = useState("");
  const [seoKeyword, setSeoKeyword] = useState("");
  const [articleText, setArticleText] = useState("");
  const [aiKeyword, setAiKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [topicResult, setTopicResult] = useState<{
    related_searches: string[];
    people_also_ask: string[];
  } | null>(null);
  const [seoResult, setSeoResult] = useState<{
    word_count: number;
    keyword_count: number;
    keyword_density_percent: number;
    readability_score: number;
  } | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const runTopicResearch = async () => {
    if (!topicKeyword.trim()) {
      toast("Enter topic keyword.", "error");
      return;
    }
    setLoading(true);
    setTopicResult(null);
    try {
      const data = await api.content.topicResearch(topicKeyword.trim());
      setTopicResult(data);
      toast("Topic research done.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runSeoAnalysis = async () => {
    if (!seoKeyword.trim()) {
      toast("Enter target keyword.", "error");
      return;
    }
    setLoading(true);
    setSeoResult(null);
    try {
      const data = await api.content.seoAnalysis(seoKeyword.trim(), articleText);
      setSeoResult(data);
      toast("Analysis done.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runAiSuggestions = async () => {
    if (!aiKeyword.trim()) {
      toast("Enter topic.", "error");
      return;
    }
    setLoading(true);
    setAiResult(null);
    try {
      const data = await api.content.aiSuggestions(aiKeyword.trim());
      setAiResult(data.suggestions);
      toast("Suggestions generated.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200">
          {[
            { id: "topic", label: "Topic Research", icon: BookOpen },
            { id: "seo", label: "Writing Assistant", icon: PenTool },
            { id: "ai", label: "AI Suggestions", icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                subTab === tab.id ? "bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white shadow-xl shadow-purple-500/20" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "topic" && (
          <motion.div
            key="topic"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Input theme="light"
                  label="Topic Focus"
                  value={topicKeyword}
                  onChange={(e) => setTopicKeyword(e.target.value)}
                  placeholder="e.g. quantum computing"
                  disabled={loading}
                />
              </div>
              <Button variant="dashboard" onClick={runTopicResearch} loading={loading} className="px-10 rounded-2xl">
                Map Topic Universe
              </Button>
            </div>

            {topicResult && (
              <div className="space-y-10">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-10 text-center">Semantic Density</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Related", value: topicResult.related_searches.length, fill: CHART_COLORS[1] },
                              { name: "Queries", value: topicResult.people_also_ask.length, fill: CHART_COLORS[2] },
                            ]}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={8}
                            stroke="none"
                          >
                            <Cell fill={CHART_COLORS[1]} />
                            <Cell fill={CHART_COLORS[2]} />
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-10 text-center">Intent Scale</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Related", count: topicResult.related_searches.length },
                            { name: "PAA", count: topicResult.people_also_ask.length },
                          ]}
                          margin={{ top: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                          <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                            <Cell fill={CHART_COLORS[1]} />
                            <Cell fill={CHART_COLORS[2]} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                    <h4 className="text-xl font-black font-sans uppercase tracking-widest text-ai-blue mb-8">Related Vectors</h4>
                    <div className="flex flex-wrap gap-3">
                      {topicResult.related_searches.map((s, i) => (
                        <span key={i} className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-sm font-bold hover:bg-slate-50 transition-colors cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                    <h4 className="text-xl font-black font-sans uppercase tracking-widest text-ai-purple mb-8">User Intelligence (PAA)</h4>
                    <div className="space-y-4">
                      {topicResult.people_also_ask.map((q, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 text-sm font-medium italic text-slate-600">
                          &quot;{q}&quot;
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {subTab === "seo" && (
          <motion.div
            key="seo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-8">
              <Input theme="light"
                label="Target Keyword Signal"
                value={seoKeyword}
                onChange={(e) => setSeoKeyword(e.target.value)}
                placeholder="e.g. cloud security best practices"
                disabled={loading}
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Composition</label>
                <textarea
                  className="w-full min-h-[300px] bg-slate-50/50 rounded-2xl border border-slate-200 p-8 text-slate-800 font-sans leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all resize-none shadow-sm"
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  placeholder="Paste your content here for deep analysis..."
                  disabled={loading}
                />
              </div>
              <div className="flex justify-center">
                <Button variant="dashboard" onClick={runSeoAnalysis} loading={loading} size="lg" className="px-16 rounded-2xl">
                  Run SEO Audit
                </Button>
              </div>
            </div>

            {seoResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-10 text-center">Structural Vitality</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Words", value: seoResult.word_count, fill: CHART_COLORS[1] },
                          { name: "Keywords", value: seoResult.keyword_count, fill: CHART_COLORS[2] },
                          { name: "Density", value: seoResult.keyword_density_percent * 10, fill: CHART_COLORS[3] }, // scaled
                          { name: "Readability", value: seoResult.readability_score, fill: CHART_COLORS[4] },
                        ]}
                        margin={{ top: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                          <Cell fill={CHART_COLORS[1]} />
                          <Cell fill={CHART_COLORS[2]} />
                          <Cell fill={CHART_COLORS[3]} />
                          <Cell fill={CHART_COLORS[4]} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-4">
                  {[
                    { label: "Volume", val: seoResult.word_count, unit: "words", color: "text-ai-blue" },
                    { label: "Matches", val: seoResult.keyword_count, unit: "tokens", color: "text-ai-purple" },
                    { label: "Concentration", val: seoResult.keyword_density_percent, unit: "%", color: "text-emerald-600" },
                    { label: "Clarity Score", val: seoResult.readability_score, unit: "/ 100", color: "text-[#9333EA]" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8 text-center border border-slate-100 bg-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
                      <p className={cn("text-3xl font-black font-sans tabular-nums", stat.color)}>{stat.val}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-800/20 mt-1">{stat.unit}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {subTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Input theme="light"
                  label="Seed Concept"
                  value={aiKeyword}
                  onChange={(e) => setAiKeyword(e.target.value)}
                  placeholder="e.g. futuristic city design"
                  disabled={loading}
                />
              </div>
              <Button variant="dashboard" onClick={runAiSuggestions} loading={loading} className="px-10 rounded-2xl">
                Synthesize Creative Strategy
              </Button>
            </div>

            {aiResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-12 bg-gradient-to-br from-white/10 to-transparent relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="h-10 w-10 text-[#9333EA] opacity-20 group-hover:scale-125 transition-transform duration-700" />
                </div>
                <div className="relative z-10 prose prose-invert max-w-none">
                  <h4 className="text-xl font-black font-sans uppercase tracking-widest text-slate-800 mb-8 border-b border-slate-200 pb-4">AI Insight Stream</h4>
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-600">{aiResult}</pre>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

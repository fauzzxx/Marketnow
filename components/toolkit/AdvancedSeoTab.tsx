"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe, Target, LineChart, Link2, Activity, ShieldCheck, Search } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED", "#A855F7"];

export default function AdvancedSeoTab() {
  const [subTab, setSubTab] = useState<"audit" | "onpage" | "position" | "backlinks">("audit");
  const [auditUrl, setAuditUrl] = useState("");
  const [onpageUrl, setOnpageUrl] = useState("");
  const [onpageKeyword, setOnpageKeyword] = useState("");
  const [positionDomain, setPositionDomain] = useState("");
  const [positionKeyword, setPositionKeyword] = useState("");
  const [backlinkDomain, setBacklinkDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    title: string | null; title_length: number;
    meta_description: string | null; meta_description_length: number;
    meta_keywords: string | null;
    open_graph: Record<string, string>;
    canonical_url: string | null;
    h1_count: number; h1_texts: string[];
    h2_count: number; h2_texts: string[];
    total_images: number; images_with_alt: number; alt_coverage_percent: number;
    url_audited: string; status_code: number | null;
    rendered_with: string;
  } | null>(null);
  const [forceJs, setForceJs] = useState(false);
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
      const data = await api.advanced.siteAudit(auditUrl.trim(), forceJs || undefined);
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

  const tabs = [
    { id: "audit", label: "Site Audit", icon: Globe },
    { id: "onpage", label: "On-Page", icon: ShieldCheck },
    { id: "position", label: "Position", icon: Target },
    { id: "backlinks", label: "Backlinks", icon: Link2 },
  ] as const;

  return (
    <div className="space-y-10">
      <div className="flex justify-center flex-wrap gap-3">
        <div className="inline-flex p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                subTab === tab.id ? "bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white shadow-xl shadow-purple-500/20" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Input theme="light"
                  label="Target Domain / URL"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="https://acme-corp.com"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col items-end gap-3">
                <Button variant="dashboard" onClick={runSiteAudit} loading={loading} className="px-10 rounded-2xl group">
                  <Search className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Initialize Full Audit
                </Button>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={forceJs}
                    onChange={(e) => setForceJs(e.target.checked)}
                    disabled={loading}
                    className="accent-purple-500 h-3.5 w-3.5 rounded"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">JS Rendering</span>
                </label>
              </div>
            </div>

            {auditResult && (
              <div className="space-y-8">
                {/* Renderer badge */}
                {auditResult.rendered_with && auditResult.rendered_with !== "static" && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 border border-purple-500/20">
                      {auditResult.rendered_with === "selenium" ? "JS Rendered" : "JS Fallback"}
                    </span>
                    <span className="text-[10px] text-slate-400">Page was rendered with headless browser</span>
                  </div>
                )}
                {/* Chart + Meta Summary Row */}
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 lg:col-span-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Metadata Distribution</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Title Tag", chars: auditResult.title_length ?? 0 },
                            { name: "Meta Description", chars: auditResult.meta_description_length ?? 0 },
                          ]}
                        >
                          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                          <Bar dataKey="chars" radius={[10, 10, 0, 0]} barSize={60}>
                            <Cell fill={CHART_COLORS[0]} />
                            <Cell fill={CHART_COLORS[1]} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col h-full">
                    <div className="mb-8">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#EC4899]">META TITLE</p>
                        <p className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{auditResult.title_length ?? 0} chars</p>
                      </div>
                      <p className="text-xl font-black font-sans leading-tight line-clamp-3">{auditResult.title || "Not Found"}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-ai-blue">META DESCRIPTION</p>
                        <p className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{auditResult.meta_description_length ?? 0} chars</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed italic">{auditResult.meta_description || "Not Found"}</p>
                    </div>
                  </div>
                </div>

                {/* Extended Audit Details */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Keywords */}
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-3">META KEYWORDS</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{auditResult.meta_keywords || "Not set"}</p>
                  </div>

                  {/* Canonical */}
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">CANONICAL URL</p>
                    <p className="text-xs text-slate-600 leading-relaxed break-all">{auditResult.canonical_url || "Not set"}</p>
                  </div>

                  {/* Image Alt Coverage */}
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">IMAGE ALT COVERAGE</p>
                    <p className="text-3xl font-black">{auditResult.alt_coverage_percent ?? 0}%</p>
                    <p className="text-[10px] text-slate-500 mt-1">{auditResult.images_with_alt ?? 0} of {auditResult.total_images ?? 0} images have alt text</p>
                  </div>
                </div>

                {/* Headings */}
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#EC4899] mb-3">H1 TAGS ({auditResult.h1_count ?? 0})</p>
                    {(auditResult.h1_texts ?? []).length > 0 ? (
                      <ul className="space-y-1">{(auditResult.h1_texts ?? []).map((t, i) => <li key={i} className="text-xs text-slate-600 truncate">{t}</li>)}</ul>
                    ) : <p className="text-xs text-slate-400 italic">No H1 tags found</p>}
                  </div>
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#D946EF] mb-3">H2 TAGS ({auditResult.h2_count ?? 0})</p>
                    {(auditResult.h2_texts ?? []).length > 0 ? (
                      <ul className="space-y-1">{(auditResult.h2_texts ?? []).map((t, i) => <li key={i} className="text-xs text-slate-600 truncate">{t}</li>)}</ul>
                    ) : <p className="text-xs text-slate-400 italic">No H2 tags found</p>}
                  </div>
                </div>

                {/* Open Graph */}
                {Object.keys(auditResult.open_graph ?? {}).length > 0 && (
                  <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">OPEN GRAPH TAGS</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(auditResult.open_graph ?? {}).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-[10px] font-mono text-slate-400">{key}</p>
                          {key === "og:image" ? (
                            <img src={val} alt="OG Image" className="mt-1 rounded-lg max-h-32 object-cover" />
                          ) : (
                            <p className="text-xs text-slate-600 truncate">{val}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {subTab === "onpage" && (
          <motion.div
            key="onpage"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input theme="light"
                  label="Target Signal (Keyword)"
                  value={onpageKeyword}
                  onChange={(e) => setOnpageKeyword(e.target.value)}
                  placeholder="e.g. artificial intelligence"
                  disabled={loading}
                />
                <Input theme="light"
                  label="Context URL"
                  value={onpageUrl}
                  onChange={(e) => setOnpageUrl(e.target.value)}
                  placeholder="https://example.com/blog/ai"
                  disabled={loading}
                />
              </div>
              <div className="flex justify-center">
                <Button variant="dashboard" onClick={runOnpage} loading={loading} className="px-12 rounded-2xl">
                  Analyze Density
                </Button>
              </div>
            </div>

            {onpageResult !== null && (
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-20 text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#9333EA] blur-3xl opacity-10 animate-pulse" />
                  <p className="text-8xl font-black font-sans tabular-nums text-slate-800 relative">{onpageResult}</p>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Keyword Frequency Matches</h4>
                  <p className="text-xs text-slate-800/20 mt-1 max-w-xs mx-auto">Detected instances of target keyword within the contextual domain provided.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {subTab === "position" && (
          <motion.div
            key="position"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input theme="light"
                  label="Your Entity (Domain)"
                  value={positionDomain}
                  onChange={(e) => setPositionDomain(e.target.value)}
                  placeholder="example.com"
                  disabled={loading}
                />
                <Input theme="light"
                  label="Tracking Target (Keyword)"
                  value={positionKeyword}
                  onChange={(e) => setPositionKeyword(e.target.value)}
                  placeholder="best coffee beans"
                  disabled={loading}
                />
              </div>
              <div className="flex justify-center">
                <Button variant="dashboard" onClick={runPosition} loading={loading} className="px-12 rounded-2xl">
                  Track Global Ranking
                </Button>
              </div>
            </div>

            {positionResult && (
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-20 flex flex-col items-center text-center space-y-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Target className="h-64 w-64" />
                </div>
                <div className={cn(
                  "h-32 w-32 rounded-3xl flex items-center justify-center border text-4xl font-black",
                  positionResult.found ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}>
                  {positionResult.found ? `#${positionResult.position}` : "NR"}
                </div>
                <div>
                  <h4 className="text-xl font-black font-sans uppercase tracking-widest">
                    {positionResult.found ? "Successful Positioning" : "Orbiting... (Not Found)"}
                  </h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">
                    {positionResult.found
                      ? `Your entity is currently indexed at position #${positionResult.position} in the search grid.`
                      : "The target keyword did not surface your entity within the top 100 search results."}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {subTab === "backlinks" && (
          <motion.div
            key="backlinks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Input theme="light"
                  label="Domain for Backlink Pulse"
                  value={backlinkDomain}
                  onChange={(e) => setBacklinkDomain(e.target.value)}
                  placeholder="rival-competitor.com"
                  disabled={loading}
                />
              </div>
              <Button variant="dashboard" onClick={runBacklinks} loading={loading} className="px-10 rounded-2xl group">
                <Link2 className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform" />
                Trace Link Nodes
              </Button>
            </div>

            {backlinkResult !== null && (
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-10">Historical Influence</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[{ name: "Authority Links", count: backlinkResult }]}
                        >
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <Bar dataKey="count" radius={[12, 12, 12, 12]} fill={CHART_COLORS[2]} barSize={80} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
                    <p className="text-sm font-black tracking-widest uppercase text-slate-500">Total Mentions</p>
                    <p className="text-3xl font-black font-sans text-ai-purple transition-all hover:scale-110">{backlinkResult.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 bg-white flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-ai-blue/10 rounded-xl">
                        <Activity className="h-5 w-5 text-ai-blue" />
                      </div>
                      <div>
                        <h5 className="text-sm font-black uppercase tracking-widest">Network Resonance</h5>
                        <p className="text-xs text-slate-500 mt-1">High-density backlink strings detected for this domain. Influence remains stable.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Globe className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-black uppercase tracking-widest">Global Reach</h5>
                        <p className="text-xs text-slate-500 mt-1">Spanning multiple geographic clusters and authority tiers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

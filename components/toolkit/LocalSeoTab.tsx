"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Search, Star, MessageSquare, Info, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { trackActivity } from "@/lib/activityTracker";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED"];

export default function LocalSeoTab({ initialValues }: { initialValues?: Record<string, string> }) {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (initialValues) {
      if (initialValues.businessName) setBusinessName(initialValues.businessName);
      if (initialValues.location) setLocation(initialValues.location);
    }
  }, [initialValues]);
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<Record<string, unknown> | null>(null);
  const [found, setFound] = useState<boolean | null>(null);

  const handleCheck = async () => {
    if (!businessName.trim() || !location.trim()) {
      toast("Enter business name and location.", "error");
      return;
    }
    setLoading(true);
    setFound(null);
    setBusiness(null);
    try {
      const data = await api.localSeo.business(businessName.trim(), location.trim());
      setFound(data.found);
      setBusiness(data.business || null);
      trackActivity("local", `${businessName.trim()}, ${location.trim()}`, undefined, { businessName: businessName.trim(), location: location.trim() });
      toast(data.found ? "Business found." : "No listing found.", data.found ? "success" : "info");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Check failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 flex flex-col md:flex-row gap-8 items-end">
        <div className="flex-1 space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input theme="light"
              label="Entity Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Blue Bottle Coffee"
              disabled={loading}
            />
            <Input theme="light"
              label="Geographic Vector"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco"
              disabled={loading}
            />
          </div>
        </div>
        <Button variant="dashboard" onClick={handleCheck} loading={loading} className="px-12 rounded-2xl group">
          <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Scan Local Grid
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {found !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center border",
                  found ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}>
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-1">GMB Status</h4>
                  <p className="text-2xl font-black font-sans uppercase tracking-tight">
                    {found ? "Entity Synchronized" : "Unknown Entity"}
                  </p>
                </div>
              </div>
              <div className="hidden md:block h-20 w-1/3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{ name: found ? "Found" : "Missing", value: 1 }]}
                    layout="vertical"
                  >
                    <XAxis type="number" domain={[0, 1]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={20} fill={found ? CHART_COLORS[0] : CHART_COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {found && business && (
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 flex flex-col justify-between">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-10">Neural Metrics</h4>
                  {(() => {
                    const b = business as { rating?: number; user_ratings_total?: number };
                    const hasMetrics = typeof b.rating === "number" || typeof b.user_ratings_total === "number";
                    if (hasMetrics) {
                      const barData = [
                        ...(typeof b.rating === "number" ? [{ name: "Rating", value: b.rating, fill: CHART_COLORS[2] }] : []),
                        ...(typeof b.user_ratings_total === "number" ? [{ name: "Reviews", value: Math.min(b.user_ratings_total, 100), fill: CHART_COLORS[3] }] : []),
                      ];
                      return (
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 0, bottom: 0 }}>
                              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                              <YAxis hide />
                              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                              <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                                {barData.map((d, i) => (
                                  <Cell key={i} fill={d.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    }
                    return <div className="h-48 flex items-center justify-center text-slate-800/20 dark:text-gray-200/20 italic">No quantitative data streams.</div>;
                  })()}
                  <div className="flex gap-4 mt-8">
                    <div className="flex-1 bg-slate-50 dark:bg-[#111111] p-4 rounded-xl border border-slate-100 dark:border-[#222222] text-center">
                      <Star className="h-4 w-4 mx-auto mb-2 text-yellow-500" />
                      <p className="text-xl font-black font-sans">{(business as any).rating || "0.0"}</p>
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-[#111111] p-4 rounded-xl border border-slate-100 dark:border-[#222222] text-center">
                      <MessageSquare className="h-4 w-4 mx-auto mb-2 text-ai-blue" />
                      <p className="text-xl font-black font-sans">{(business as any).user_ratings_total || "0"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 bg-gradient-to-br from-white/5 to-transparent flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <Info className="h-5 w-5 text-ai-purple" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Raw Metadata</h4>
                  </div>
                  <pre className="flex-1 overflow-auto text-xs font-mono text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-[#111111] p-6 rounded-2xl border border-slate-100 dark:border-[#222222] custom-scrollbar">
                    {JSON.stringify(business, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {!found && (
              <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="h-10 w-10 text-red-500 animate-pulse" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-black font-sans uppercase tracking-widest mb-2">Zero Signals Detected</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">We could not locate this entity in the local search grid. Verify the business name and geographic coordinates.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

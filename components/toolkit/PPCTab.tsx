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
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#EC4899", "#D946EF", "#9333EA", "#7C3AED", "#A855F7"];

export default function PPCTab() {
  const [activeSubTab, setActiveSubTab] = useState<"ads" | "calculator">("ads");
  const [keyword, setKeyword] = useState("");
  const [adsResult, setAdsResult] = useState<
    { ad_type: string; title: string; price: string; source: string; product_link: string }[] | null
  >(null);
  const [cpc, setCpc] = useState(1);
  const [dailyBudget, setDailyBudget] = useState(50);
  const [conversionRate, setConversionRate] = useState(2);
  const [avgOrderValue, setAvgOrderValue] = useState(100);
  const [calcResult, setCalcResult] = useState<{
    estimated_clicks_per_day: number;
    estimated_conversions_per_day: number;
    estimated_revenue_per_day: number;
    estimated_profit_loss: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAds = async () => {
    if (!keyword.trim()) {
      toast("Enter a keyword.", "error");
      return;
    }
    setLoading(true);
    setAdsResult(null);
    try {
      const data = await api.ppc.getAds(keyword.trim());
      setAdsResult(data.ads);
      toast("Ads loaded.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to fetch ads.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runCalculator = async () => {
    setLoading(true);
    setCalcResult(null);
    try {
      const data = await api.ppc.calculator({
        cpc,
        daily_budget: dailyBudget,
        conversion_rate: conversionRate,
        avg_order_value: avgOrderValue,
      });
      setCalcResult(data);
      toast("Calculation done.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Calculation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab("ads")}
            className={cn(
              "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
              activeSubTab === "ads" ? "bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white shadow-xl shadow-purple-500/20" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Ad Intelligence
          </button>
          <button
            onClick={() => setActiveSubTab("calculator")}
            className={cn(
              "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
              activeSubTab === "calculator" ? "bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white shadow-xl shadow-purple-500/20" : "text-slate-500 hover:text-slate-800"
            )}
          >
            PPC ROI Predictor
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "ads" && (
          <motion.div
            key="ads"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Input theme="light"
                  label="Target Keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. buy vintage sneakers"
                  disabled={loading}
                />
              </div>
              <Button variant="dashboard" onClick={fetchAds} loading={loading} className="px-10 rounded-2xl">
                Scan Paid Landscape
              </Button>
            </div>

            {adsResult && (
              <div className="grid gap-10">
                {adsResult.length > 0 && (() => {
                  const bySource = adsResult.reduce<Record<string, number>>((acc, ad) => {
                    const s = ad.source || "Other";
                    acc[s] = (acc[s] || 0) + 1;
                    return acc;
                  }, {});
                  const pieData = Object.entries(bySource).map(([name], i) => ({
                    name,
                    value: bySource[name],
                    fill: CHART_COLORS[i % CHART_COLORS.length],
                  }));
                  return (
                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                      <h4 className="text-xl font-black font-sans uppercase tracking-widest mb-10 text-center">Competitive Distribution</h4>
                      <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              stroke="none"
                            >
                              {pieData.map((_, i) => (
                                <Cell key={i} fill={pieData[i].fill} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-200 font-sans uppercase tracking-widest text-[10px] text-slate-500">
                        <th className="p-6 text-left">Placement</th>
                        <th className="p-6 text-left">Ad Asset</th>
                        <th className="p-6 text-left">Price Point</th>
                        <th className="p-6 text-left">Network</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      {adsResult.map((ad, i) => (
                        <tr key={i} className="border-b border-slate-100 group hover:bg-white transition-colors">
                          <td className="p-6 font-black uppercase text-[10px] text-ai-blue">{ad.ad_type}</td>
                          <td className="p-6 font-bold">{ad.title}</td>
                          <td className="p-6 font-black tabular-nums">{ad.price}</td>
                          <td className="p-6"><span className="bg-white px-3 py-1 rounded-full text-xs border border-slate-100">{ad.source}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {adsResult.length === 0 && (
                    <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest italic">Zero Ad signals detected for this vector.</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSubTab === "calculator" && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 items-end border border-slate-200">
              <Input theme="light" label="Cost Per Click ($)" type="number" value={String(cpc)} onChange={(e) => setCpc(Number(e.target.value) || 0)} />
              <Input theme="light" label="Daily Budget ($)" type="number" value={String(dailyBudget)} onChange={(e) => setDailyBudget(Number(e.target.value) || 0)} />
              <Input theme="light" label="Conv. Rate (%)" type="number" value={String(conversionRate)} onChange={(e) => setConversionRate(Number(e.target.value) || 0)} />
              <Input theme="light" label="Avg Order ($)" type="number" value={String(avgOrderValue)} onChange={(e) => setAvgOrderValue(Number(e.target.value) || 0)} />
            </div>
            <div className="flex justify-center">
              <Button variant="dashboard" onClick={runCalculator} loading={loading} size="lg" className="px-12 rounded-2xl">
                Execute ROI Simulation
              </Button>
            </div>

            {calcResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10">
                  <h4 className="text-xl font-black font-sans uppercase tracking-widest mb-10 text-center">24-Hour Projected Performance</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Clicks", value: calcResult.estimated_clicks_per_day, fill: CHART_COLORS[1] },
                          { name: "Conv.", value: calcResult.estimated_conversions_per_day, fill: CHART_COLORS[2] },
                          { name: "Revenue", value: calcResult.estimated_revenue_per_day, fill: CHART_COLORS[3] },
                          { name: "Net P/L", value: calcResult.estimated_profit_loss, fill: calcResult.estimated_profit_loss >= 0 ? CHART_COLORS[3] : "#ef4444" },
                        ]}
                        margin={{ top: 20, bottom: 0 }}
                      >
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "12px", color: "#1e293b" }} />
                        <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-4">
                  {[
                    { label: "Daily Clicks", val: calcResult.estimated_clicks_per_day, color: "text-ai-blue" },
                    { label: "Daily Conv.", val: calcResult.estimated_conversions_per_day, color: "text-ai-purple" },
                    { label: "Est. Revenue", val: `$${calcResult.estimated_revenue_per_day.toFixed(0)}`, color: "text-emerald-600" },
                    { label: "Est. P/L", val: `$${calcResult.estimated_profit_loss.toFixed(0)}`, color: calcResult.estimated_profit_loss >= 0 ? "text-[#9333EA]" : "text-red-500" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8 text-center border border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
                      <p className={cn("text-3xl font-black font-sans tabular-nums", stat.color)}>{stat.val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


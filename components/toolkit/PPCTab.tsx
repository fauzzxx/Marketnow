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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">PPC & Advertising Toolkit</h2>
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("ads")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeSubTab === "ads" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Ad Research
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("calculator")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeSubTab === "calculator" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          PPC Cost Calculator
        </button>
      </div>

      {activeSubTab === "ads" && (
        <>
          <Input
            label="Keyword (e.g. buy iphone)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={fetchAds} loading={loading}>
            Find Paid Ads
          </Button>
          {adsResult && (
            <div className="space-y-4">
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
                  <div className="rounded-xl border border-border bg-card/80 p-4">
                    <h4 className="mb-2 text-sm font-medium text-card-foreground">Ads by source</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={64}
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {pieData.map((_, i) => (
                              <Cell key={i} fill={pieData[i].fill} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}
              <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="p-3 text-left font-medium">Type</th>
                      <th className="p-3 text-left font-medium">Title</th>
                      <th className="p-3 text-left font-medium">Price</th>
                      <th className="p-3 text-left font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsResult.map((ad, i) => (
                      <tr key={i} className="border-b border-border/50 transition-colors hover:bg-background/30">
                        <td className="p-3">{ad.ad_type}</td>
                        <td className="p-3">{ad.title}</td>
                        <td className="p-3">{ad.price}</td>
                        <td className="p-3">{ad.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {adsResult.length === 0 && (
                  <p className="p-4 text-muted-foreground">No product ads returned.</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeSubTab === "calculator" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Cost Per Click ($)"
              type="number"
              min={0.01}
              step={0.1}
              value={String(cpc)}
              onChange={(e) => setCpc(Number(e.target.value) || 0)}
              disabled={loading}
            />
            <Input
              label="Daily Budget ($)"
              type="number"
              min={1}
              value={String(dailyBudget)}
              onChange={(e) => setDailyBudget(Number(e.target.value) || 0)}
              disabled={loading}
            />
            <Input
              label="Conversion Rate (%)"
              type="number"
              min={0.1}
              step={0.1}
              value={String(conversionRate)}
              onChange={(e) => setConversionRate(Number(e.target.value) || 0)}
              disabled={loading}
            />
            <Input
              label="Average Order Value ($)"
              type="number"
              min={1}
              value={String(avgOrderValue)}
              onChange={(e) => setAvgOrderValue(Number(e.target.value) || 0)}
              disabled={loading}
            />
          </div>
          <Button onClick={runCalculator} loading={loading}>
            Calculate PPC Performance
          </Button>
          {calcResult && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h4 className="mb-3 text-sm font-medium text-card-foreground">Daily performance</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Clicks", value: calcResult.estimated_clicks_per_day, fill: CHART_COLORS[0] },
                        { name: "Conversions", value: calcResult.estimated_conversions_per_day, fill: CHART_COLORS[1] },
                        { name: "Revenue ($)", value: calcResult.estimated_revenue_per_day, fill: CHART_COLORS[2] },
                        { name: "Profit/Loss ($)", value: calcResult.estimated_profit_loss, fill: calcResult.estimated_profit_loss >= 0 ? CHART_COLORS[2] : CHART_COLORS[4] },
                      ]}
                      margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                      <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {[CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], calcResult.estimated_profit_loss >= 0 ? CHART_COLORS[2] : CHART_COLORS[4]].map((fill, i) => (
                          <Cell key={i} fill={fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                <p><span className="text-muted-foreground">Clicks/day:</span> {calcResult.estimated_clicks_per_day}</p>
                <p><span className="text-muted-foreground">Conversions/day:</span> {calcResult.estimated_conversions_per_day}</p>
                <p><span className="text-muted-foreground">Revenue/day ($):</span> {calcResult.estimated_revenue_per_day}</p>
                <p><span className="text-muted-foreground">Profit/Loss ($):</span> {calcResult.estimated_profit_loss}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

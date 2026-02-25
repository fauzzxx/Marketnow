"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Title</th>
                    <th className="p-3 text-left font-medium">Price</th>
                    <th className="p-3 text-left font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {adsResult.map((ad, i) => (
                    <tr key={i} className="border-b border-border/50">
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
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-border bg-card/80 p-4">
              <p><span className="text-muted-foreground">Clicks/day:</span> {calcResult.estimated_clicks_per_day}</p>
              <p><span className="text-muted-foreground">Conversions/day:</span> {calcResult.estimated_conversions_per_day}</p>
              <p><span className="text-muted-foreground">Revenue/day ($):</span> {calcResult.estimated_revenue_per_day}</p>
              <p><span className="text-muted-foreground">Profit/Loss ($):</span> {calcResult.estimated_profit_loss}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

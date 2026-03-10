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

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc"];

export default function AIVisibilityTab() {
  const [brandName, setBrandName] = useState("");
  const [keyword, setKeyword] = useState("");
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
      toast("Analysis complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const scoreBarData = result
    ? [
        { name: "Google", score: result.google_score, fill: CHART_COLORS[0] },
        { name: "AI", score: result.ai_score, fill: CHART_COLORS[1] },
        { name: "Final", score: result.final_visibility_score, fill: CHART_COLORS[2] },
      ]
    : [];

  const scorePieData = result
    ? [
        { name: "Google (60%)", value: result.google_score * 0.6, fill: CHART_COLORS[0] },
        { name: "AI (40%)", value: result.ai_score * 0.4, fill: CHART_COLORS[1] },
      ]
    : [];

  const positionBarData =
    result && result.brand_positions.length > 0
      ? result.brand_positions.map((pos, i) => ({
          name: `#${pos}`,
          position: pos,
          fill: CHART_COLORS[i % CHART_COLORS.length],
        }))
      : [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">AI Visibility Tracker</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Your brand"
          disabled={loading}
        />
        <Input
          label="Target Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. best CRM software"
          disabled={loading}
        />
      </div>
      <Button onClick={handleAnalyze} loading={loading}>
        Analyze Visibility
      </Button>

      {result && (
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <h3 className="font-semibold text-card-foreground">Google Search Analysis</h3>
          {result.brand_positions.length > 0 ? (
            <>
              <p className="text-green-600 dark:text-green-400 mb-2">
                Brand found in positions: {result.brand_positions.join(", ")}
              </p>
              {positionBarData.length > 0 && (
                <div className="h-32 w-full max-w-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={positionBarData} layout="vertical" margin={{ left: 24, right: 8 }}>
                      <XAxis type="number" domain={[0, 10]} tick={{ fill: "currentColor", fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={36} tick={{ fill: "currentColor", fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Bar dataKey="position" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-500">Brand not found in top Google results.</p>
          )}

          <h3 className="font-semibold text-card-foreground">Gemini AI Visibility</h3>
          <p className="text-sm text-muted-foreground">{result.ai_response_preview}</p>
          {result.ai_score === 100 ? (
            <p className="text-green-600 dark:text-green-400">Brand mentioned in AI response.</p>
          ) : (
            <p className="text-red-500">Brand not mentioned in AI response.</p>
          )}

          <h3 className="font-semibold text-card-foreground">Score breakdown</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBarData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scorePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={64}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value.toFixed(0)}`}
                  >
                    {scorePieData.map((_, i) => (
                      <Cell key={i} fill={scorePieData[i].fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Google Visibility</p>
              <p className="text-2xl font-bold text-card-foreground">{result.google_score}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">AI Visibility</p>
              <p className="text-2xl font-bold text-card-foreground">{result.ai_score}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Final Score</p>
              <p className="text-2xl font-bold text-primary">{result.final_visibility_score}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

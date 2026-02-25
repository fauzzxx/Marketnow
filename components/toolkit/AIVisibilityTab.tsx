"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
        <div className="space-y-6 rounded-2xl border border-border bg-card/80 p-6">
          <h3 className="font-semibold text-card-foreground">Google Search Analysis</h3>
          {result.brand_positions.length > 0 ? (
            <p className="text-green-600 dark:text-green-400">
              Brand found in positions: {result.brand_positions.join(", ")}
            </p>
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

          <h3 className="font-semibold text-card-foreground">Scores</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Google Visibility</p>
              <p className="text-2xl font-bold text-card-foreground">{result.google_score}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">AI Visibility</p>
              <p className="text-2xl font-bold text-card-foreground">{result.ai_score}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Final Score</p>
              <p className="text-2xl font-bold text-primary">{result.final_visibility_score}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

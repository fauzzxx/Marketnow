"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CompetitorTab() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ranking_keywords: { keyword: string; position: number }[];
    estimated_indexed_pages: number;
    top_ranking_content: { title: string; url: string }[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!domain.trim()) {
      toast("Enter competitor domain.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await api.competitor.analyze(domain.trim());
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
      <h2 className="text-xl font-semibold text-foreground">Competitor Analysis</h2>
      <Input
        label="Competitor Domain (e.g. example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="competitor.com"
        disabled={loading}
      />
      <Button onClick={handleAnalyze} loading={loading}>
        Analyze Competitor
      </Button>
      {result && (
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 font-semibold text-card-foreground">Keywords They Rank For</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left font-medium">Keyword</th>
                    <th className="p-3 text-left font-medium">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {result.ranking_keywords.map((r, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-3">{r.keyword}</td>
                      <td className="p-3">{r.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.ranking_keywords.length === 0 && (
                <p className="p-4 text-muted-foreground">No ranking keywords found.</p>
              )}
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-semibold text-card-foreground">Indexed Pages (Traffic Proxy)</h3>
            <p className="text-muted-foreground">Estimated indexed pages: {result.estimated_indexed_pages.toLocaleString()}</p>
          </section>
          <section>
            <h3 className="mb-2 font-semibold text-card-foreground">Top Ranking Content</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left font-medium">Title</th>
                    <th className="p-3 text-left font-medium">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {result.top_ranking_content.map((t, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-3">{t.title}</td>
                      <td className="p-3 break-all">{t.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

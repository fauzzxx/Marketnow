"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function KeywordResearchTab() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<
    { keyword: string; estimated_search_volume_proxy: number; difficulty: string }[] | null
  >(null);

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      toast("Enter a keyword.", "error");
      return;
    }
    setLoading(true);
    setKeywords(null);
    try {
      const data = await api.keywordResearch.analyze(keyword.trim());
      setKeywords(data.keywords);
      toast("Analysis complete.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Analysis failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!keywords || keywords.length === 0) return;
    const header = "Keyword,Estimated Search Volume (Proxy),Difficulty\n";
    const rows = keywords
      .map((k) => `"${k.keyword}",${k.estimated_search_volume_proxy},"${k.difficulty}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keyword_analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV downloaded.", "success");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Keyword Research Tool</h2>
      <Input
        label="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="e.g. digital marketing"
        disabled={loading}
      />
      <Button onClick={handleAnalyze} loading={loading}>
        Analyze Keyword
      </Button>
      {keywords && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={downloadCsv}>
              Download CSV
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-medium">Keyword</th>
                  <th className="p-3 text-left font-medium">Est. Search Volume (Proxy)</th>
                  <th className="p-3 text-left font-medium">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3">{k.keyword}</td>
                    <td className="p-3">{k.estimated_search_volume_proxy.toLocaleString()}</td>
                    <td className="p-3">{k.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

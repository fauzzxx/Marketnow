"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Content Marketing Tool</h2>
      <div className="flex gap-2 border-b border-border pb-2">
        {(["topic", "seo", "ai"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSubTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              subTab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t === "topic" && "Topic Research"}
            {t === "seo" && "SEO Writing Assistant"}
            {t === "ai" && "AI Content Suggestions"}
          </button>
        ))}
      </div>

      {subTab === "topic" && (
        <>
          <Input
            label="Topic Keyword"
            value={topicKeyword}
            onChange={(e) => setTopicKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={runTopicResearch} loading={loading}>
            Research Topic
          </Button>
          {topicResult && (
            <div className="space-y-4 rounded-xl border border-border bg-card/80 p-4">
              <div>
                <h4 className="font-medium text-card-foreground">Related Searches</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {topicResult.related_searches.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">People Also Ask</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {topicResult.people_also_ask.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {subTab === "seo" && (
        <>
          <Input
            label="Target Keyword"
            value={seoKeyword}
            onChange={(e) => setSeoKeyword(e.target.value)}
            disabled={loading}
          />
          <div>
            <label className="block text-sm font-medium mb-1.5">Article Content</label>
            <textarea
              className="w-full min-h-[120px] rounded-xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Paste your article..."
              disabled={loading}
            />
          </div>
          <Button onClick={runSeoAnalysis} loading={loading}>
            Analyze Content
          </Button>
          {seoResult && (
            <div className="grid gap-2 rounded-xl border border-border bg-card/80 p-4 sm:grid-cols-2">
              <p><span className="text-muted-foreground">Word count:</span> {seoResult.word_count}</p>
              <p><span className="text-muted-foreground">Keyword count:</span> {seoResult.keyword_count}</p>
              <p><span className="text-muted-foreground">Keyword density %:</span> {seoResult.keyword_density_percent}</p>
              <p><span className="text-muted-foreground">Readability score:</span> {seoResult.readability_score}</p>
            </div>
          )}
        </>
      )}

      {subTab === "ai" && (
        <>
          <Input
            label="Topic for AI Suggestions"
            value={aiKeyword}
            onChange={(e) => setAiKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={runAiSuggestions} loading={loading}>
            Generate AI Suggestions
          </Button>
          {aiResult && (
            <div className="rounded-xl border border-border bg-card/80 p-4">
              <pre className="whitespace-pre-wrap text-sm text-card-foreground">{aiResult}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

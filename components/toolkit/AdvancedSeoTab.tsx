"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdvancedSeoTab() {
  const [subTab, setSubTab] = useState<"audit" | "onpage" | "position" | "backlinks">("audit");
  const [auditUrl, setAuditUrl] = useState("");
  const [onpageUrl, setOnpageUrl] = useState("");
  const [onpageKeyword, setOnpageKeyword] = useState("");
  const [positionDomain, setPositionDomain] = useState("");
  const [positionKeyword, setPositionKeyword] = useState("");
  const [backlinkDomain, setBacklinkDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<{ title: string; meta_description: string } | null>(null);
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
      const data = await api.advanced.siteAudit(auditUrl.trim());
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

  const tabs: { id: typeof subTab; label: string }[] = [
    { id: "audit", label: "Site Audit" },
    { id: "onpage", label: "On-Page SEO" },
    { id: "position", label: "Position Tracking" },
    { id: "backlinks", label: "Backlink Analysis" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Advanced SEO Toolkit</h2>
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              subTab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "audit" && (
        <>
          <Input
            label="Website URL"
            value={auditUrl}
            onChange={(e) => setAuditUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
          />
          <Button onClick={runSiteAudit} loading={loading}>
            Run Site Audit
          </Button>
          {auditResult && (
            <div className="rounded-xl border border-border bg-card/80 p-4 space-y-2">
              <p><span className="text-muted-foreground">Title:</span> {auditResult.title}</p>
              <p><span className="text-muted-foreground">Meta description:</span> {auditResult.meta_description}</p>
            </div>
          )}
        </>
      )}

      {subTab === "onpage" && (
        <>
          <Input
            label="Page URL"
            value={onpageUrl}
            onChange={(e) => setOnpageUrl(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Target Keyword"
            value={onpageKeyword}
            onChange={(e) => setOnpageKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={runOnpage} loading={loading}>
            Analyze On-Page SEO
          </Button>
          {onpageResult !== null && (
            <p className="text-card-foreground">Keyword count: <strong>{onpageResult}</strong></p>
          )}
        </>
      )}

      {subTab === "position" && (
        <>
          <Input
            label="Your Domain (example.com)"
            value={positionDomain}
            onChange={(e) => setPositionDomain(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Keyword to Track"
            value={positionKeyword}
            onChange={(e) => setPositionKeyword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={runPosition} loading={loading}>
            Check Ranking
          </Button>
          {positionResult && (
            <p className="text-card-foreground">
              {positionResult.found ? (
                <>Position: <strong>{positionResult.position}</strong></>
              ) : (
                "Not found in top 100."
              )}
            </p>
          )}
        </>
      )}

      {subTab === "backlinks" && (
        <>
          <Input
            label="Domain for Backlink Analysis"
            value={backlinkDomain}
            onChange={(e) => setBacklinkDomain(e.target.value)}
            placeholder="example.com"
            disabled={loading}
          />
          <Button onClick={runBacklinks} loading={loading}>
            Analyze Backlinks
          </Button>
          {backlinkResult !== null && (
            <p className="text-card-foreground">Estimated mentions: <strong>{backlinkResult.toLocaleString()}</strong></p>
          )}
        </>
      )}
    </div>
  );
}

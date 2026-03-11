"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function YTScriptTab() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ idea: string; script: string } | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast("Enter a video idea or topic.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await api.youtube.script(idea.trim());
      setResult(data);
      toast("Script generated.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Generation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">YT Script Generator</h2>
      <p className="text-sm text-muted-foreground">
        Enter a video idea or topic to generate a viral-style YouTube script with title, hook, description and tags.
      </p>
      <Input
        label="Video idea or topic"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="e.g. How to grow your channel in 2024"
        disabled={loading}
      />
      <Button onClick={handleGenerate} loading={loading}>
        Generate script
      </Button>
      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h3 className="mb-2 text-sm font-semibold text-card-foreground">Idea</h3>
            <p className="text-muted-foreground">{result.idea}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h3 className="mb-2 text-sm font-semibold text-card-foreground">Generated script</h3>
            <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans">{result.script}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Youtube, Sparkles, Video, Play, FileText, Share2, Clipboard, Edit3, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";

const FALLBACK_SCRIPT_PREFIX = "Market Now Protocol: Analyzing";

export default function YTScriptTab() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ idea: string; script: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState("");

  const displayScript = result ? (isEditing ? editedScript : result.script) : "";

  useEffect(() => {
    if (result?.script) {
      setEditedScript(result.script);
    }
  }, [result?.script]);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast("Enter a video idea or topic.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await api.youtube.script(idea.trim());
      const script = data.script || "";
      if (script.trim().startsWith(FALLBACK_SCRIPT_PREFIX) || script.length < 200) {
        toast("Script generation failed. Check GROQ_API_KEY in backend .env and backend logs.", "error");
        setLoading(false);
        return;
      }
      setResult({ idea: data.idea || idea.trim(), script });
      setEditedScript(script);
      setIsEditing(false);
      toast("Manifested production-ready script.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Generation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAgain = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await api.youtube.script(idea.trim());
      const script = data.script || "";
      if (script.trim().startsWith(FALLBACK_SCRIPT_PREFIX) || script.length < 200) {
        toast("Script generation failed. Check GROQ_API_KEY in backend .env and backend logs.", "error");
        setLoading(false);
        return;
      }
      setResult({ idea: data.idea || idea.trim(), script });
      setEditedScript(script);
      setIsEditing(false);
      toast("Script regenerated.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Generation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Synced to local storage (Copied).", "success");
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <Youtube className="h-6 w-6 text-[#FF0000]" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scripting Paradigm</h4>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Video Core Identity</label>
          <div className="relative group">
            <Video className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-800/10 group-focus-within:text-[#9333EA] transition-colors" />
            <input
              className="w-full bg-slate-50/50 rounded-2xl border border-slate-200 pl-16 pr-6 py-6 text-slate-800 font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. 10 Secrets of High-Retention Storytelling"
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="dashboard" onClick={handleGenerate} loading={loading} className="px-12 rounded-2xl group">
            <Play className="h-4 w-4 mr-2 group-hover:fill-current transition-all" />
            Initialize Script Generation
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-8 lg:col-span-1 bg-white space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-ai-purple" />
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-ai-purple">Extracted Vector</h5>
                </div>
                <p className="text-xl font-black font-sans text-slate-800 leading-tight">{result.idea}</p>
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-800/20 uppercase">
                    <Share2 className="h-3 w-3" />
                    Distribution Ready
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full py-4 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50"
                    onClick={() => copyToClipboard(displayScript)}
                  >
                    <Clipboard className="h-3.5 w-3.5 mr-2" />
                    Copy Payload
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 lg:col-span-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <FileText className="h-48 w-48" />
                </div>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-ai-blue animate-pulse" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Complete Narrative Script</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="md"
                      className="rounded-xl min-w-[120px]"
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={loading}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? "Done editing" : "Edit yourself"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      className="rounded-xl min-w-[130px]"
                      onClick={handleGenerateAgain}
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate again
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isEditing ? (
                    <textarea
                      className="relative w-full min-h-[320px] font-sans text-sm text-slate-600 leading-relaxed rounded-2xl border border-slate-200 p-6 bg-slate-50/50 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 resize-y max-h-[500px]"
                      value={editedScript}
                      onChange={(e) => setEditedScript(e.target.value)}
                      disabled={loading}
                    />
                  ) : (
                    <pre className="relative font-sans text-sm text-slate-600 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                      {displayScript}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

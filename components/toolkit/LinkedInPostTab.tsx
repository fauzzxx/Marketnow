"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Linkedin, Sparkles, Edit3, Wand2, CheckCircle2, Send, Trash2, Mail, Key, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";

export default function LinkedInPostTab() {
  const [prompt, setPrompt] = useState("");
  const [post, setPost] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImprove, setShowImprove] = useState(false);
  const [improveFeedback, setImproveFeedback] = useState("");
  const [showPublish, setShowPublish] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast("Enter a topic or prompt for the post.", "error");
      return;
    }
    setLoading(true);
    setPost(null);
    setShowImprove(false);
    setShowPublish(false);
    setPublishStatus(null);
    try {
      const data = await api.linkedin.generate(prompt.trim());
      setPost(data.post);
      setOriginalPrompt(prompt.trim());
      toast("Post generated successfully.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Request failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAgain = async () => {
    const toUse = originalPrompt || prompt;
    if (!toUse.trim()) {
      toast("No previous prompt to regenerate.", "error");
      return;
    }
    setLoading(true);
    setPost(null);
    setShowImprove(false);
    setShowPublish(false);
    setPublishStatus(null);
    try {
      const data = await api.linkedin.generate(toUse.trim());
      setPost(data.post);
      setOriginalPrompt(toUse.trim());
      toast("Post regenerated.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Request failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDoneEditing = () => {
    setIsEditing(false);
  };

  const handleImproveSubmit = async () => {
    if (!improveFeedback.trim()) {
      toast("Enter feedback for improvement.", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await api.linkedin.improve(originalPrompt, improveFeedback.trim());
      setPost(data.post);
      setShowImprove(false);
      setImproveFeedback("");
      toast("Post refined by AI.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Request failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSubmit = async () => {
    if (!post?.trim() || !email.trim() || !password) {
      toast("Email, password and post are required to publish.", "error");
      return;
    }
    setLoading(true);
    setPublishStatus(null);
    try {
      const data = await api.linkedin.publish({ email: email.trim(), password, post: post.trim() });
      setPublishStatus(data.status);
      toast(data.status, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Publish failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const currentPost = post ?? "";
  const showOptions = post != null && !isEditing && !showImprove && !showPublish && !publishStatus;

  return (
    <div className="space-y-10">
      <AnimatePresence mode="wait">
        {post == null ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-[#9333EA]" />
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Post Manifestation</h4>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Core Concept / Intent</label>
              <textarea
                className="w-full min-h-[200px] bg-slate-50/50 rounded-2xl border border-slate-200 p-8 text-slate-800 font-sans leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all resize-none shadow-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Discuss the future of autonomous agents in industry..."
                disabled={loading}
              />
            </div>
            <div className="flex justify-center">
              <Button variant="dashboard" onClick={handleGenerate} loading={loading} size="lg" className="px-16 rounded-2xl group">
                <Linkedin className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Generate LinkedIn Transmission
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Linkedin className="h-32 w-32" />
              </div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#9333EA] animate-pulse" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Candidate Transmission</h4>
                </div>
                {isEditing && (
                  <Button variant="dashboard" onClick={handleDoneEditing} size="sm" className="rounded-xl">
                    Finalize Edits
                  </Button>
                )}
              </div>

              <div className="relative group">
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[300px] bg-slate-50/50 rounded-2xl border border-slate-200 p-8 text-slate-800 font-sans leading-relaxed focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all resize-none shadow-sm"
                    value={currentPost}
                    onChange={(e) => setPost(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                ) : (
                  <div className="p-8 rounded-2xl bg-white border border-slate-100 font-sans text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {currentPost}
                  </div>
                )}
              </div>
            </div>

            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-wrap justify-center gap-3"
              >
                <Button
                  variant="dashboard"
                  onClick={() => setShowPublish(true)}
                  disabled={loading}
                  size="md"
                  className="min-w-[180px] rounded-xl"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Approve & Broadcast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  size="md"
                  className="min-w-[160px] rounded-xl"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit yourself
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGenerateAgain}
                  disabled={loading}
                  size="md"
                  className="min-w-[160px] rounded-xl"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate again
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowImprove(true)}
                  disabled={loading}
                  size="md"
                  className="min-w-[160px] rounded-xl"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Augmentation
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="min-w-[44px] w-11 rounded-xl text-red-400 border-red-400/20 hover:bg-red-400/10"
                  onClick={() => {
                    setPost(null);
                    setOriginalPrompt("");
                    setPrompt("");
                  }}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            <AnimatePresence>
              {showImprove && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <Wand2 className="h-4 w-4 text-ai-purple" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-ai-purple">Feedback Loop</h4>
                  </div>
                  <textarea
                    className="w-full min-h-[100px] bg-slate-50/50 rounded-2xl border border-slate-200 p-6 text-slate-800 font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all resize-none shadow-sm"
                    value={improveFeedback}
                    onChange={(e) => setImproveFeedback(e.target.value)}
                    placeholder="e.g. Optimize for technical audience, add industry keywords..."
                    disabled={loading}
                  />
                  <div className="flex gap-4">
                    <Button variant="dashboard" onClick={handleImproveSubmit} loading={loading} className="px-8 rounded-xl">
                      Re-manifest
                    </Button>
                    <Button variant="secondary" onClick={() => setShowImprove(false)} disabled={loading} className="px-8 rounded-xl">
                      Abort
                    </Button>
                  </div>
                </motion.div>
              )}

              {showPublish && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-ai-blue" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-ai-blue/60">Target Network Integration</h4>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Network Identifier</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800/20 group-focus-within:text-ai-blue transition-colors" />
                        <input
                          type="email"
                          className="w-full bg-slate-50/50 rounded-2xl border border-slate-200 pl-12 pr-4 py-4 text-slate-800 font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@nexus.com"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Token</label>
                      <div className="relative group">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800/20 group-focus-within:text-ai-blue transition-colors" />
                        <input
                          type="password"
                          className="w-full bg-slate-50/50 rounded-2xl border border-slate-200 pl-12 pr-4 py-4 text-slate-800 font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="dashboard" onClick={handlePublishSubmit} loading={loading} className="px-10 rounded-xl">
                      Synchronize Signal
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPublish(false)} disabled={loading} className="px-10 rounded-xl">
                      Disconnect
                    </Button>
                  </div>
                </motion.div>
              )}

              {publishStatus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-10 border-emerald-500/20 bg-emerald-500/5 text-center"
                >
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                  <p className="text-xl font-black font-sans text-emerald-600 uppercase tracking-widest">{publishStatus}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

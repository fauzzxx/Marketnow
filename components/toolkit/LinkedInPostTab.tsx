"use client";

import { useState } from "react";
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
      toast("Post generated. Choose an option below.", "success");
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
      toast("Post improved. You can edit, improve again, or publish.", "success");
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Auto LinkedIn Post</h2>
      <p className="text-sm text-muted-foreground">
        Enter a topic to generate a professional LinkedIn post. Then approve and post, edit, or improve it.
      </p>

      {post == null && (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Topic or prompt</label>
            <textarea
              className="w-full min-h-[100px] rounded-xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Tips for remote team productivity"
              disabled={loading}
            />
          </div>
          <Button onClick={handleGenerate} loading={loading}>
            Generate post
          </Button>
        </>
      )}

      {post != null && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h3 className="mb-2 text-sm font-semibold text-card-foreground">Post</h3>
            {isEditing ? (
              <>
                <textarea
                  className="w-full min-h-[180px] rounded-xl border-2 border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={currentPost}
                  onChange={(e) => setPost(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={handleDoneEditing} className="mt-3" disabled={loading}>
                  Done editing
                </Button>
              </>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans">{currentPost}</pre>
            )}
          </div>

          {showOptions && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setShowPublish(true);
                  setShowImprove(false);
                }}
                disabled={loading}
              >
                Approve and post
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(true);
                  setShowImprove(false);
                  setShowPublish(false);
                }}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowImprove(true);
                  setShowPublish(false);
                  setIsEditing(false);
                }}
                disabled={loading}
              >
                Improve
              </Button>
            </div>
          )}

          {showImprove && (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <label className="block text-sm font-medium text-foreground">What would you like to improve?</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border-2 border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={improveFeedback}
                onChange={(e) => setImproveFeedback(e.target.value)}
                placeholder="e.g. Make it shorter, more formal, add a question at the end"
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button onClick={handleImproveSubmit} loading={loading}>
                  Get improved version
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowImprove(false);
                    setImproveFeedback("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {showPublish && (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
              <h3 className="text-sm font-semibold text-card-foreground">Publish to LinkedIn</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">LinkedIn email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">LinkedIn password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePublishSubmit} loading={loading}>
                  Publish to LinkedIn
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPublish(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {publishStatus && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">{publishStatus}</p>
            </div>
          )}

          {(showOptions || isEditing || showImprove || showPublish) && !publishStatus && (
            <Button
              variant="secondary"
              onClick={() => {
                setPost(null);
                setOriginalPrompt("");
                setIsEditing(false);
                setShowImprove(false);
                setImproveFeedback("");
                setShowPublish(false);
                setPublishStatus(null);
              }}
              disabled={loading}
            >
              Start over (new post)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

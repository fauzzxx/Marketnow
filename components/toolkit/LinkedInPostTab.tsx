"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Linkedin, Sparkles, X, User, Lock, Eye, EyeOff,
  Image as ImageIcon, Calendar, LayoutTemplate, Plus, Clock,
  Smile, ChevronDown, CheckCircle2, Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { trackActivity } from "@/lib/activityTracker";
import { toast } from "@/utils/toast";

export default function LinkedInPostTab({ initialValues }: { initialValues?: Record<string, string> }) {
  // Auth state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Post state
  const [postContent, setPostContent] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.prompt) setPostContent(initialValues.prompt);
    }
  }, [initialValues]);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      toast("Please enter your username and password.", "error");
      return;
    }
    setIsLoggedIn(true);
    toast("Credentials saved. You can now compose and post.", "success");
  };

  const handleImageSelect = useCallback((file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast("Please select a valid image file (JPG, PNG, GIF, WEBP).", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("Image must be under 10MB.", "error");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRewriteWithAI = async () => {
    if (!postContent.trim()) {
      toast("Write something first, then use AI to rewrite.", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await api.linkedin.generate(postContent.trim());
      setPostContent(data.post);
      trackActivity("linkedin-post", postContent.trim(), undefined, { prompt: postContent.trim() });
      toast("Post rewritten by AI.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "AI rewrite failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!postContent.trim()) {
      toast("Write something to post.", "error");
      return;
    }
    if (!username.trim() || !password.trim()) {
      toast("Please log in first with your LinkedIn credentials.", "error");
      return;
    }
    setLoading(true);
    setPublishStatus(null);
    try {
      const data = await api.linkedin.publish({
        email: username.trim(),
        password,
        post: postContent.trim(),
        image: imageFile || undefined,
      });
      setPublishStatus(data.status);
      trackActivity("linkedin-post", postContent.trim(), undefined, { prompt: postContent.trim() });
      toast(data.status, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Publish failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPostContent("");
    setPublishStatus(null);
    removeImage();
  };

  const displayName = username.split("@")[0] || "User";

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* LEFT SIDEBAR */}
      <div className="w-[260px] shrink-0 flex flex-col bg-white dark:bg-[#141414] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-[#E91E8C] to-[#9333EA]" />
            <span className="font-bold text-base text-slate-800 dark:text-white">Linkedin</span>
          </div>

          {/* Username Input */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or Email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]/50 transition-all"
                disabled={isLoggedIn}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]/50 transition-all"
                disabled={isLoggedIn}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Login / Logout Button */}
          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E91E8C] to-[#C026D3] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20"
            >
              Login Now
            </button>
          ) : (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                toast("Logged out.", "success");
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-slate-100 dark:border-[#2a2a2a]" />

        {/* Social Links */}
        <div className="p-5 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Connect</span>
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            {/* Instagram */}
            <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-200 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </button>
            {/* Twitter/X */}
            <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            {/* LinkedIn */}
            <button className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-blue-500 transition-all">
              <Linkedin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Profile */}
        {isLoggedIn && (
          <div className="p-5 border-t border-slate-100 dark:border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E91E8C] to-[#9333EA] flex items-center justify-center text-white font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{displayName}</p>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] text-slate-400">Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E91E8C] to-[#9333EA]">{displayName}</span>
          </h2>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {publishStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex-1">{publishStatus}</p>
              <button onClick={handleReset} className="text-emerald-500 hover:text-emerald-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Composer Card */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] overflow-hidden">
          {/* Profile Row */}
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E91E8C] to-[#9333EA] flex items-center justify-center text-white font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{displayName}</p>
                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <span>Post to Anyone</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-[#1a1a1a] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Text Area */}
          <div className="px-5 pt-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full min-h-[120px] bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm leading-relaxed focus:outline-none resize-none"
              disabled={loading}
            />
          </div>

          {/* Image Upload Zone */}
          <div className="px-5 pb-4">
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
                <img src={imagePreview} alt="Upload preview" className="w-full max-h-[300px] object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "border-2 border-dashed rounded-xl py-10 flex flex-col items-center justify-center cursor-pointer transition-all",
                  isDragging
                    ? "border-[#E91E8C] bg-pink-50 dark:bg-pink-900/10"
                    : "border-slate-200 dark:border-[#2a2a2a] hover:border-[#E91E8C]/50 hover:bg-slate-50 dark:hover:bg-[#1a1a1a]"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Add Photos/videos</p>
                <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
              className="hidden"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="px-5 pb-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">LinkedIn Page Url :</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="#LinkedIn Url"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]/50 transition-all"
              disabled={loading}
            />
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-slate-100 dark:border-[#2a2a2a]" />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-1">
              {/* Rewrite with AI */}
              <button
                onClick={handleRewriteWithAI}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-[#E91E8C]/50 hover:text-[#E91E8C] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#E91E8C]" />
                )}
                <span>Rewrite with AI</span>
              </button>

              {/* Emoji */}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-[#1a1a1a] transition-all">
                <Smile className="w-5 h-5" />
              </button>
              {/* Calendar */}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-[#1a1a1a] transition-all">
                <Calendar className="w-5 h-5" />
              </button>
              {/* Template */}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-[#1a1a1a] transition-all">
                <LayoutTemplate className="w-5 h-5" />
              </button>
              {/* More */}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-[#1a1a1a] transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Clock */}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-[#1a1a1a] transition-all">
                <Clock className="w-5 h-5" />
              </button>
              {/* Post Button */}
              <button
                onClick={handlePost}
                disabled={loading || !postContent.trim()}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-semibold transition-all",
                  postContent.trim() && !loading
                    ? "bg-gradient-to-r from-[#E91E8C] to-[#C026D3] text-white hover:opacity-90 shadow-lg shadow-pink-500/20"
                    : "bg-slate-100 dark:bg-[#1a1a1a] text-slate-400 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </span>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

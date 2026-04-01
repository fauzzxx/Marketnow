"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, open]);

  // Initial greeting
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text: "Hello! I'm your AI SEO Copilot. I can help you with SEO analysis, GEO optimization, and provide recommendations. How can I assist you today?"
        }
      ]);
    }
  }, [open, messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const data = await api.chatbot.send(text);
      const reply = typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Request failed.";
      toast(errMsg, "error");
      setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mb-4 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] flex flex-col rounded-[22px] bg-white dark:bg-[#141414] shadow-2xl border border-slate-100 dark:border-[#222222] overflow-hidden transform-gpu origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#EC4899] to-[#9333EA] px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 text-white">
                <Bot className="h-5 w-5" />
                <h3 className="font-bold text-lg leading-none tracking-wide mt-0.5">AI SEO Copilot</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 pb-2 border-b border-slate-100 dark:border-[#222222] bg-white dark:bg-[#141414] custom-scrollbar flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex mb-5 last:mb-0", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-[#AC46D8] flex items-center justify-center shrink-0 mr-3 shadow-[0_2px_10px_rgb(172,70,216,0.2)]">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "px-4 py-3 text-[14.5px] leading-relaxed relative max-w-[85%]",
                      msg.role === "user"
                        ? "bg-[#F3F4F6] dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-200 rounded-2xl rounded-tr-[4px] shadow-sm ml-auto"
                        : "bg-white dark:bg-[#141414] border border-pink-100 dark:border-pink-900/30 rounded-2xl rounded-tl-[4px] shadow-sm text-slate-700 dark:text-gray-300"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.role === "assistant" && i === 0 && (
                      <p className="text-[11px] text-slate-400 mt-2 block">01:31 am</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start justify-start mb-5">
                  <div className="h-8 w-8 rounded-full bg-[#AC46D8] flex items-center justify-center shrink-0 mr-3 shadow-sm">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#141414] border border-pink-100 dark:border-pink-900/30 rounded-2xl rounded-tl-[4px] px-4 py-3 shadow-sm flex items-center gap-[5px] h-[46px]">
                    <span className="h-1.5 w-1.5 bg-[#AC46D8]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-[#AC46D8]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-[#AC46D8]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* InputArea */}
            <div className="p-4 bg-white dark:bg-[#141414] shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about SEO..."
                  className="flex-1 border border-pink-200 dark:border-pink-900/30 rounded-[12px] py-[13px] px-4 text-sm text-slate-700 dark:text-gray-300 placeholder:text-slate-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-300 resize-none h-[48px] custom-scrollbar overflow-hidden leading-tight bg-white dark:bg-[#141414]"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="h-[48px] w-[54px] shrink-0 flex items-center justify-center rounded-[12px] bg-[#D692E6] text-white shadow-sm hover:bg-[#C97FE0] disabled:opacity-50 transition-colors"
                >
                  <Send className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-[12.5px] text-center text-slate-500 dark:text-gray-400 font-medium">Try: &quot;Show SEO summary&quot; or &quot;What are priority fixes?&quot;</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="h-[60px] w-[60px] rounded-full bg-gradient-to-br from-[#EC4899] to-[#9333EA] text-white shadow-[0_8px_30px_rgb(236,72,153,0.3)] flex items-center justify-center transition-all z-50 border border-white/20"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}>
              <Sparkles className="h-[28px] w-[28px]" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

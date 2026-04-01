"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Users,
  Eye,
  Lightbulb,
  FileText,
  Send,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Bot,
  Clock,
  MessageSquare,
  Trash2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

interface RecentConversation {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

/* ─── Constants ──────────────────────────────────────────── */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";

const WELCOME_MESSAGE =
  "Hello! I'm your Market Now AI Copilot. I can help you with SEO audits, keyword research, competitor analysis, content creation, LinkedIn posts, and more. What would you like to explore?";

const QUICK_ACTIONS: {
  label: string;
  icon: typeof Sparkles;
  prompt: string | null;
  gradient: boolean;
}[] = [
  { label: "Start Chat", icon: Sparkles, prompt: null, gradient: true },
  { label: "SEO Audit", icon: Search, prompt: "Run a site audit for ", gradient: false },
  { label: "Keyword Research", icon: FileText, prompt: "Find keywords for ", gradient: false },
  { label: "Competitor Analysis", icon: Users, prompt: "Compare competitors ", gradient: false },
  { label: "AI Visibility", icon: Eye, prompt: "Check AI visibility for ", gradient: false },
  { label: "Content Ideas", icon: Lightbulb, prompt: "Suggest content ideas for ", gradient: false },
];

/* ─── Helpers ────────────────────────────────────────────── */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "\u2026" : s;
}

/* ─── Component ──────────────────────────────────────────── */
export default function AICopilotClient() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "ai", content: WELCOME_MESSAGE, timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("marketnow_copilot_conversations");
      if (raw) setRecentConversations(JSON.parse(raw));
    } catch { /* */ }
  }, []);

  const persistConvos = useCallback((list: RecentConversation[]) => {
    setRecentConversations(list);
    try { localStorage.setItem("marketnow_copilot_conversations", JSON.stringify(list.slice(0, 20))); } catch { /* */ }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const saveConvo = useCallback(
    (msgs: Message[]) => {
      const userMsgs = msgs.filter((m) => m.role === "user");
      if (!userMsgs.length) return;
      const id = activeConvoId || genId();
      const title = truncate(userMsgs[0].content, 50);
      const next = [
        { id, title, timestamp: Date.now(), messages: msgs },
        ...recentConversations.filter((c) => c.id !== id),
      ].slice(0, 20);
      setActiveConvoId(id);
      persistConvos(next);
    },
    [activeConvoId, recentConversations, persistConvos],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;
      setInput("");
      const userMsg: Message = { id: genId(), role: "user", content: trimmed, timestamp: Date.now() };
      const next = [...messages, userMsg];
      setMessages(next);
      setIsTyping(true);
      try {
        const res = await fetch(`${API_BASE}/api/chatbot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });
        const data = await res.json();
        const content = data.error
          ? `Sorry, I encountered an error: ${data.error}`
          : data.reply || "I received your message but got an empty response. Please try again.";
        const aiMsg: Message = { id: genId(), role: "ai", content, timestamp: Date.now() };
        const all = [...next, aiMsg];
        setMessages(all);
        saveConvo(all);
      } catch {
        const errMsg: Message = { id: genId(), role: "ai", content: "Unable to reach the server. Please check that the backend is running.", timestamp: Date.now() };
        const all = [...next, errMsg];
        setMessages(all);
        saveConvo(all);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages, saveConvo],
  );

  const handleQuickAction = (prompt: string | null) => {
    setShowChat(true);
    if (prompt) {
      setInput(prompt);
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  };

  const loadConvo = (c: RecentConversation) => {
    setMessages(c.messages);
    setActiveConvoId(c.id);
    setShowChat(true);
  };

  const newConvo = () => {
    setMessages([{ id: "welcome", role: "ai", content: WELCOME_MESSAGE, timestamp: Date.now() }]);
    setActiveConvoId(null);
    setInput("");
  };

  const deleteConvo = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    persistConvos(recentConversations.filter((c) => c.id !== id));
    if (activeConvoId === id) newConvo();
  };

  const copyText = (t: string) => { navigator.clipboard.writeText(t); };

  const regenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const idx = messages.findLastIndex((m) => m.role === "ai");
    if (idx > 0) {
      const trimmed = messages.slice(0, idx);
      setMessages(trimmed);
      setTimeout(() => sendMessage(lastUser.content), 80);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ─── All critical styles are inline to override any parent/global CSS ───
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        flexDirection: "row",
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ========== LEFT PANEL ========== */}
      <div
        style={{
          width: showChat ? undefined : "100%",
          minWidth: 380,
          maxWidth: 420,
          display: showChat ? undefined : "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          borderRight: "1px solid #2a2a2a",
          padding: 24,
          overflowY: "auto",
          ...(showChat ? {} : {}),
        }}
        className={showChat ? "hidden md:!flex md:!flex-col" : "!flex !flex-col"}
      >
        {/* Back link */}
        <Link
          href="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#9ca3af", textDecoration: "none", marginBottom: 24 }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Dashboard
        </Link>

        {/* Title */}
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0" }}>
          Your AI{" "}
          <span
            style={{
              background: "linear-gradient(to right, #ec4899, #9333ea)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Copilot
          </span>
        </h1>
        <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 24px 0" }}>Market Now Intelligence Assistant</p>

        {/* Quick-action grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={() => handleQuickAction(a.prompt)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 16,
                  borderRadius: 16,
                  border: a.gradient ? "1px solid rgba(236,72,153,0.3)" : "1px solid #2a2a2a",
                  background: a.gradient
                    ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(147,51,234,0.15))"
                    : "#141414",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (a.gradient) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(147,51,234,0.25))";
                  } else {
                    e.currentTarget.style.background = "#1a1a1a";
                    e.currentTarget.style.borderColor = "#3a3a3a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (a.gradient) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(147,51,234,0.15))";
                  } else {
                    e.currentTarget.style.background = "#141414";
                    e.currentTarget.style.borderColor = "#2a2a2a";
                  }
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: a.gradient ? "linear-gradient(to right, #ec4899, #9333ea)" : "#1a1a1a",
                  }}
                >
                  <Icon style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{a.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recent conversations */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
              Recent Conversations
            </h3>
            {activeConvoId && (
              <button
                onClick={newConvo}
                style={{ fontSize: 12, color: "#ec4899", background: "none", border: "none", cursor: "pointer" }}
              >
                + New Chat
              </button>
            )}
          </div>

          {recentConversations.length === 0 ? (
            <p style={{ fontSize: 14, color: "#555" }}>No conversations yet. Start chatting!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recentConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadConvo(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: activeConvoId === c.id ? "1px solid #2a2a2a" : "1px solid transparent",
                    background: activeConvoId === c.id ? "#141414" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeConvoId !== c.id) e.currentTarget.style.background = "#141414";
                  }}
                  onMouseLeave={(e) => {
                    if (activeConvoId !== c.id) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <MessageSquare style={{ width: 16, height: 16, color: "#9ca3af", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</p>
                    <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock style={{ width: 12, height: 12 }} />
                      {formatTime(c.timestamp)}
                    </p>
                  </div>
                  <span
                    onClick={(e) => deleteConvo(e, c.id)}
                    style={{ color: "#555", cursor: "pointer", padding: 4, opacity: 0.5 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.opacity = "0.5"; }}
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========== RIGHT PANEL ========== */}
      <div
        style={{
          flex: 1,
          display: showChat ? "flex" : undefined,
          flexDirection: "column",
          background: "#0a0a0a",
          minWidth: 0,
        }}
        className={showChat ? "!flex !flex-col" : "hidden md:!flex md:!flex-col"}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #2a2a2a",
            flexShrink: 0,
          }}
        >
          {/* Mobile back */}
          <button
            onClick={() => setShowChat(false)}
            className="md:!hidden"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#141414",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16, color: "#fff" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, marginLeft: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: 0 }}>Market Now AI Copilot</h2>
            <span style={{ fontSize: 12, color: "#555" }}>Always ready to help</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {activeConvoId && (
              <button
                onClick={newConvo}
                style={{
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                New Chat
              </button>
            )}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "linear-gradient(to right, #ec4899, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "ai" ? (
                /* AI message */
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: "linear-gradient(to right, #ec4899, #9333ea)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <div style={{ maxWidth: 640 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        margin: "0 0 4px 0",
                        background: "linear-gradient(to right, #ec4899, #9333ea)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      AI Copilot
                    </p>
                    <div
                      style={{
                        background: "#141414",
                        border: "1px solid #2a2a2a",
                        borderRadius: "16px 16px 16px 4px",
                        padding: "12px 16px",
                      }}
                    >
                      <p style={{ fontSize: 14, color: "#e5e5e5", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </p>
                    </div>
                    {msg.id !== "welcome" && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {[
                          { icon: ThumbsUp, action: () => {} },
                          { icon: ThumbsDown, action: () => {} },
                          { icon: Copy, action: () => copyText(msg.content) },
                          { icon: RotateCcw, action: regenerate },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            onClick={btn.action}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: "#141414",
                              border: "1px solid #2a2a2a",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#555",
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "#1a1a1a"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.background = "#141414"; }}
                          >
                            <btn.icon style={{ width: 14, height: 14 }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* User message */
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <div style={{ maxWidth: 640 }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px 0", textAlign: "right" }}>You</p>
                    <div
                      style={{
                        background: "linear-gradient(to right, rgba(236,72,153,0.15), rgba(147,51,234,0.15))",
                        border: "1px solid rgba(236,72,153,0.3)",
                        borderRadius: "16px 4px 16px 16px",
                        padding: "12px 16px",
                      }}
                    >
                      <p style={{ fontSize: 14, color: "#e5e5e5", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: "#2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    U
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: "linear-gradient(to right, #ec4899, #9333ea)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <div
                style={{
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  borderRadius: 16,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span className="animate-bounce" style={{ width: 8, height: 8, borderRadius: 4, background: "#ec4899", display: "inline-block", animationDelay: "0ms" }} />
                <span className="animate-bounce" style={{ width: 8, height: 8, borderRadius: 4, background: "#a855f7", display: "inline-block", animationDelay: "150ms" }} />
                <span className="animate-bounce" style={{ width: 8, height: 8, borderRadius: 4, background: "#ec4899", display: "inline-block", animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #2a2a2a", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 16,
              padding: "12px 16px",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about SEO, marketing, competitors..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#ffffff",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: !input.trim() || isTyping ? "#333" : "linear-gradient(to right, #ec4899, #9333ea)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: !input.trim() || isTyping ? "not-allowed" : "pointer",
                flexShrink: 0,
                opacity: !input.trim() || isTyping ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <Send style={{ width: 16, height: 16, color: "#fff" }} />
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#444", textAlign: "center", marginTop: 8 }}>
            AI Copilot can make mistakes. Verify important information.
          </p>
        </div>
      </div>

      {/* Inline style tag for the few things that need CSS (responsive hide/show, animation) */}
      <style>{`
        @media (max-width: 767px) {
          .hidden { display: none !important; }
        }
        @media (min-width: 768px) {
          .md\\:!hidden { display: none !important; }
          .md\\:!flex { display: flex !important; }
          .md\\:!flex-col { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mail, Send, FileSpreadsheet, Key, Type, Database, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { trackActivity } from "@/lib/activityTracker";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";

type ResultItem = { email: string; status: string; error?: string };

export default function BulkEmailsTab({ initialValues }: { initialValues?: Record<string, string> }) {
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    if (initialValues) {
      if (initialValues.senderEmail) setSenderEmail(initialValues.senderEmail);
      if (initialValues.subject) setSubject(initialValues.subject);
    }
  }, [initialValues]);
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [column, setColumn] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    total_emails: number;
    results: ResultItem[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!senderEmail.trim() || !password || !subject.trim() || !body.trim()) {
      toast("Sender email, password, subject and body are required.", "error");
      return;
    }
    if (!file) {
      toast("Please upload an Excel file with recipient emails.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await api.email.sendBulk({
        email: senderEmail.trim(),
        password,
        subject: subject.trim(),
        body: body.trim(),
        column,
        file,
      });
      const list = Array.isArray(data?.results) ? data.results : [];
      const total = data?.total_emails ?? 0;
      setResult({ total_emails: total, results: list });
      const sent = list.filter((r) => r.status === "sent").length;
      const failed = list.filter((r) => r.status === "failed").length;
      if (total > 0 && list.length === 0) {
        toast("No send results returned. Restart the backend and try again. If using Gmail, use an App Password (not your normal password).", "error");
      } else {
        trackActivity("bulk-emails", `${total} emails - ${subject.trim()}`, undefined, { senderEmail: senderEmail.trim(), subject: subject.trim() });
        toast(`Sent ${sent} of ${total} emails.${failed > 0 ? ` ${failed} failed.` : ""}`, sent === total ? "success" : "error");
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Send failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const results: ResultItem[] = Array.isArray(result?.results) ? result.results : [];
  const sentCount = results.filter((r) => r.status === "sent").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10 space-y-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">Relay Identity (Gmail)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800/20 dark:text-gray-200/20 group-focus-within:text-[#9333EA] transition-colors" />
              <input
                type="email"
                className="w-full bg-slate-50/50 dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] pl-12 pr-4 py-4 text-slate-800 dark:text-gray-200 font-sans placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="operator@nexus.com"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">Access Cipher (App Password)</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800/20 dark:text-gray-200/20 group-focus-within:text-ai-blue transition-colors" />
              <input
                type="password"
                className="w-full bg-slate-50/50 dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] pl-12 pr-4 py-4 text-slate-800 dark:text-gray-200 font-sans placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">Broadcast Header</label>
            <div className="relative group">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800/20 dark:text-gray-200/20 group-focus-within:text-ai-purple transition-colors" />
              <input
                type="text"
                className="w-full bg-slate-50/50 dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] pl-12 pr-4 py-4 text-slate-800 dark:text-gray-200 font-sans placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Directive Alpha: Market Expansion"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">Payload Content</label>
            <textarea
              className="w-full min-h-[200px] bg-slate-50/50 dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] p-6 text-slate-800 dark:text-gray-200 font-sans placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all resize-none leading-relaxed shadow-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your transmission payload..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-end">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">Entity Matrix (Excel)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "bg-white dark:bg-[#141414] rounded-2xl border border-dashed border-slate-300 dark:border-[#333333] p-8 text-center cursor-pointer hover:border-[#9333EA]/50 hover:bg-purple-50/30 transition-all group",
                file && "border-[#9333EA]/50 bg-[#9333EA]/5"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={loading}
              />
              <FileSpreadsheet className={cn("h-8 w-8 mx-auto mb-3 text-slate-800/20 dark:text-gray-200/20 group-hover:text-[#9333EA] transition-colors", file && "text-[#9333EA]")} />
              <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                {file ? file.name : "Target Spreadsheet"}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-800/20 dark:text-gray-200/20 mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB Loaded` : "Drop .xlsx / .xls"}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 ml-1">Data Column Index</label>
              <div className="relative group">
                <Database className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800/20 dark:text-gray-200/20 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="number"
                  min={0}
                  className="w-full bg-slate-50/50 dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] pl-12 pr-4 py-4 text-slate-800 dark:text-gray-200 font-sans placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#9333EA]/30 focus:ring-4 focus:ring-[#9333EA]/10 transition-all shadow-sm"
                  value={column}
                  onChange={(e) => setColumn(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  disabled={loading}
                />
              </div>
            </div>
            <Button variant="dashboard" onClick={handleSubmit} loading={loading} className="w-full py-5 rounded-2xl group text-sm">
              <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Initialize Global Broadcast
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: "Total Entities", val: result.total_emails, color: "text-slate-500", icon: Database },
                { label: "Successful Relays", val: sentCount, color: "text-emerald-600", icon: CheckCircle2 },
                { label: "Failed Transmissions", val: failedCount, color: "text-red-500", icon: XCircle },
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-8 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className={cn("text-3xl font-black font-sans tabular-nums", stat.color)}>{stat.val}</p>
                  </div>
                  <stat.icon className={cn("h-8 w-8 opacity-10", stat.color)} />
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-8">Detailed Signal Log</h3>
              <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#141414] border border-slate-100 dark:border-[#222222] group hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center gap-4">
                      {r.status === "sent" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-bold text-slate-600 dark:text-gray-400">{r.email}</span>
                    </div>
                    {r.error && (
                      <span className="text-[10px] font-mono text-red-400/60 uppercase" title={r.error}>
                        {r.error.split(":").pop()?.trim() || "Encryption Error"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

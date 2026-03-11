"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";

type ResultItem = { email: string; status: string; error?: string };

export default function BulkEmailsTab() {
  const [senderEmail, setSenderEmail] = useState("");
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
      setResult(data);
      toast(`Sent ${data.results.filter((r) => r.status === "sent").length} of ${data.total_emails} emails.`, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Send failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const sentCount = result?.results.filter((r) => r.status === "sent").length ?? 0;
  const failedCount = result?.results.filter((r) => r.status === "failed").length ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Bulk Emails</h2>
      <p className="text-sm text-muted-foreground">
        Send bulk emails using an Excel file. Use a Gmail account; the Excel file should have recipient emails in one column (set the column index below, 0-based).
      </p>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Sender email (Gmail)</label>
            <input
              type="email"
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="your@gmail.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">App password</label>
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
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Body</label>
          <textarea
            className="w-full min-h-[120px] rounded-xl border-2 border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email body (plain text)"
            disabled={loading}
          />
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Excel file (emails in column)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border file:border-border file:bg-muted file:px-4 file:py-2 file:text-foreground"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={loading}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-foreground mb-1.5">Column index</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={column}
              onChange={(e) => setColumn(Math.max(0, parseInt(e.target.value, 10) || 0))}
              disabled={loading}
            />
          </div>
        </div>
        <Button onClick={handleSubmit} loading={loading}>
          Send bulk emails
        </Button>
      </div>

      {result && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <h3 className="mb-2 text-sm font-semibold text-card-foreground">Results</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {result.total_emails} total · {sentCount} sent · {failedCount} failed
          </p>
          <ul className="max-h-64 overflow-y-auto space-y-1 text-sm">
            {result.results.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className={r.status === "sent" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {r.status === "sent" ? "✓" : "✗"}
                </span>
                <span className="text-card-foreground truncate">{r.email}</span>
                {r.error && <span className="text-muted-foreground truncate" title={r.error}>{r.error}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

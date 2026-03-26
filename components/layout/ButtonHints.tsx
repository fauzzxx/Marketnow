"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/utils/toast";
import { describeButton } from "@/utils/buttonDescriptions";

export default function ButtonHints() {
  const lastShownRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;

      // Don't generate hints when interacting with toast UI itself
      if (target.closest("[data-toast-root='true']")) return;

      const btn = target.closest("button") as HTMLButtonElement | null;
      if (!btn) return;

      // Avoid spamming when disabled or when clicking icon-only buttons with no label
      if (btn.disabled) return;

      const txt = (btn.innerText || btn.textContent || "").trim();
      const msg = describeButton(txt);
      if (!msg) return;

      // Basic spam guard (same button text within 1.2s)
      const key = txt || msg;
      const now = Date.now();
      const last = lastShownRef.current.get(key) ?? 0;
      if (now - last < 1200) return;
      lastShownRef.current.set(key, now);

      // Show a small info toast; do not block existing click behavior.
      toast(msg, "info", 2500);
    };

    // Use boolean capture so removeEventListener matches reliably
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}


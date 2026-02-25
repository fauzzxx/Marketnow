"use client";

import { useEffect, useState } from "react";
import {
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  type Theme,
} from "@/utils/theme";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const handleChange = (value: Theme) => {
    setTheme(value);
    setStoredTheme(value);
  };

  if (!mounted) {
    return (
      <div className="h-10 w-28 rounded-xl bg-muted animate-pulse" aria-hidden />
    );
  }

  return (
    <div className="flex rounded-xl bg-muted p-1 gap-0.5" role="group" aria-label="Theme">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            theme === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

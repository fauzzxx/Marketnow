"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  type Theme,
} from "@/utils/theme";

const options: { value: Theme; icon: any; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
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
      <div className="h-10 w-32 rounded-xl bg-white/5 animate-shimmer" />
    );
  }

  return (
    <div className="flex h-10 items-center justify-center rounded-xl bg-white/5 p-1 border border-white/10 relative" group-aria-label="Theme">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleChange(opt.value)}
            className={`relative flex items-center justify-center h-8 w-10 sm:w-12 rounded-lg transition-all duration-300 z-10 ${isActive ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            title={opt.label}
          >
            <Icon className="h-4 w-4" />

            {isActive && (
              <motion.div
                layoutId="theme-pill"
                className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/20 z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}


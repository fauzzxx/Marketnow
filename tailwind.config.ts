import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        satoshi: ["Satoshi", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        background: "#0B0F1A",
        foreground: "#F8FAFC",
        cosmic: {
          dark: "#0B0F1A",
          medium: "#111827",
          light: "#1A1040",
        },
        // Brand primaries
        primary: "#7C0181",
        success: "#00BC8E",
        ai: {
          blue: "#4F7CFF",
          purple: "#7C0181",
          cyan: "#00D4FF",
        },
        card: "rgba(255, 255, 255, 0.05)",
        border: "rgba(255, 255, 255, 0.1)",
        brand: {
          pink: "#FC01B4",
          purple: "#7C0181",
          dark: "#1A1625",
          gray: "#F8FAFC",
          light: "#FFFFFF",
        }
      },
      backgroundImage: {
        "cosmic-gradient": "linear-gradient(135deg, #0B0F1A 0%, #7C0181 40%, #FC01B4 100%)",
        "glass-gradient": "linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "hover-glow": "glow 2s infinite alternate",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 100, 34, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 100, 34, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        premium: "20px",
      },
    },
  },
  plugins: [],
};

export default config;


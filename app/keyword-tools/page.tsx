import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Keyword Tools | MarketNow",
  description: "Discover the smartest AI Keyword Tool in 2026. Uncover high-volume keywords in seconds, check real-time difficulty scores, decode search intent, and build powerful topic clusters.",
};

export default function KeywordToolsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-20 px-4 md:px-6 text-center w-full">
      <h1 className="text-5xl lg:text-[72px] font-extrabold tracking-tight text-[#1A1625] mb-8 leading-[1.1]">
        Smartest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#9333EA]">AI Keyword Tool</span>
      </h1>
      <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Uncover high-volume keywords in seconds, check real-time difficulty scores, decode search intent, and build powerful topic clusters.
      </p>
    </div>
  );
}

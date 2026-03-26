import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO AI Tools: Dominate Local Search with 70% More Traffic | MarketNow",
  description: "Supercharge your local SEO with MarketNow’s GEO AI Tools — get instant GEO scores and AI-optimized local search insights.",
};

export default function GeoToolsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-20 px-4 md:px-6 text-center w-full">
      <h1 className="text-5xl lg:text-[72px] font-extrabold tracking-tight text-[#1A1625] mb-8 leading-[1.1]">
        Dominate Local Search <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#9333EA]">
          with GEO AI Tools
        </span>
      </h1>
      <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Supercharge your local SEO with MarketNow’s GEO AI Tools — get instant GEO scores and AI-optimized local search insights.
      </p>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI SEO Tools | MarketNow", /* Implied, user only gave Meta Description */
  description: "Get 10+ powerful AI SEO tools in one simple dashboard instant audits, keyword research, on-page optimization, technical fixes, GEO scoring, and more. Market Now analyzes 50+ factors in just 30 seconds with 97% accuracy.",
};

export default function SeoToolsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-20 px-4 md:px-6 text-center w-full">
      <h1 className="text-5xl lg:text-[72px] font-extrabold tracking-tight text-[#1A1625] mb-8 leading-[1.1]">
        Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#9333EA]">AI SEO Tools</span>
      </h1>
      <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Get 10+ powerful AI SEO tools in one simple dashboard instant audits, keyword research, on-page optimization, technical fixes, GEO scoring, and more.
      </p>
    </div>
  );
}

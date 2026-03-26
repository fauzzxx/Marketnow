import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Now Features – 25+ AI Tools for SEO, GEO & Marketing Automation",
  description: "Explore powerful Market Now features including AI SEO optimization, keyword clustering, content tools, site monitoring, competitor insights, and automation.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-20 px-4 md:px-6 text-center w-full">
      <h1 className="text-5xl lg:text-[72px] font-extrabold tracking-tight text-[#1A1625] mb-8 leading-[1.1]">
        Market Now <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#9333EA]">Features</span>
      </h1>
      <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Explore powerful Market Now features including AI SEO optimization, keyword clustering, content tools, site monitoring, competitor insights, and automation.
      </p>
    </div>
  );
}

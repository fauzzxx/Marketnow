import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium SEO Services: AI Optimization & Insights | MarketNow",
  description: "Discover MarketNow's suite of pro-level SEO services from keyword discovery to link building and GEO mastery. Get data-driven strategies that deliver top rankings and 150% traffic growth. No enterprise prices—subscribe affordably and transform your online game now!",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-24 px-4 md:px-6 text-center shadow-inner relative w-full">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -z-10" style={{ background: "#fc01b41a" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10" style={{ background: "#7c01811a" }} />
      <h1 className="text-5xl lg:text-[72px] font-extrabold tracking-tight text-[#1A1625] mb-8 leading-[1.1]">
        All-in-One AI SEO Services <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: "linear-gradient(90deg,#7c0181,#fc01b4)" }}>
          That Actually Deliver Results
        </span>
      </h1>
      <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Premium SEO tools at truly affordable prices — no enterprise complexity, no hidden fees.
      </p>

      <p className="text-base lg:text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
        At Market Now, we believe powerful SEO shouldn’t cost a fortune. That’s why we built a complete suite of intelligent AI-powered SEO services designed for growing businesses, digital marketers, and agencies who want real rankings without the premium price tag. Whether you’re struggling to get found on Google, battling tough competitors, or simply want to grow faster, our services give you everything you need in one clean, easy-to-use platform.
      </p>
    </div>
  );
}

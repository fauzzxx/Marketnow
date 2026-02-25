"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const TAB_CATEGORIES = [
  "Traffic & Market",
  "SEO",
  "Local",
  "Content",
  "AI Visibility",
  "Social",
  "Advertising",
  "AI PR"
];

const TAB_CONTENT = {
  "Traffic & Market": {
    title: "Traffic & Market",
    points: [
      "Analyze traffic on any website",
      "Track and benchmark competitors",
      "Gain actionable audience data"
    ],
    visual: <TrafficDashboard />
  },
  "SEO": {
    title: "SEO",
    points: [
      "Find billions of keywords with AI insights",
      "Analyze backlinks and traffic potential",
      "Run technical audits and track rankings"
    ],
    visual: <SEODashboard />
  },
  "Local": {
    title: "Local",
    points: [
      "Optimize your Google Business Profile",
      "Get your business listed in top directories",
      "Respond to customer reviews with AI"
    ],
    visual: <LocalDashboard />
  },
  "Content": {
    title: "Content",
    points: [
      "Create SEO-ready content with AI",
      "Get high-ranking content ideas",
      "Score and optimize content in real time"
    ],
    visual: <ContentDashboard />
  },
  "AI Visibility": {
    title: "AI Visibility",
    points: [
      "Analyze how LLMs feature your brand",
      "Track competitors' AI visibility",
      "Get AI tips to improve your strategy"
    ],
    visual: <AIVisibilityDashboard />
  },
  "Social": {
    title: "Social",
    points: [
      "Create and schedule posts with AI",
      "Monitor brand mentions and performance",
      "Find the right influencers for your brand"
    ],
    visual: <SocialDashboard />
  },
  "Advertising": {
    title: "Advertising",
    points: [
      "Launch AI-powered Google and Meta ads",
      "Plan and optimize your PPC campaigns",
      "Uncover competitors' ad strategies"
    ],
    visual: <AdvertisingDashboard />
  },
  "AI PR": {
    title: "AI PR",
    points: [
      "Find relevant media trusted by LLMs",
      "Launch outreach campaigns in minutes",
      "Monitor your brand presence in the media"
    ],
    visual: <AIVisibilityDashboard isPR />
  }
};

const getTabContent = (category: string) => {
  return TAB_CONTENT[category as keyof typeof TAB_CONTENT] || TAB_CONTENT["SEO"];
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("SEO");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = TAB_CATEGORIES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % TAB_CATEGORIES.length;
        return TAB_CATEGORIES[nextIndex];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const content = getTabContent(activeTab);

  return (
    <div className="min-h-screen bg-white font-sans text-[#121212]">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-[#2A195E]/10 bg-[#1B1040] px-4 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-24 items-center">
                <svg viewBox="0 0 120 40" className="h-full w-full">
                  {/* M */}
                  <path d="M5 35 V10 L15 25 L25 10 V35" fill="none" stroke="#005A9C" strokeWidth="6" strokeLinejoin="round" />
                  {/* N */}
                  <path d="M30 35 V10 L45 35 V10" fill="none" stroke="#FF6422" strokeWidth="6" strokeLinejoin="round" />
                  {/* Arrow */}
                  <path d="M45 35 L65 5 M65 5 L55 5 M65 5 L65 15" fill="none" stroke="#00AEEF" strokeWidth="4" strokeLinecap="round" />
                  {/* Clock Circle */}
                  <circle cx="85" cy="25" r="12" fill="none" stroke="#005A9C" strokeWidth="3" />
                  {/* Clock Face */}
                  <circle cx="85" cy="25" r="1" fill="#FF6422" />
                  <path d="M85 25 L85 18" stroke="#005A9C" strokeWidth="2" strokeLinecap="round" />
                  <path d="M85 25 L92 25" stroke="#FF6422" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tighter text-white">MARKET NOW</span>
            </Link>
            <div className="hidden gap-6 text-sm font-medium lg:flex">
              <Link href="#" className="hover:text-[#FF6422]">Products</Link>
              <Link href="#" className="hover:text-[#FF6422]">Pricing</Link>
              <Link href="#" className="hover:text-[#FF6422]">Resources</Link>
              <Link href="#" className="hover:text-[#FF6422]">Company</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors">Log In</Link>
            <Link href="/signup" className="rounded-lg bg-[#00BC8E] px-4 py-2 text-sm font-bold text-white hover:bg-[#00BC8E]/90 transition-all">Sign Up</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#2A195E] to-[#1B1040] pt-32 pb-24 text-center text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 mx-auto max-w-4xl px-4">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-7xl">
              Market Now
            </h1>
            <p className="mb-10 flex items-center justify-center gap-2 text-lg font-medium sm:text-x">
              Win digital brand visibility
              <span className="flex -space-x-2">
                <span className="h-6 w-6 rounded-full bg-white/20 border border-white/40 ring-2 ring-[#1B1040]"></span>
                <span className="h-6 w-6 rounded-full bg-blue-500 border border-white/40 ring-2 ring-[#1B1040]"></span>
                <span className="h-6 w-6 rounded-full bg-red-500 border border-white/40 ring-2 ring-[#1B1040]"></span>
              </span>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold ring-1 ring-white/20">& more</span>
            </p>

            <div className="mx-auto flex max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
              <input
                type="text"
                placeholder="Enter website, keyword or URL"
                className="flex-1 px-6 py-5 text-lg text-gray-800 outline-none placeholder:text-gray-400"
              />
              <div className="hidden items-center border-l px-4 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors sm:flex">
                <span className="mr-2">🇺🇸</span>
                <span className="font-semibold uppercase text-xs">US</span>
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              <button className="bg-[#FF6422] px-6 text-sm font-bold text-white transition-all hover:bg-[#FF6422]/90 sm:px-10 sm:text-lg">
                Get insights
              </button>
            </div>
          </div>
        </section>

        {/* Share of Voice Section */}
        <section className="bg-gradient-to-b from-[#412E8D] to-[#2A195E] py-24 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <ShareOfVoiceDashboard />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-extrabold leading-tight lg:text-5xl">
                One solution to win every search
              </h2>
              <ul className="space-y-4 text-lg opacity-90 lg:text-xl">
                <li className="flex gap-3">
                  <svg className="h-6 w-6 shrink-0 text-[#FF6422]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  Uniting our leading traditional SEO tools with powerful AI search + GEO capabilities
                </li>
                <li className="flex gap-3">
                  <svg className="h-6 w-6 shrink-0 text-[#FF6422]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  Measure and grow everywhere you’re discovered
                </li>
              </ul>
              <button className="mt-4 rounded-xl bg-gradient-to-r from-[#4B4EFC] to-[#2A195E] px-8 py-4 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                Try for free
              </button>
            </div>
          </div>
        </section>

        {/* Toolkits Section */}
        <section className="bg-[#1B1040] py-24 text-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="mb-12 text-3xl font-extrabold tracking-tight lg:text-5xl">
              Toolkits to make your brand seen,<br /> trusted and unstoppable
            </h2>

            {/* Tabs */}
            <div className="mb-16 flex flex-wrap justify-center gap-2">
              {TAB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    setIsAutoPlaying(false);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all sm:px-6 sm:py-3 sm:text-sm ${activeTab === cat
                    ? "bg-white text-[#1B1040] shadow-xl"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dynamic Content */}
            <div className="grid items-center gap-16 lg:grid-cols-2 text-left" key={activeTab}>
              <div className="space-y-8 animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9F7FF] text-[#00BC8E]">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-4xl font-bold">{content.title}</h3>
                <ul className="space-y-6 text-xl opacity-90">
                  {content.points.map((p, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-[#FF6422]">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <button className="rounded-xl bg-[#FF6422] px-10 py-5 text-xl font-bold shadow-xl transition-all hover:bg-[#FF6422]/90 hover:scale-105">
                  Try for free
                </button>
              </div>
              <div className="relative animate-slide-up">
                {content.visual}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white py-12 text-gray-500">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p>© 2026 Market Now. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function ShareOfVoiceDashboard() {
  const [data, setData] = useState([25, 22, 21, 4]);
  const [marketShare, setMarketShare] = useState(42);
  const [barHeights, setBarHeights] = useState([40, 60, 45, 70, 55, 80, 65, 90, 75]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(v => Math.max(1, Math.min(45, v + (Math.random() - 0.5) * 4))));
      setMarketShare(prev => Math.max(30, Math.min(65, prev + (Math.random() - 0.5) * 2)));
      setBarHeights(prev => prev.map(h => Math.max(20, Math.min(100, h + (Math.random() - 0.5) * 12))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-8 text-gray-800 shadow-2xl transition-all">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold">Share of Voice</h3>
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400 animate-pulse"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse delay-75"></span>
          <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse delay-150"></span>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[16px] border-gray-100 transition-all duration-1000">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#1B1040] tabular-nums">{marketShare.toFixed(0)}%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Share</span>
            </div>
            <svg className="absolute -inset-4 h-[calc(100%+32px)] w-[calc(100%+32px)] -rotate-90">
              <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#FF6422" strokeWidth="16" strokeDasharray={`${marketShare * 2.8} 280`} strokeLinecap="round" className="transition-all duration-1000 ease-in-out" />
            </svg>
          </div>
        </div>
        <div className="space-y-4">
          {["drinklollipop.com", "drinkpoppi.com", "health-ade.com", "drinkculturepop.com"].map((site, i) => (
            <div key={site} className="group flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-4 w-4 rounded-full shadow-inner ${["bg-[#00BC8E]", "bg-[#4B4EFC]", "bg-[#FF6422]", "bg-yellow-400"][i]}`}></div>
                <span className="text-sm font-bold group-hover:text-[#FF6422] transition-colors">{site}</span>
              </div>
              <span className="text-sm font-black tabular-nums transition-all duration-1000">{data[i].toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 h-32 w-full rounded-xl bg-gray-50 p-5 shadow-inner">
        <div className="flex h-full items-end gap-2">
          {barHeights.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-[#4B4EFC]/10 to-[#4B4EFC]/40 transition-all duration-1000 ease-in-out" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SEODashboard() {
  const [audit, setAudit] = useState(61);
  useEffect(() => {
    const interval = setInterval(() => {
      setAudit(prev => Math.max(50, Math.min(95, prev + (Math.random() - 0.5) * 5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 text-gray-800 shadow-2xl ring-1 ring-gray-200">
      <div className="mb-6 border-b pb-4 flex justify-between items-center">
        <h4 className="text-lg font-bold">SEO Snapshot</h4>
        <div className="h-2 w-8 rounded-full bg-[#00BC8E] animate-pulse"></div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-gray-100 p-4 bg-gray-50/30">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Audit</div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-black text-[#00BC8E] transition-all duration-1000 tabular-nums">{audit.toFixed(0)}%</span>
            <div className="relative h-16 w-16">
              <svg className="h-full w-full -rotate-90">
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#00BC8E" strokeWidth="6" strokeDasharray={`${audit * 1.25} 125`} className="transition-all duration-1000" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-xl border border-gray-100 p-4 bg-gray-50/30">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Performance</div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-black text-[#4B4EFC]">98%</span>
            <div className="h-16 w-16 rounded-full border-[8px] border-gray-100 border-t-[#4B4EFC] animate-spin-slow"></div>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-gray-100 p-4 bg-white overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Position Tracking</span>
          <span className="text-xs font-bold text-[#00BC8E] animate-bounce">+3.2% ↑</span>
        </div>
        <div className="h-24 w-full bg-[#4B4EFC]/5 rounded-lg flex items-end gap-1 p-2">
          {[45, 52, 48, 61, 55, 68, 72, 65, 80, 78, 85, 92].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-[#4B4EFC] transition-all duration-1000" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocalDashboard() {
  const [interactions, setInteractions] = useState(145);
  const [rank, setRank] = useState(5.82);

  useEffect(() => {
    const itv = setInterval(() => {
      setInteractions(prev => prev + Math.floor(Math.random() * 3));
      setRank(prev => Math.max(1, Math.min(10, prev + (Math.random() - 0.5) * 0.1)));
    }, 2500);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="relative h-[400px] w-full">
      <div className="absolute left-0 top-0 w-3/4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
        <h4 className="text-sm font-bold text-gray-800">Google Business Profile Performance</h4>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-32 w-full bg-blue-50/30 rounded-xl relative overflow-hidden">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="localGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 80 C 50 80, 80 20, 120 40 S 180 10, 220 50 S 300 0, 350 30 S 400 10, 400 10 V 100 H 0 Z"
                fill="url(#localGrad)"
              />
              <path
                d="M0 80 C 50 80, 80 20, 120 40 S 180 10, 220 50 S 300 0, 350 30 S 400 10, 400 10"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute top-4 right-4 rounded-lg bg-white/90 p-2 text-center shadow-sm backdrop-blur-sm ring-1 ring-blue-100">
              <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Interactions</div>
              <div className="text-sm font-black text-[#0EA5E9] tabular-nums">{interactions} <span className="text-[10px]">↑</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-2/3 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
        <h4 className="text-sm font-bold text-gray-800">Map tracking</h4>
        <div className="mt-4 flex items-center gap-4 border-t pt-4">
          <div className="flex-1">
            <div className="text-[10px] text-gray-400">Local business' average rank</div>
            <div className="text-2xl font-black text-gray-800 tabular-nums">{rank.toFixed(2)}</div>
          </div>
          <div className="h-12 w-24 bg-sky-50/50 rounded-lg flex items-center justify-center p-1 border border-sky-100">
            <svg className="h-full w-full" viewBox="0 0 64 32">
              <path
                d="M0 28 C 10 28, 15 10, 25 15 S 40 5, 50 20 S 60 10, 64 15"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 h-24 w-full bg-slate-100 rounded-lg overflow-hidden border">
          <div className="w-full h-full bg-blue-100/30 grid grid-cols-4 grid-rows-4 gap-1 p-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className={`rounded-sm ${Math.random() > 0.7 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentDashboard() {
  const [perfect, setPerfect] = useState(82);
  useEffect(() => {
    const itv = setInterval(() => setPerfect(prev => Math.max(75, Math.min(98, prev + (Math.random() - 0.5) * 3))), 3000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="relative h-[400px] w-full">
      <div className="absolute inset-x-0 top-0 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
        <h4 className="text-sm font-bold text-gray-800">Generate article using ideas</h4>
        <div className="mt-4 flex gap-2">
          {['Idea #1', 'Idea #2', 'Idea #3'].map((id, i) => (
            <span key={id} className={`rounded-full px-3 py-1 text-[10px] font-bold ${i === 1 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-400'}`}>{id}</span>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-3">
            <div className="text-xs font-bold">DIY chocolate</div>
            <div className="flex gap-2">
              <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] text-red-500 font-bold flex items-center gap-1">🔥 Trend</span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-[10px] text-green-500 font-bold">Intent</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-0 w-2/3 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200">
        <h4 className="text-sm font-bold mb-4">Article Improvements</h4>
        <div className="flex gap-6 items-center">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full -rotate-90">
              <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#f3f4f6" strokeWidth="6" />
              <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#10B981" strokeWidth="6" strokeDasharray={`${perfect * 1.25} 125`} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums">{perfect}%</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">SEO 1</span>
              <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">Readability 3</span>
            </div>
            <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">Tone 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIVisibilityDashboard({ isPR }: { isPR?: boolean }) {
  const [score, setScore] = useState(75);
  useEffect(() => {
    const itv = setInterval(() => setScore(s => Math.max(65, Math.min(95, s + (Math.random() - 0.5) * 4))), 2500);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 text-gray-800 shadow-2xl border border-gray-100">
      <h4 className="text-lg font-bold mb-6">{isPR ? "Media Presence vs. Trust" : "Market Share vs. Sentiment"}</h4>
      <div className="relative h-64 w-full bg-gray-50 rounded-xl p-4 overflow-hidden">
        <div className="absolute left-[20%] bottom-[30%] h-32 w-32 rounded-full bg-purple-200/50 animate-pulse border border-purple-300"></div>
        <div className="absolute right-[15%] bottom-[45%] h-24 w-24 rounded-full bg-sky-200/50 animate-pulse delay-700 border border-sky-300"></div>
        <div className="absolute right-[40%] bottom-[20%] h-28 w-28 rounded-full bg-green-200/50 animate-pulse delay-1000 border border-green-300"></div>
        <div className="absolute left-4 h-full border-l border-gray-200 flex flex-col justify-between text-[8px] text-gray-400 py-4">
          <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100 absolute bottom-[-5%] right-4 w-[70%]">
        <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Visibility Rate</h4>
        <div className="space-y-4">
          {['ChatGPT', 'Gemini'].map((p, i) => (
            <div key={p} className="space-y-1">
              <div className="flex justify-between text-[10px] font-black tabular-nums">
                <span>{p}</span>
                <span className={i === 0 ? 'text-blue-500' : 'text-purple-500'}>{score + (i * 2)}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${i === 0 ? 'bg-blue-500' : 'bg-purple-500'} transition-all duration-1000`} style={{ width: `${score + (i * 2)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialDashboard() {
  const [audience, setAudience] = useState(565);
  useEffect(() => {
    const itv = setInterval(() => setAudience(prev => prev + Math.floor(Math.random() * 2)), 2000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="relative h-[400px] w-full">
      <div className="absolute inset-x-0 top-0 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black shadow-lg shadow-blue-500/20">New Post</span>
            <span className="bg-gray-50 text-gray-400 px-3 py-1 rounded text-[10px] font-black border">Profiles +</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['Monday', 'Tuesday'].map((day, i) => (
            <div key={day} className="space-y-3">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
              <div className="rounded-lg border border-gray-100 p-3 text-[10px] bg-sky-50/30 shadow-sm flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-xs">📸</div>
                <div className="flex-1 truncate font-bold text-gray-600">12:00 PM • {i === 0 ? 'Promo Content' : 'Engagement Post'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
        <h4 className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Audience</h4>
        <div className="text-2xl font-black text-gray-800 tabular-nums">{audience}K</div>
        <div className="text-[10px] text-green-500 font-bold">+4.3K ↑</div>
        <div className="mt-4 h-12 w-full bg-green-50 flex items-end">
          {[30, 60, 45, 80, 55, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-green-400/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 rounded-2xl bg-white p-6 shadow-2xl border ml-4">
        <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest text-center">Engagement</h4>
        <div className="relative h-20 w-20 mx-auto">
          <svg className="h-full w-full rotate-[-90deg]">
            <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle cx="50%" cy="50%" r="35%" fill="none" stroke="url(#socialGrad)" strokeWidth="8" strokeDasharray="40 100" />
            <defs>
              <linearGradient id="socialGrad">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">8.3K</div>
        </div>
      </div>
    </div>
  );
}

function AdvertisingDashboard() {
  return (
    <div className="relative h-[440px] w-full">
      <div className="absolute left-0 top-0 w-full rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
        <h4 className="text-sm font-black text-gray-800 mb-4 text-center">AI Ad Creator</h4>
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {['English', 'Headlines: 5'].map((tag) => (
              <span key={tag} className="rounded-full bg-blue-50 text-blue-500 px-3 py-1 text-[10px] font-bold">{tag}</span>
            ))}
          </div>
          <div className="flex gap-4 p-4 border rounded-xl bg-gray-50/50">
            <div className="h-16 w-16 bg-white rounded-lg shadow-inner flex items-center justify-center">👟</div>
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="h-2 w-full bg-gray-200 rounded"></div>
              <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
        <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Platform Mix</h4>
        <div className="flex items-end gap-3 h-24 px-2">
          {[40, 75, 50, 95, 65].map((h, i) => (
            <div key={i} className="flex-1 bg-sky-400/40 rounded-t" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-0 w-1/2 rounded-2xl bg-white p-6 shadow-2xl border ml-4 scale-95 origin-bottom-right">
        <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest text-center">Devices</h4>
        <div className="h-24 w-24 mx-auto relative group">
          <svg className="h-full w-full rotate-[-90deg]">
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#F1F5F9" strokeWidth="12" />
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#0EA5E9" strokeWidth="12" strokeDasharray="60 125" />
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="30 125" strokeDashoffset="-60" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">70% Mobile</div>
        </div>
      </div>
    </div>
  );
}

function TrafficDashboard() {
  const [v, setV] = useState(1.2);
  useEffect(() => {
    const itv = setInterval(() => setV(prev => prev + (Math.random() - 0.5) * 0.1), 2000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 text-gray-800 shadow-2xl ring-1 ring-gray-200 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-bold">Traffic Analytics</h4>
        <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
          <button className="rounded-md bg-white px-3 py-1 text-[10px] font-black shadow-sm text-[#FF6422]">Live</button>
          <button className="rounded-md px-3 py-1 text-[10px] font-black text-gray-400">Past</button>
        </div>
      </div>
      <div className="space-y-8">
        <div className="flex items-end gap-2 h-44 border-b border-dashed pb-4 px-2">
          {[30, 45, 40, 60, 55, 80, 65, 95, 70, 85, 75, 90, 80, 70].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1B1040] text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {h}k
              </div>
              <div className="mb-1 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#FF6422]" style={{ width: `${Math.random() * 100}%` }}></div>
              </div>
              <div className="w-full rounded-t-sm bg-gradient-to-t from-[#FF6422]/10 to-[#FF6422]/60 hover:to-[#FF6422] transition-all duration-500" style={{ height: `${h}%` }}></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#1B1040] tabular-nums">{v.toFixed(1)}M</div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Visits</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#1B1040]">3:24</div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Time</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#1B1040]">42%</div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bounce</div>
          </div>
        </div>
      </div>
    </div>
  );
}

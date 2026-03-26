"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, BarChart2, Shield, Zap, Globe, Target, LineChart, 
  ArrowRight, CheckCircle2, ChevronRight, Sparkles, TrendingUp
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const BRAND_PRIMARY = "#7c0181";
  const BRAND_ACCENT = "#fc01b4";

  const reveal = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  } as const;

  const spring = { type: "spring", stiffness: 120, damping: 18 } as const;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-fuchsia-100 selection:text-fuchsia-900 overflow-x-hidden">
      {/* ===== HERO (Semrush-style) ===== */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[120px] opacity-40"
            style={{ background: `radial-gradient(circle, ${BRAND_ACCENT}33 0%, transparent 60%)` }}
          />
          <div className="absolute top-10 -left-24 w-[420px] h-[420px] rounded-full blur-[90px] opacity-35"
            style={{ background: `radial-gradient(circle, ${BRAND_PRIMARY}33 0%, transparent 65%)` }}
          />
          <div className="absolute -bottom-40 -right-40 w-[620px] h-[620px] rounded-full blur-[120px] opacity-30"
            style={{ background: `radial-gradient(circle, ${BRAND_ACCENT}2E 0%, transparent 60%)` }}
          />
        </div>

        <div className="w-full px-4 md:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm"
              >
                <TrendingUp className="h-4 w-4" style={{ color: BRAND_PRIMARY }} />
                <span className="text-sm font-semibold text-slate-800">Market Now • SEO + AI Intelligence</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
                className="mt-6 text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.06]"
              >
                AI-Powered SEO & GEO Intelligence Platform{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`,
                  }}
                >
                  Market Now
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
                className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
              >
                Optimize your website, track AI search visibility, and automate digital marketing from one powerful platform.
                Market Now helps businesses improve search rankings and AI answer engine visibility through advanced technical SEO audits,
                GEO analysis, performance diagnostics, citation tracking, and marketing automation workflows.
                Discover issues, analyze competitors, and grow your digital presence faster with data-driven insights.
              </motion.p>

              {/* Keep button names + behavior */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
                className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-[0_10px_30px_rgba(124,1,129,0.25)] hover:-translate-y-0.5 transition-transform duration-200 flex items-center justify-center gap-2"
                    style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                  >
                    Get Your Free SEO Audit <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 text-base flex items-center justify-center gap-2 shadow-sm"
                    style={{ color: BRAND_PRIMARY }}
                  >
                    <Search className="h-4 w-4" /> Check Your Rankings
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.22 }}
                className="mt-10 grid grid-cols-3 gap-4 max-w-xl"
              >
                {[
                  { label: "Websites Optimized", value: "500+" },
                  { label: "Average Traffic Increase", value: "150%" },
                  { label: "Average Ranking Position", value: "Top 3" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 py-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text"
                      style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero product preview (animated mock) */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.75, ease: "easeOut", delay: 0.05 }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                  className="absolute -top-10 -left-10 w-40 h-40 rounded-[2.2rem] rotate-6 blur-[1px] opacity-25"
                  style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                />
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
                  className="absolute -bottom-14 -right-10 w-56 h-56 rounded-[3rem] -rotate-6 opacity-20"
                  style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})` }}
                />

                <div className="relative rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Market Now Preview
                    </div>
                  </div>

                  <div className="p-6 md:p-7">
                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-5 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                            Visibility Score
                          </div>
                          <div className="mt-3 flex items-end justify-between">
                            <div className="text-4xl font-black" style={{ color: BRAND_PRIMARY }}>
                              72
                              <span className="text-base font-bold text-slate-400">/100</span>
                            </div>
                            <div
                              className="h-2 w-24 rounded-full"
                              style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                            Instant Suggestions
                          </div>
                          <div className="mt-3 space-y-2.5">
                            {[
                              "Add structured data markup",
                              "Optimize for conversational queries",
                              "Improve mobile experience",
                            ].map((t) => (
                              <div key={t} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <span
                                  className="inline-block h-2 w-2 rounded-full"
                                  style={{ background: BRAND_ACCENT }}
                                />
                                <span className="truncate">{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-7">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                              Keyword Momentum
                            </div>
                            <div className="text-xs font-bold text-slate-500">Last 30 days</div>
                          </div>
                          <div className="mt-4 grid grid-cols-12 gap-2 items-end h-28">
                            {[20, 30, 40, 28, 55, 46, 62, 60, 72, 68, 80, 90].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${h}%`, opacity: 1 }}
                                transition={{ delay: 0.25 + i * 0.03, ...spring }}
                                className="col-span-1 rounded-md"
                                style={{
                                  background:
                                    i % 3 === 0
                                      ? BRAND_PRIMARY
                                      : i % 3 === 1
                                        ? BRAND_ACCENT
                                        : `${BRAND_PRIMARY}AA`,
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                          {[
                            { icon: <Shield className="h-4 w-4" />, label: "Technical SEO", val: "Clean" },
                            { icon: <Globe className="h-4 w-4" />, label: "Local Signals", val: "Strong" },
                            { icon: <Zap className="h-4 w-4" />, label: "Content Ops", val: "Fast" },
                            { icon: <BarChart2 className="h-4 w-4" />, label: "Competitive Intel", val: "Live" },
                          ].map((c) => (
                            <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                              <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <span style={{ color: BRAND_PRIMARY }}>{c.icon}</span>
                                <span className="text-sm">{c.label}</span>
                              </div>
                              <div className="mt-2 text-xs font-bold text-slate-500">{c.val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES OVERVIEW ===== */}
      <section id="features" className="py-16 md:py-24 bg-slate-50 w-full scroll-mt-24">
        <div className="w-full px-4 md:px-6">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Everything you need to grow visibility —{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
              >
                in one place
              </span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Use SEO tools, keyword research, audits, and AI GEO optimization to build compounding traffic.
            </p>
          </motion.div>

          <div className="mt-10 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Search className="h-5 w-5" />, title: "SEO tools", desc: "Quick audits, metadata checks, on-page wins." },
              { icon: <BarChart2 className="h-5 w-5" />, title: "Keyword research", desc: "Discover intent, difficulty, and opportunities." },
              { icon: <Shield className="h-5 w-5" />, title: "Technical SEO", desc: "Spot issues that quietly suppress rankings." },
              { icon: <Target className="h-5 w-5" />, title: "AI GEO tools", desc: "Optimize for AI answers and new discovery paths." },
              { icon: <Zap className="h-5 w-5" />, title: "AI content tools", desc: "Generate, improve, and scale content output." },
              { icon: <Globe className="h-5 w-5" />, title: "Local SEO", desc: "Stronger map-pack + local intent visibility." },
              { icon: <LineChart className="h-5 w-5" />, title: "Analytics visuals", desc: "See what’s improving and why." },
              { icon: <Sparkles className="h-5 w-5" />, title: "Automation", desc: "Speed up workflows across your toolkit." },
            ].map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: Math.min(0.18, idx * 0.04) }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                >
                  {f.icon}
                </div>
                <div className="mt-4 text-lg font-extrabold text-slate-900">{f.title}</div>
                <div className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.desc}</div>
                <div className="mt-5 inline-flex items-center text-sm font-bold" style={{ color: BRAND_PRIMARY }}>
                  Explore <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WALKTHROUGH (Alternating) ===== */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="w-full px-4 md:px-6 space-y-16 md:space-y-24">
          {[
            {
              title: "Free SEO Website Checker",
              body: "Drop a URL and instantly see what to fix first — titles, meta descriptions, headings, and technical issues that matter.",
              side: "left" as const,
            },
            {
              title: "Copilot Insights",
              body: "Get prioritized actions with impact levels — designed to turn audits into execution, fast.",
              side: "right" as const,
            },
            {
              title: "AI-Powered GEO Analysis",
              body: "Optimize for conversational queries and AI discovery with structured suggestions and score-driven improvements.",
              side: "left" as const,
            },
          ].map((s) => (
            <div key={s.title} className="grid lg:grid-cols-12 gap-10 items-center">
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={s.side === "left" ? "lg:col-span-5 order-1" : "lg:col-span-5 order-2 lg:order-2"}
              >
                <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <span className="h-2 w-2 rounded-full" style={{ background: BRAND_ACCENT }} />
                  Market Now Feature
                </div>
                <h3 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
                  {s.body}
                </p>

                {/* Keep existing input + button + handler exactly */}
                {s.title === "Free SEO Website Checker" && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1 w-full relative">
                        <input
                          type="url"
                          placeholder="Enter your website URL (e.g., example.com)"
                          className="w-full h-12 pl-4 pr-4 rounded-2xl border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/15 focus:border-fuchsia-400 transition-all text-base"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                      <button
                        className="w-full sm:w-auto h-12 px-6 rounded-2xl font-bold text-white shadow-[0_10px_25px_rgba(124,1,129,0.22)] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
                        style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                        onClick={() => router.push("/dashboard")}
                      >
                        <Search className="h-5 w-5" /> Check SEO
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={s.side === "left" ? "lg:col-span-7 order-2" : "lg:col-span-7 order-1 lg:order-1"}
              >
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-2 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)]">
                  <div className="rounded-[1.7rem] bg-white border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {s.title}
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-5 space-y-3">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              Score
                            </div>
                            <div className="mt-2 flex items-end justify-between">
                              <div className="text-3xl font-black" style={{ color: BRAND_PRIMARY }}>
                                82<span className="text-base font-bold text-slate-400">/100</span>
                              </div>
                              <div
                                className="h-2 w-20 rounded-full"
                                style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
                              />
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              Top fixes
                            </div>
                            <div className="mt-2 space-y-2">
                              {["Optimize titles", "Fix broken links", "Improve schema"].map((t) => (
                                <div key={t} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                  <span className="h-2 w-2 rounded-full" style={{ background: BRAND_ACCENT }} />
                                  <span className="truncate">{t}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-7">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Progress
                              </div>
                              <div className="text-xs font-bold text-slate-500">Live</div>
                            </div>
                            <div className="mt-3 space-y-3">
                              {[65, 45, 78].map((v, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                    <span>{i === 0 ? "Technical" : i === 1 ? "Content" : "AI GEO"}</span>
                                    <span>{v}%</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${v}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 1.1, ease: "easeOut" }}
                                      className="h-full rounded-full"
                                      style={{
                                        backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            {[
                              { label: "SEO Tools", icon: <Search className="h-4 w-4" /> },
                              { label: "Keyword Research", icon: <BarChart2 className="h-4 w-4" /> },
                              { label: "Local SEO", icon: <Globe className="h-4 w-4" /> },
                              { label: "AI GEO", icon: <Target className="h-4 w-4" /> },
                            ].map((chip) => (
                              <div
                                key={chip.label}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-2 text-sm font-bold text-slate-700"
                              >
                                <span style={{ color: BRAND_PRIMARY }}>{chip.icon}</span>
                                <span className="truncate">{chip.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BIG CTA (keep button names + behavior) ===== */}
      <section className="py-16 md:py-24 bg-slate-50 w-full">
        <div className="w-full px-4 md:px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-white shadow-[0_30px_90px_-55px_rgba(15,23,42,0.45)]">
            <div
              className="absolute inset-0 opacity-90"
              style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
            />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_20%,white_0%,transparent_35%),radial-gradient(circle_at_80%_70%,white_0%,transparent_38%)]" />

            <div className="relative z-10 px-7 py-14 md:px-14 md:py-16 text-center text-white">
              <motion.h2
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-extrabold tracking-tight"
              >
                Ready to dominate search?
              </motion.h2>
              <motion.p
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.06 }}
                className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mx-auto"
              >
                Premium SEO tools at truly affordable prices. No enterprise complexity, no hidden fees. Get data-driven
                strategies that deliver top rankings.
              </motion.p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link href="/signup">
                  <button
                    className="px-8 py-4 rounded-full font-bold bg-white shadow-lg hover:scale-105 transition-transform text-lg flex items-center justify-center gap-2"
                    style={{ color: BRAND_PRIMARY }}
                    onClick={() => router.push("/dashboard")}
                  >
                    Get Started Now
                  </button>
                </Link>
                <Link href="/services">
                  <button
                    className="px-8 py-4 rounded-full font-bold text-white bg-white/10 border border-white/25 hover:bg-white/15 transition-colors text-lg"
                    onClick={() => router.push("/dashboard")}
                  >
                    View Pricing
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER (SaaS style) ===== */}
      <footer className="bg-white pt-16 pb-10 border-t border-slate-200 w-full">
        <div className="w-full px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-5">
                <span className="text-2xl font-black tracking-tight text-slate-900 leading-none flex items-center">
                  <svg className="w-6 h-6 mr-1.5" style={{ color: BRAND_PRIMARY }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  Market<span style={{ color: BRAND_ACCENT }}>NOW</span>
                </span>
              </Link>
              <p className="text-slate-600 max-w-sm">
                Data-driven SEO strategies that deliver measurable results and AI-powered intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-5">Product</h4>
              <ul className="space-y-3.5">
                {["Features", "SEO Tools", "Keyword UI", "GEO Analysis"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-slate-600 hover:text-slate-900 font-semibold">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-5">Company</h4>
              <ul className="space-y-3.5">
                {["About Us", "Careers", "Contact", "Blog"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-slate-600 hover:text-slate-900 font-semibold">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-5">Legal</h4>
              <ul className="space-y-3.5">
                {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-slate-600 hover:text-slate-900 font-semibold">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-7 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-slate-600 font-semibold">
            <p>© 2026 Market Now. All rights reserved.</p>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="h-9 w-9 rounded-full border border-slate-200 bg-slate-50" />
              <div className="h-9 w-9 rounded-full border border-slate-200 bg-slate-50" />
              <div className="h-9 w-9 rounded-full border border-slate-200 bg-slate-50" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Eye,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Shield,
  Zap,
  Bell,
  TrendingDown,
  TrendingUp,
  Activity,
  ChevronDown,
  Menu,
  X,
  Globe,
  Layers,
  Clock,
  Users,
} from "lucide-react";

// ─── UTILITY ──────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame((ts) => step(ts, startTime));
    };
    requestAnimationFrame((ts) => step(ts, ts));
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── SECTION FADE IN ───────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className,
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const variants = {
    bottom: { opacity: 0, y: 32 },
    left: { opacity: 0, x: -32 },
    right: { opacity: 0, x: 32 },
    none: { opacity: 0 },
  };
  return (
    <motion.div
      ref={ref}
      initial={variants[from]}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : variants[from]}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── LIVE FEED TICKER ───────────────────────────────────────────────────────

const feedEvents = [
  { msg: "GA4 synced — Acme Corp", color: "primary", pulse: false },
  { msg: "Meta Ads degraded — Beta Agency", color: "secondary", pulse: true },
  { msg: "Report opened — Gamma Inc", color: "neutral", pulse: false },
  { msg: "↓ 34% sessions detected — Acme Corp", color: "alert", pulse: true },
  { msg: "Google Ads reconnected — Delta Co", color: "primary", pulse: false },
  { msg: "Report opened — Echo Ltd", color: "neutral", pulse: false },
  { msg: "Search Console synced — Foxtrot", color: "primary", pulse: false },
  { msg: "Anomaly resolved — Golf Media", color: "primary", pulse: false },
];

const colorClasses = {
  primary: { badge: "bg-indigo-50 text-indigo-700 border-indigo-100", dot: "bg-indigo-600" },
  secondary: { badge: "bg-violet-50 text-violet-700 border-violet-100", dot: "bg-violet-500" },
  neutral: { badge: "bg-slate-50 text-slate-600 border-slate-200", dot: "bg-slate-400" },
  alert: { badge: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
};

function LiveFeedTicker() {
  const doubled = [...feedEvents, ...feedEvents];
  return (
    <div className="relative overflow-hidden border-y border-slate-200 py-3 bg-slate-50">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-3 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((e, i) => {
          const c = colorClasses[e.color as keyof typeof colorClasses];
          return (
            <span
              key={i}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shrink-0",
                c.badge
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", c.dot, e.pulse && "animate-pulse")} />
              {e.msg}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── HERO WORD REVEAL ───────────────────────────────────────────────────────

const line1 = ["Know", "when", "your", "clients'"];
const line2 = ["campaigns", "break"];
const accent = ["before", "they", "do."];

function HeroHeadline() {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [va, setVa] = useState(0);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    line1.forEach((_, i) => t.push(setTimeout(() => setV1(i + 1), 120 + i * 80)));
    line2.forEach((_, i) =>
      t.push(setTimeout(() => setV2(i + 1), 120 + line1.length * 80 + 100 + i * 80))
    );
    accent.forEach((_, i) =>
      t.push(
        setTimeout(
          () => setVa(i + 1),
          120 + (line1.length + line2.length) * 80 + 300 + i * 90
        )
      )
    );
    return () => t.forEach(clearTimeout);
  }, []);

  const word = (text: string, visible: boolean, i: number, isAccent = false) => (
    <span
      key={i}
      className={cn(
        "inline-block mr-[0.22em] transition-all duration-500",
        visible ? "opacity-100 translate-y-0 blur-none" : "opacity-0 translate-y-5 blur-sm",
        isAccent &&
          "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent"
      )}
      style={{ transitionDelay: `${i * 20}ms` }}
    >
      {text}
    </span>
  );

  return (
    <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] font-bold leading-[1.08] tracking-[-0.03em] text-slate-900 mb-7">
      <span className="block">{line1.map((w, i) => word(w, i < v1, i))}</span>
      <span className="block">{line2.map((w, i) => word(w, i < v2, i))}</span>
      <span className="block">{accent.map((w, i) => word(w, i < va, i, true))}</span>
    </h1>
  );
}

// ─── DASHBOARD MOCKUP ───────────────────────────────────────────────────────

function DashboardMockup() {
  const clients = [
    { name: "Acme Corp", platform: "GA4", status: "healthy", change: "+12%" },
    { name: "Beta Agency", platform: "Meta Ads", status: "degraded", change: "-" },
    { name: "Gamma Inc", platform: "Google Ads", status: "broken", change: "-" },
    { name: "Delta Co", platform: "Search Console", status: "healthy", change: "+4%" },
  ];

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-200/60 rounded-md px-4 py-1 text-[11px] text-slate-600 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            app.corpozort.tech/dashboard
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-5">
        {/* Stat row */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {[
            { label: "Active Clients", value: "24", icon: Users, alert: false },
            { label: "Reports Sent", value: "186", icon: BarChart3, alert: false },
            { label: "Integrations", value: "71", icon: Layers, alert: false },
            { label: "Active Alerts", value: "2", icon: Bell, alert: true },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-left">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                <s.icon className={cn("h-3 w-3", s.alert ? "text-rose-500" : "text-slate-400")} />
              </div>
              <p className={cn("text-xl font-bold", s.alert ? "text-rose-600" : "text-slate-800")}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Health table */}
        <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-3 text-left">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-slate-700">Integration Health</p>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
              <Activity className="h-2.5 w-2.5" /> Live
            </span>
          </div>
          <div className="space-y-2">
            {clients.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      c.status === "healthy"
                        ? "bg-emerald-500"
                        : c.status === "degraded"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-rose-500 animate-pulse"
                    )}
                  />
                  <span className="text-[12px] font-medium text-slate-700">{c.name}</span>
                  <span className="text-[10px] text-slate-400">{c.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.change !== "-" && (
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                      <TrendingUp className="h-2.5 w-2.5" /> {c.change}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      c.status === "healthy"
                        ? "bg-emerald-50 text-emerald-700"
                        : c.status === "degraded"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    )}
                  >
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Corpo<span className="text-indigo-600">zort</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 transition-all duration-150 active:scale-[0.97]"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 flex flex-col gap-4 md:hidden text-left"
          >
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item}
              </a>
            ))}
            <hr className="border-slate-100" />
            <Link href="/login" className="text-sm font-medium text-slate-600">
              Sign in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 shadow-sm"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── DATA ───────────────────────────────────────────────────────────

const problems = [
  {
    icon: AlertTriangle,
    color: "red",
    title: "Silent integration failures",
    body: "GA4 stops syncing at 2am. Your report sends corrupt data at 9am. Your client calls at 10am.",
    tag: "Most common",
  },
  {
    icon: Eye,
    color: "amber",
    title: "Reports sent into a void",
    body: "4 hours building the perfect report. It sends. You never know if they opened it, cared, or churned.",
    tag: null,
  },
  {
    icon: TrendingDown,
    color: "stone",
    title: "You find out when they do",
    body: "The client screenshots the broken dashboard and DMs you. No warning. No heads-up. Just damage.",
    tag: null,
  },
];

const solutions = [
  {
    icon: Bell,
    color: "amber",
    title: "Proactive health alerts",
    body: "Know the moment an integration breaks — before reports fail, before clients notice, before it's a problem.",
  },
  {
    icon: Eye,
    color: "stone",
    title: "Report engagement tracking",
    body: "See exactly when clients open reports, which sections they read, and how long they spend.",
  },
  {
    icon: Activity,
    color: "orange",
    title: "Anomaly detection",
    body: "Daily metric comparisons flag unusual spikes or drops. You act first. Every single time.",
  },
];

const testimonials = [
  {
    quote:
      "We caught a broken GA4 integration 6 hours before a client presentation. Corpozort basically saved the account.",
    name: "Sarah K.",
    role: "Head of Analytics, GrowthLab",
    avatar: "SK",
  },
  {
    quote:
      "Finally I can see who actually reads our reports. Knowing engagement data changed how we write them.",
    name: "Marcus T.",
    role: "Founder, Metric Studio",
    avatar: "MT",
  },
  {
    quote:
      "The anomaly detection alone has saved us from 3 client escalations in 2 months. It's indispensable.",
    name: "Priya D.",
    role: "Director of Ops, ClickBridge",
    avatar: "PD",
  },
];

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "For solo freelancers getting started",
    features: ["3 clients", "2 integrations", "Manual reports", "Corpozort branding"],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Starter",
    price: 49,
    desc: "For growing agencies scaling fast",
    features: [
      "15 clients",
      "All integrations",
      "White-label reports",
      "Scheduled delivery",
      "Global templates",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Growth",
    price: 99,
    desc: "For established agencies running at scale",
    features: [
      "Unlimited clients",
      "Everything in Starter",
      "Anomaly alerts",
      "Engagement tracking",
      "Live dashboards",
    ],
    cta: "Start 14-day trial",
    highlight: false,
  },
];

const faqs = [
  {
    q: "How long does setup take?",
    a: "Under 2 minutes per client. Connect via OAuth — no credentials, no copy-pasting API keys. Just authorize and you're live.",
  },
  {
    q: "Do my clients need to do anything?",
    a: "No. Corpozort is invisible to your clients. You manage everything. They just receive better, more reliable service.",
  },
  {
    q: "Which integrations are supported?",
    a: "GA4, Google Ads, Meta Ads, and Search Console at launch. More integrations are coming — vote on what we add next in the dashboard.",
  },
  {
    q: "How does anomaly detection work?",
    a: "We compare each day's metrics to a rolling 30-day baseline. A 25%+ deviation in sessions, conversions, or spend triggers an immediate alert.",
  },
  {
    q: "Can I white-label reports for clients?",
    a: "Yes, on Starter and Growth plans. Your logo, your colors, your domain. Clients never see the Corpozort brand.",
  },
];

// ─── FAQ COMPONENT ────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white overflow-hidden text-left shadow-sm"
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-semibold text-slate-700">{faq.q}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4",
                open === i && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────

export default function RootPage() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      <Nav />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[900px] rounded-full bg-indigo-500/10 blur-[130px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-10 backdrop-blur-sm"
          >
            <span className="text-xs font-semibold text-indigo-700">
              Live monitoring for marketing agencies
            </span>
          </motion.div>

          <HeroHeadline />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Corpozort watches your clients&apos; marketing integrations 24/7 — so you
            catch broken campaigns, silent failures, and anomalies before anyone else does.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5"
          >
            <Link
              href="/onboarding"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 text-base transition-all duration-200 active:scale-[0.97] shadow-md shadow-indigo-600/10"
            >
              Start monitoring free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-7 py-3.5 text-base transition-all duration-200"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.9 }}
            className="text-xs font-medium text-slate-400"
          >
            No credit card · Free up to 3 clients · Setup in 2 minutes
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.1 }}
            className="flex flex-wrap items-center justify-center gap-5 mt-10"
          >
            {[
              { icon: Shield, label: "SOC 2 ready" },
              { icon: Clock, label: "6hr sync cycle" },
              { icon: Globe, label: "4 integrations" },
              { icon: Zap, label: "Instant alerts" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 relative"
          >
            <div className="absolute -inset-6 bg-indigo-500/[0.04] rounded-3xl blur-3xl" />
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* ── LIVE TICKER ─────────────────────────────────────────────────── */}
      <LiveFeedTicker />

      {/* ── PROBLEM ─────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-28 text-center">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-4">
            The problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Agencies lose clients to silent failures
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-base">
            Every competitor shows you broken data after the fact. Corpozort tells you
            before the report fails.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
          {problems.map((item, i) => {
            const Icon = item.icon;
            const borderColor =
              item.color === "red"
                ? "border-rose-100"
                : "border-slate-200";
            const iconBg =
              item.color === "red"
                ? "bg-rose-50 text-rose-600"
                : "bg-slate-100 text-slate-600";
            return (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className={cn(
                    "rounded-2xl border bg-white p-6 h-full transition-all duration-300 hover:shadow-md hover:border-slate-300",
                    borderColor
                  )}
                >
                  {item.tag && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-0.5 mb-4">
                      {item.tag}
                    </span>
                  )}
                  <div
                    className={cn(
                      "rounded-xl w-10 h-10 flex items-center justify-center mb-4",
                      iconBg
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ── SOLUTION ────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-28 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-4">
              The solution
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Corpozort fixes all three
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {solutions.map((item, i) => {
              const Icon = item.icon;
              const bg =
                item.color === "amber"
                  ? "bg-amber-500"
                  : item.color === "stone"
                  ? "bg-slate-700"
                  : "bg-orange-500";
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 h-full hover:border-indigo-300 hover:shadow-md transition-all duration-300">
                    <div
                      className={cn(
                        "rounded-xl w-10 h-10 flex items-center justify-center mb-4 shadow-sm",
                        bg
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 py-28 text-center">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Three steps. Then it runs itself.
          </h2>
        </FadeIn>

        <div className="relative text-left">
          <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 hidden sm:block" />
          <div className="space-y-10">
            {[
              {
                step: "01",
                title: "Connect your integrations",
                body: "Link GA4, Google Ads, Meta Ads, and Search Console via OAuth. Takes under 2 minutes per client. No credentials, no setup calls.",
              },
              {
                step: "02",
                title: "Corpozort monitors 24/7",
                body: "Every 6 hours, we sync all client data, check integration health, run anomaly detection, and track report engagement.",
              },
              {
                step: "03",
                title: "You get alerted. Client never knows.",
                body: "Something breaks or spikes? You know first. Fix it before the report sends. Walk into every call looking like a hero.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="flex gap-6 relative">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold z-10 shadow-md shadow-indigo-600/20">
                    {item.step}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="border-y border-indigo-100 bg-indigo-50/40 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: 433, suffix: "K+", label: "Marketing agencies worldwide" },
              { value: 25, suffix: "%", label: "Anomaly detection threshold" },
              { value: 2, suffix: " min", label: "Average setup time" },
            ].map((stat) => (
              <FadeIn key={stat.label}>
                <p className="text-4xl font-extrabold text-indigo-900 mb-2">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-4">
            From the field
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Agencies that caught it first
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4 h-full shadow-sm">
                <div className="flex gap-0.5">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <span key={j} className="text-amber-400 text-sm">
                        ★
                      </span>
                    ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-y border-slate-200 bg-slate-50/50 py-28 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              Flat-rate. No per-client penalties.
            </h2>
            <p className="text-slate-600 text-base">
              Every competitor charges per client. We don&apos;t
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start text-left">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div
                  className={cn(
                    "rounded-2xl border p-6 flex flex-col transition-all duration-300 bg-white",
                    plan.highlight
                      ? "border-indigo-500 shadow-xl ring-1 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300 shadow-sm"
                  )}
                >
                  {plan.highlight && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 mb-4 w-fit">
                      Most popular
                    </span>
                  )}
                  <p className="text-sm font-semibold text-slate-400 mb-1">{plan.name}</p>
                  <p className="text-4xl font-extrabold text-slate-900 mb-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-slate-400">/mo</span>
                  </p>
                  <p className="text-sm text-slate-500 mb-6 font-medium">{plan.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle
                          className={cn(
                            "h-4 w-4 shrink-0",
                            plan.highlight ? "text-indigo-600" : "text-slate-400"
                          )}
                        />
                        <span className="text-slate-600 font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/onboarding"
                    className={cn(
                      "w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
                      plan.highlight
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-400 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              14-day free trial on all paid plans · No credit card required · Cancel anytime
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────*/}
      <section className="max-w-2xl mx-auto px-6 py-28 text-center">
        <FadeIn className="text-center mb-12">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-4">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Common questions
          </h2>
        </FadeIn>
        <FadeIn>
          <FAQ />
        </FadeIn>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden border-t border-slate-200 bg-white text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <FadeIn className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-8">
            <span className="text-xs font-semibold text-indigo-700">
              Join agencies already monitoring
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Stop losing clients to <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              silent failures
            </span>
          </h2>
          <p className="text-slate-600 mb-10 text-lg max-w-md mx-auto leading-relaxed">
            Set up in 2 minutes. Free up to 3 clients. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 text-base transition-all duration-200 shadow-md shadow-indigo-600/20"
            >
              Start monitoring free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-8 py-4 text-base transition-all duration-200"
            >
              Already have an account
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                Corpo<span className="text-indigo-600">zort</span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">
              © 2026 Corpozort. Built for agencies that care.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: "#features", label: "Features" },
                { href: "#pricing", label: "Pricing" },
                { href: "/login", label: "Sign in" },
                { href: "/onboarding", label: "Get started" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

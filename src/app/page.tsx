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

// ─── UTILITY ────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────

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

// ─── SECTION FADE IN ─────────────────────────────────────────────────────────

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

// ─── LIVE FEED TICKER ────────────────────────────────────────────────────────

const feedEvents = [
  { msg: "GA4 synced — Acme Corp", color: "emerald", pulse: false },
  { msg: "Meta Ads degraded — Beta Agency", color: "amber", pulse: true },
  { msg: "Report opened — Gamma Inc", color: "indigo", pulse: false },
  { msg: "↓ 34% sessions detected — Acme Corp", color: "red", pulse: true },
  { msg: "Google Ads reconnected — Delta Co", color: "emerald", pulse: false },
  { msg: "Report opened — Echo Ltd", color: "indigo", pulse: false },
  { msg: "Search Console synced — Foxtrot", color: "emerald", pulse: false },
  { msg: "Anomaly resolved — Golf Media", color: "emerald", pulse: false },
];

const colorClasses = {
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  amber: { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  indigo: { badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", dot: "bg-indigo-400" },
  red: { badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400" },
};

function LiveFeedTicker() {
  const doubled = [...feedEvents, ...feedEvents];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-3 bg-[#060614]">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060614] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060614] to-transparent z-10 pointer-events-none" />
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

// ─── HERO WORD REVEAL ────────────────────────────────────────────────────────

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
          "bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"
      )}
      style={{ transitionDelay: `${i * 20}ms` }}
    >
      {text}
    </span>
  );

  return (
    <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] font-bold leading-[1.08] tracking-[-0.03em] text-white mb-7">
      <span className="block">{line1.map((w, i) => word(w, i < v1, i))}</span>
      <span className="block">{line2.map((w, i) => word(w, i < v2, i))}</span>
      <span className="block">{accent.map((w, i) => word(w, i < va, i, true))}</span>
    </h1>
  );
}

// ─── DASHBOARD MOCKUP ────────────────────────────────────────────────────────

function DashboardMockup() {
  const clients = [
    { name: "Acme Corp", platform: "GA4", status: "healthy", change: "+12%" },
    { name: "Beta Agency", platform: "Meta Ads", status: "degraded", change: "-" },
    { name: "Gamma Inc", platform: "Google Ads", status: "broken", change: "-" },
    { name: "Delta Co", platform: "Search Console", status: "healthy", change: "+4%" },
  ];

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0c0c20] overflow-hidden shadow-[0_40px_120px_-20px_rgba(99,102,241,0.25)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/[0.06] rounded-md px-4 py-1 text-[11px] text-white/30 flex items-center gap-1.5">
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
            <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/40">{s.label}</p>
                <s.icon className={cn("h-3 w-3", s.alert ? "text-red-400" : "text-white/20")} />
              </div>
              <p className={cn("text-xl font-bold", s.alert ? "text-red-400" : "text-white")}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Health table */}
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-white/50">Integration Health</p>
            <span className="text-[10px] text-white/25 flex items-center gap-1">
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
                        : "bg-red-500 animate-pulse"
                    )}
                  />
                  <span className="text-[12px] text-white/70">{c.name}</span>
                  <span className="text-[10px] text-white/25">{c.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.change !== "-" && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="h-2.5 w-2.5" /> {c.change}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      c.status === "healthy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : c.status === "degraded"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-red-500/10 text-red-400"
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
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#060614] to-transparent pointer-events-none" />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

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
            ? "bg-[#060614]/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              Corpo<span className="text-indigo-400">zort</span>
            </span>
            <span className="relative flex h-2 w-2 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 transition-all duration-150 active:scale-[0.97] shadow-lg shadow-indigo-500/20"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            className="md:hidden text-white/60 hover:text-white"
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
            className="fixed top-16 left-0 right-0 z-40 bg-[#060614]/95 backdrop-blur-xl border-b border-white/[0.06] px-6 py-6 flex flex-col gap-4 md:hidden"
          >
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-white/60 hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {item}
              </a>
            ))}
            <hr className="border-white/[0.06]" />
            <Link href="/login" className="text-sm text-white/60">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────

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
    color: "indigo",
    title: "You find out when they do",
    body: "The client screenshots the broken dashboard and DMs you. No warning. No heads-up. Just damage.",
    tag: null,
  },
];

const solutions = [
  {
    icon: Bell,
    color: "indigo",
    title: "Proactive health alerts",
    body: "Know the moment an integration breaks — before reports fail, before clients notice, before it's a problem.",
  },
  {
    icon: Eye,
    color: "emerald",
    title: "Report engagement tracking",
    body: "See exactly when clients open reports, which sections they read, and how long they spend.",
  },
  {
    icon: Activity,
    color: "violet",
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

// ─── FAQ COMPONENT ───────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-medium text-white/80">{faq.q}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-white/30 transition-transform duration-200 shrink-0 ml-4",
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
                <p className="px-5 pb-4 text-sm text-white/40 leading-relaxed">
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

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function RootPage() {
  return (
    <div className="bg-[#060614] text-white">
      <Nav />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[900px] rounded-full bg-indigo-600/[0.15] blur-[130px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/[0.1] blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.1] px-4 py-1.5 mb-10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-white/60">
              Live monitoring for marketing agencies
            </span>
          </motion.div>

          <HeroHeadline />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
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
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-7 py-3.5 text-base transition-all duration-200 active:scale-[0.97] shadow-xl shadow-indigo-500/25"
            >
              Start monitoring free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-white font-medium px-7 py-3.5 text-base transition-all duration-200 backdrop-blur-sm"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.9 }}
            className="text-xs text-white/25"
          >
            No credit card · Free up to 3 clients · Setup in 2 minutes
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.1 }}
            className="flex flex-wrap items-center justify-center gap-5 mt-10"
          >
            {[
              { icon: Shield, label: "SOC 2 ready" },
              { icon: Clock, label: "6hr sync cycle" },
              { icon: Globe, label: "4 integrations" },
              { icon: Zap, label: "Instant alerts" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-white/25">
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
            <div className="absolute -inset-6 bg-indigo-500/[0.07] rounded-3xl blur-3xl" />
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* ── LIVE TICKER ─────────────────────────────────────────────────── */}
      <LiveFeedTicker />

      {/* ── PROBLEM ─────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-28">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4">
            The problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Agencies lose clients to silent failures
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-base">
            Every competitor shows you broken data after the fact. Corpozort tells you
            before the report fails.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {problems.map((item, i) => {
            const Icon = item.icon;
            const borderColor =
              item.color === "red"
                ? "border-red-500/20"
                : item.color === "amber"
                ? "border-amber-500/20"
                : "border-indigo-500/20";
            const iconBg =
              item.color === "red"
                ? "bg-red-500/10 text-red-400"
                : item.color === "amber"
                ? "bg-amber-500/10 text-amber-400"
                : "bg-indigo-500/10 text-indigo-400";
            return (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className={cn(
                    "rounded-2xl border bg-white/[0.03] p-6 h-full transition-all duration-300 hover:bg-white/[0.05]",
                    borderColor
                  )}
                >
                  {item.tag && (
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-0.5 mb-4">
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
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.body}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ── SOLUTION ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.05] bg-white/[0.02] py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em] mb-4">
              The solution
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Corpozort fixes all three
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {solutions.map((item, i) => {
              const Icon = item.icon;
              const bg =
                item.color === "indigo"
                  ? "bg-indigo-500"
                  : item.color === "emerald"
                  ? "bg-emerald-500"
                  : "bg-violet-500";
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6 h-full hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-300">
                    <div
                      className={cn(
                        "rounded-xl w-10 h-10 flex items-center justify-center mb-4",
                        bg
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.body}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 py-28">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Three steps. Then it runs itself.
          </h2>
        </FadeIn>

        <div className="relative">
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
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold z-10 shadow-lg shadow-indigo-500/30">
                    {item.step}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="text-base font-semibold text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="border-y border-indigo-500/20 bg-indigo-500/[0.06] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: 433, suffix: "K+", label: "Marketing agencies worldwide" },
              { value: 25, suffix: "%", label: "Anomaly detection threshold" },
              { value: 2, suffix: " min", label: "Average setup time" },
            ].map((stat) => (
              <FadeIn key={stat.label}>
                <p className="text-4xl font-bold text-white mb-2">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4">
            From the field
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Agencies that caught it first
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 flex flex-col gap-4 h-full">
                <div className="flex gap-0.5">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <span key={j} className="text-amber-400 text-sm">
                        ★
                      </span>
                    ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.name}</p>
                    <p className="text-[11px] text-white/30">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-y border-white/[0.05] bg-white/[0.02] py-28">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Flat-rate. No per-client penalties.
            </h2>
            <p className="text-white/40 text-base">
              Every competitor charges per client. We don&apos;t.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div
                  className={cn(
                    "rounded-2xl border p-6 flex flex-col transition-all duration-300",
                    plan.highlight
                      ? "border-indigo-500/50 bg-indigo-500/[0.08] shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                      : "border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12]"
                  )}
                >
                  {plan.highlight && (
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-0.5 mb-4 w-fit">
                      Most popular
                    </span>
                  )}
                  <p className="text-sm font-medium text-white/50 mb-1">{plan.name}</p>
                  <p className="text-4xl font-bold text-white mb-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-white/30">/mo</span>
                  </p>
                  <p className="text-sm text-white/35 mb-6">{plan.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle
                          className={cn(
                            "h-4 w-4 shrink-0",
                            plan.highlight ? "text-indigo-400" : "text-white/30"
                          )}
                        />
                        <span className="text-white/60">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={cn(
                      "w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
                      plan.highlight
                        ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/25"
                        : "bg-white/[0.07] text-white hover:bg-white/[0.11] border border-white/[0.08]"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-8 text-center">
            <p className="text-sm text-white/30 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-white/20" />
              14-day free trial on all paid plans · No credit card required · Cancel anytime
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <FadeIn className="text-center mb-12">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Common questions
          </h2>
        </FadeIn>
        <FadeIn>
          <FAQ />
        </FadeIn>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden border-t border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/[0.15] blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <FadeIn className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.1] px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-white/50">
              Join agencies already monitoring
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Stop losing clients to <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              silent failures
            </span>
          </h2>
          <p className="text-white/40 mb-10 text-lg max-w-md mx-auto">
            Set up in 2 minutes. Free up to 3 clients. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 text-base transition-all duration-200 shadow-2xl shadow-indigo-500/25 active:scale-[0.97]"
            >
              Start monitoring free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium px-8 py-4 text-base transition-all duration-200"
            >
              Already have an account
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                Corpo<span className="text-indigo-400">zort</span>
              </span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-xs text-white/20">
              © 2026 Corpozort. Built for agencies that care.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: "#features", label: "Features" },
                { href: "#pricing", label: "Pricing" },
                { href: "/login", label: "Sign in" },
                { href: "/signup", label: "Sign up" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs text-white/25 hover:text-white/60 transition-colors"
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

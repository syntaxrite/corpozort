"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Eye } from "lucide-react";

const words = ["Know", "when", "your", "clients'", "campaigns", "break"];
const accentWords = ["before", "they", "do."];

function WordReveal() {
  const [visible, setVisible] = useState(0);
  const [accentVisible, setAccentVisible] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    words.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 100 + i * 90));
    });
    accentWords.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setAccentVisible(i + 1),
          100 + words.length * 90 + 400 + i * 100
        )
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-6">
      <span className="block mb-2">
        {words.map((word, i) => (
          <span
            key={i}
            className={`inline-block mr-[0.25em] transition-all duration-500 ${
              i < visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="block">
        {accentWords.map((word, i) => (
          <span
            key={i}
            className={`inline-block mr-[0.25em] transition-all duration-500 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent ${
              i < accentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/20 blur-[120px]" />
        {/* Secondary orb */}
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Noise grain */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-10 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-white/70">
            Live monitoring for marketing agencies
          </span>
        </motion.div>

        {/* Headline */}
        <WordReveal />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Corpozort monitors your clients&apos; marketing integrations in real
          time. Get proactive alerts before campaigns break, before reports
          fail, and before your client finds out first.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 text-base transition-all duration-200 active:scale-[0.98] shadow-lg shadow-indigo-500/25"
          >
            Start monitoring free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 text-base transition-all duration-200 backdrop-blur-sm"
          >
            Sign in
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="text-xs text-white/30"
        >
          No credit card required · Free up to 3 clients · Setup in 2 minutes
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          {[
            { icon: Shield, label: "SOC 2 ready" },
            { icon: Zap, label: "6hr sync cycle" },
            { icon: Eye, label: "Engagement tracking" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-white/30"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
          className="mt-16 relative"
        >
          {/* Glow behind mockup */}
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-2xl" />

          {/* Mockup container */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/10 rounded-md px-4 py-1 text-xs text-white/40">
                  corpozort.tech/dashboard
                </div>
              </div>
            </div>

            {/* Fake dashboard content */}
            <div className="p-6 bg-[#0a0a1a]">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Clients", value: "24" },
                  { label: "Reports sent", value: "186" },
                  { label: "Integrations", value: "71" },
                  { label: "Alerts", value: "2", alert: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/5 border border-white/10 p-3"
                  >
                    <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                    <p
                      className={`text-xl font-bold ${
                        stat.alert ? "text-red-400" : "text-white"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Health grid */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold text-white/50 mb-3">
                  Integration Health
                </p>
                <div className="space-y-2">
                  {[
                    { name: "Acme Corp", platform: "GA4", status: "healthy" },
                    { name: "Beta Agency", platform: "Meta Ads", status: "degraded" },
                    { name: "Gamma Inc", platform: "Google Ads", status: "broken" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            item.status === "healthy"
                              ? "bg-emerald-500"
                              : item.status === "degraded"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-red-500 animate-pulse"
                          }`}
                        />
                        <span className="text-xs text-white/70">
                          {item.name}
                        </span>
                        <span className="text-xs text-white/30">
                          {item.platform}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === "healthy"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : item.status === "degraded"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent rounded-b-2xl" />
        </motion.div>
      </div>

      {/* Bottom gradient transition to white */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
                    }

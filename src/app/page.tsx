import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Ticker } from "@/components/landing/ticker";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Eye,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Globe,
  Layout,
} from "lucide-react";

export default function RootPage() {
  return (
    <div className="bg-white">
      <LandingNav />
      <Hero />
      <Ticker />

      {/* Problem section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
            The problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Agencies lose clients to silent failures
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every competitor shows you broken data after the fact.
            Corpozort tells you before the report fails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: AlertTriangle,
              color: "red",
              title: "Silent integration failures",
              body: "Your GA4 stops syncing at 2am. Your report sends bad data at 9am. Your client calls at 10am.",
            },
            {
              icon: Eye,
              color: "amber",
              title: "Reports sent into a void",
              body: "You spend 4 hours on a report. You send it. You never know if they read it. Or cared.",
            },
            {
              icon: BarChart3,
              color: "indigo",
              title: "You find out when they do",
              body: "The client screenshots the broken dashboard and sends it to you. You had no warning.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            const colors = {
              red: "bg-red-50 text-red-500 border-red-100",
              amber: "bg-amber-50 text-amber-500 border-amber-100",
              indigo: "bg-indigo-50 text-indigo-500 border-indigo-100",
            };
            return (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`rounded-xl border w-10 h-10 flex items-center justify-center mb-4 ${
                    colors[item.color as keyof typeof colors]
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Solution section */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
              The solution
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Corpozort fixes all three
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: RefreshCw,
                title: "Proactive health alerts",
                body: "Know the moment an integration breaks — before reports fail, before clients notice.",
                color: "indigo",
              },
              {
                icon: Eye,
                title: "Report engagement tracking",
                body: "See exactly when clients open reports, how long they spend, and what they focus on.",
                color: "emerald",
              },
              {
                icon: BarChart3,
                title: "Anomaly detection",
                body: "Daily metric comparison alerts you to unusual spikes or drops before your client does.",
                color: "violet",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const colors = {
                indigo: "bg-indigo-600",
                emerald: "bg-emerald-600",
                violet: "bg-violet-600",
              };
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`rounded-xl w-10 h-10 flex items-center justify-center mb-4 ${
                      colors[item.color as keyof typeof colors]
                    }`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Three steps. Then it runs itself.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-200 hidden sm:block" />

          <div className="space-y-10">
            {[
              {
                step: "01",
                title: "Connect your integrations",
                body: "Link GA4, Google Ads, Meta Ads, and Search Console via OAuth. Takes under 2 minutes per client.",
              },
              {
                step: "02",
                title: "Corpozort monitors 24/7",
                body: "Every 6 hours, Corpozort syncs all client data, checks health status, and runs anomaly detection.",
              },
              {
                step: "03",
                title: "You get alerted. Client never knows.",
                body: "When something breaks or spikes, you know first. Fix it before the report sends. Look like a hero.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 relative">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold z-10">
                  {item.step}
                </div>
                <div className="pt-2.5">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            {[
              { value: "433K+", label: "Marketing agencies worldwide" },
              { value: "25%", label: "Anomaly detection threshold" },
              { value: "2 min", label: "Average setup time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-indigo-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Flat-rate. No per-client penalties.
          </h2>
          <p className="text-gray-500">
            Every competitor charges per client. We don&apos;t.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              name: "Free",
              price: "$0",
              description: "For solo freelancers",
              features: ["3 clients", "2 integrations", "Manual reports", "Corpozort branding"],
              cta: "Get started",
              highlighted: false,
            },
            {
              name: "Starter",
              price: "$49",
              description: "For growing agencies",
              features: ["15 clients", "All integrations", "White-labeling", "Scheduled delivery", "Global templates"],
              cta: "Start free trial",
              highlighted: true,
            },
            {
              name: "Growth",
              price: "$99",
              description: "For established agencies",
              features: ["Unlimited clients", "Everything in Starter", "Anomaly alerts", "Engagement tracking", "Live dashboards"],
              cta: "Start free trial",
              highlighted: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block text-xs font-semibold bg-white/20 text-white rounded-full px-3 py-1 mb-4 w-fit">
                  Most popular
                </span>
              )}
              <p
                className={`text-sm font-semibold mb-1 ${
                  plan.highlighted ? "text-indigo-100" : "text-gray-500"
                }`}
              >
                {plan.name}
              </p>
              <p
                className={`text-4xl font-bold mb-1 ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.price}
                <span
                  className={`text-sm font-normal ${
                    plan.highlighted ? "text-indigo-200" : "text-gray-400"
                  }`}
                >
                  /mo
                </span>
              </p>
              <p
                className={`text-sm mb-6 ${
                  plan.highlighted ? "text-indigo-200" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle
                      className={`h-4 w-4 shrink-0 ${
                        plan.highlighted ? "text-indigo-200" : "text-indigo-500"
                      }`}
                    />
                    <span
                      className={
                        plan.highlighted ? "text-indigo-100" : "text-gray-600"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
                  plan.highlighted
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#030712] py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop losing clients to silent failures
          </h2>
          <p className="text-white/50 mb-10 text-lg">
            Set up in 2 minutes. Free up to 3 clients. No credit card required.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 text-base transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Start monitoring free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030712] border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">
              Corpo<span className="text-indigo-400">zort</span>
            </span>
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-white/30">
            © 2026 Corpozort. Built for agencies that care.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

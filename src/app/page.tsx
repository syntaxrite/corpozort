import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BarChart3,
  Eye,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          Corpo<span className="text-indigo-600">zort</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started →</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-medium text-indigo-700">
            Built for marketing agencies
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          Know when your clients&apos;
          <br />
          <span className="text-indigo-600">campaigns break</span>
          <br />
          before they do
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Corpozort monitors your clients&apos; marketing integrations in real
          time, alerts you the moment something fails, and automatically
          generates white-labeled reports — so you never lose a client to a
          silent data outage again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Sign in
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          No credit card required · Free up to 3 clients
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className="rounded-xl bg-red-50 w-10 h-10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Proactive failure alerts
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Get notified the moment a GA4, Google Ads, or Meta integration
              breaks — before scheduled reports fail and before your client
              notices.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className="rounded-xl bg-indigo-50 w-10 h-10 flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Anomaly detection
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Corpozort spots unusual spikes or drops in your clients&apos;
              metrics daily — so you can address issues before the client brings
              them up.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className="rounded-xl bg-emerald-50 w-10 h-10 flex items-center justify-center mb-4">
              <Eye className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Report engagement tracking
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              See exactly when clients open your reports, how long they spend on
              each section, and how many times they return — no more sending
              into a void.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof / trust */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Built for agencies tired of firefighting
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            AgencyAnalytics, Whatagraph, and DashThis all show you broken data
            after the fact. Corpozort tells you before the report fails, before
            the client calls, and before the retainer is at risk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            {[
              "White-labeled reports",
              "Flat-rate pricing",
              "Global template management",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to stop losing clients to silent failures?
        </h2>
        <p className="text-gray-500 mb-8">
          Set up in minutes. Connect your first integration in under 2 minutes.
        </p>
        <Link href="/signup">
          <Button size="lg">
            Get started free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            Corpo<span className="text-indigo-600">zort</span>
          </span>
          <p className="text-xs text-gray-400">
            © 2026 Corpozort. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

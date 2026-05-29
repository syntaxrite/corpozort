"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Building2, Users, Plug, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";

const steps = [
  { id: 1, label: "Your Agency", icon: Building2 },
  { id: 2, label: "First Client", icon: Users },
  { id: 3, label: "Connect Data", icon: Plug },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [agencyName, setAgencyName] = useState("");

  // Step 2
  const [clientName, setClientName] = useState("");

  async function handleStep1() {
    if (!agencyName.trim()) return;
    setLoading(true);
    try {
      await authClient.organization.create({
        name: agencyName,
        slug: agencyName.toLowerCase().replace(/\s+/g, "-"),
      });
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleStep2() {
    setStep(3);
  }

  function handleFinish() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Corpo<span className="text-indigo-600">zort</span>
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold transition-colors ${
                  step > s.id
                    ? "bg-indigo-600 text-white"
                    : step === s.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  s.id
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-8 transition-colors ${
                    step > s.id ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Name your agency
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              This is how your workspace will be identified.
            </p>
            <div className="space-y-4">
              <Input
                id="agency"
                label="Agency name"
                placeholder="Acme Marketing"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleStep1}
                loading={loading}
                disabled={!agencyName.trim()}
              >
                Continue →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Add your first client
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              You can add more clients any time from your dashboard.
            </p>
            <div className="space-y-4">
              <Input
                id="client"
                label="Client name"
                placeholder="Client Co."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleStep2}
                disabled={!clientName.trim()}
              >
                Continue →
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-500"
                onClick={() => setStep(3)}
              >
                Skip for now
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Connect your first integration
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Corpozort monitors these in real time and alerts you before
              anything breaks.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { name: "Google Analytics 4", color: "#E37400" },
                { name: "Google Ads", color: "#4285F4" },
                { name: "Meta Ads", color: "#0866FF" },
                { name: "Search Console", color: "#34A853" },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="flex flex-col items-center justify-center rounded-xl border border-gray-200 p-4 text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <div
                    className="h-3 w-3 rounded-full mb-2"
                    style={{ backgroundColor: integration.color }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {integration.name}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleFinish}>
              Go to dashboard →
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-500 mt-2"
              onClick={handleFinish}
            >
              Skip for now
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
                }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Building2, Users, Plug, CheckCircle, Plus } from "lucide-react";
import { authClient } from "@/lib/auth/client";

const steps = [
  { id: 1, label: "Your Agency", icon: Building2 },
  { id: 2, label: "First Client", icon: Users },
  { id: 3, label: "Connect Data", icon: Plug },
];

interface Organization {
  id: string;
  name: string;
  slug: string;
  metadata?: Record<string, unknown>;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agencies, setAgencies] = useState<Organization[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);

  // Step 1 states
  const [agencyName, setAgencyName] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Step 2
  const [clientName, setClientName] = useState("");

  // Fetch existing agencies on mount
  useEffect(() => {
    async function fetchAgencies() {
      try {
        setLoadingAgencies(true);
        const { data } = await authClient.organization.list();
        if (Array.isArray(data)) {
          setAgencies(data as Organization[]);
        }
      } catch (e) {
        console.error("Failed to fetch agencies:", e);
      } finally {
        setLoadingAgencies(false);
      }
    }

    fetchAgencies();
  }, []);

  async function handleCreateAgency() {
    if (!agencyName.trim()) return;
    setError("");
    setLoading(true);

    try {
      const slug = agencyName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const { data, error: createError } = await authClient.organization.create({
        name: agencyName.trim(),
        slug: `${slug}-${Date.now()}`,
      });

      if (createError) {
        setError("Could not create agency. Try a different name.");
        setLoading(false);
        return;
      }

      if (data) {
        setSelectedAgencyId((data as Organization).id);
        setStep(2);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectAgency(agencyId: string) {
    setSelectedAgencyId(agencyId);
    setStep(2);
  }

  function handleStep2() {
    // Client creation wired to DB in Week 3
    // For now advance to step 3
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

        {/* Step 1 — Select or Create Agency */}
        {step === 1 && (
          <Card>
            {!isCreating ? (
              <>
                {agencies.length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Select your agency
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Choose an existing agency or create a new one.
                    </p>
                    <div className="space-y-3 mb-6">
                      {agencies.map((agency) => (
                        <button
                          key={agency.id}
                          onClick={() => handleSelectAgency(agency.id)}
                          className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                        >
                          <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">{agency.name}</p>
                            <p className="text-sm text-gray-500">{agency.slug}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-gray-700 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Create new agency
                    </button>
                  </>
                )}

                {agencies.length === 0 && !loadingAgencies && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Create your first agency
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Start monitoring your clients&apos; marketing in minutes.
                    </p>
                    <div className="space-y-4">
                      <Input
                        id="agency"
                        label="Agency name"
                        placeholder="Acme Marketing"
                        value={agencyName}
                        onChange={(e) => {
                          setAgencyName(e.target.value);
                          setError("");
                        }}
                        error={error}
                        autoFocus
                      />
                      <Button
                        className="w-full"
                        onClick={handleCreateAgency}
                        loading={loading}
                        disabled={!agencyName.trim()}
                      >
                        Create agency →
                      </Button>
                    </div>
                  </>
                )}

                {loadingAgencies && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading your agencies...</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Create a new agency
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Give your new workspace a name.
                </p>
                <div className="space-y-4">
                  <Input
                    id="agency"
                    label="Agency name"
                    placeholder="Acme Marketing"
                    value={agencyName}
                    onChange={(e) => {
                      setAgencyName(e.target.value);
                      setError("");
                    }}
                    error={error}
                    autoFocus
                  />
                  <Button
                    className="w-full"
                    onClick={handleCreateAgency}
                    loading={loading}
                    disabled={!agencyName.trim()}
                  >
                    Create agency →
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500"
                    onClick={() => {
                      setIsCreating(false);
                      setAgencyName("");
                      setError("");
                    }}
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Step 2 — First client */}
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
                autoFocus
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

        {/* Step 3 — Connect integration */}
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

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, GripVertical, Trash2, Send } from "lucide-react";

type BlockType = "metric" | "chart" | "text" | "divider";

interface Block {
  id: string;
  type: BlockType;
  config: Record<string, string>;
}

const blockOptions: { type: BlockType; label: string; description: string }[] = [
  { type: "metric", label: "Metric", description: "Single KPI with trend" },
  { type: "chart", label: "Chart", description: "Line or bar chart" },
  { type: "text", label: "Text", description: "Commentary or heading" },
  { type: "divider", label: "Divider", description: "Visual separator" },
];

function NewReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client") ?? "";

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);

  function addBlock(type: BlockType) {
    setBlocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type, config: {} },
    ]);
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  async function handleSave(status: "draft" | "sent") {
    if (!title.trim()) return;
    setSaving(true);
    // DB call + Inngest trigger goes here in Week 6
    setTimeout(() => {
      setSaving(false);
      router.push("/dashboard/reports");
    }, 800);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/reports"
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">New Report</h1>
            <p className="text-xs text-gray-500">Build and send to client</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave("draft")}
            loading={saving}
          >
            Save draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("sent")}
            loading={saving}
            disabled={!title.trim() || blocks.length === 0}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Send report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Settings + Block picker */}
        <div className="space-y-4">
          {/* Report settings */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Report settings
            </h3>
            <div className="space-y-3">
              <Input
                id="title"
                label="Report title"
                placeholder="Acme Corp — May 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Client
                </label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select client</option>
                  <option value="1">Acme Corp</option>
                  <option value="2">Beta Agency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date range
                </label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Last 30 days</option>
                  <option>Last month</option>
                  <option>Last quarter</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Block picker */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Add blocks
            </h3>
            <div className="space-y-2">
              {blockOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => addBlock(option.type)}
                  className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-left hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — Preview */}
        <div className="lg:col-span-2">
          <Card className="min-h-96">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
              {title && (
                <span className="text-xs text-gray-500">{title}</span>
              )}
            </div>

            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No blocks yet
                </p>
                <p className="text-xs text-gray-500">
                  Add blocks from the left panel to build your report
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="flex items-start gap-2 group"
                  >
                    <button className="mt-2 text-gray-300 hover:text-gray-500 cursor-grab">
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <div className="flex-1 rounded-lg border border-gray-200 p-4 bg-white">
                      {block.type === "metric" && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Metric</p>
                          <p className="text-2xl font-bold text-gray-900">
                            —
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Connected to data source
                          </p>
                        </div>
                      )}
                      {block.type === "chart" && (
                        <div className="h-24 flex items-center justify-center bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-400">
                            Chart will render here
                          </p>
                        </div>
                      )}
                      {block.type === "text" && (
                        <textarea
                          className="w-full text-sm text-gray-700 resize-none focus:outline-none bg-transparent"
                          placeholder="Add commentary..."
                          rows={3}
                        />
                      )}
                      {block.type === "divider" && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="mt-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading...</div>}>
      <NewReportContent />
    </Suspense>
  );
}

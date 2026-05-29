"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Layout, Plus, Globe, FileText, Pencil } from "lucide-react";

const mockTemplates = [
  {
    id: "1",
    name: "Monthly Performance",
    isGlobal: true,
    clientCount: 12,
    lastEdited: "Today",
  },
  {
    id: "2",
    name: "Ecommerce Report",
    isGlobal: false,
    clientCount: 3,
    lastEdited: "May 1",
  },
  {
    id: "3",
    name: "SEO Monthly",
    isGlobal: false,
    clientCount: 5,
    lastEdited: "Apr 20",
  },
];

export default function TemplatesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);

  const globalTemplates = mockTemplates.filter((t) => t.isGlobal);
  const customTemplates = mockTemplates.filter((t) => !t.isGlobal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500">
            Global templates apply to all clients at once
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New template
        </Button>
      </div>

      {/* Global templates */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-semibold text-gray-700">
            Global templates
          </h2>
          <span className="text-xs text-gray-400">
            — changes apply to all clients
          </span>
        </div>
        {globalTemplates.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-400 text-center py-4">
              No global templates yet.
            </p>
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-gray-100">
              {globalTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2">
                      <Globe className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Used by {template.clientCount} clients · Last edited{" "}
                        {template.lastEdited}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Custom templates */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">
            Custom templates
          </h2>
        </div>
        {customTemplates.length === 0 ? (
          <EmptyState
            icon={Layout}
            title="No custom templates"
            description="Create templates for specific client types or campaign structures."
            action={{ label: "New template", onClick: () => setShowAdd(true) }}
          />
        ) : (
          <Card padding="none">
            <div className="divide-y divide-gray-100">
              {customTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Used by {template.clientCount} clients · Last edited{" "}
                        {template.lastEdited}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Add template modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="New template"
        description="Create a reusable report template."
      >
        <div className="space-y-4">
          <Input
            id="templateName"
            label="Template name"
            placeholder="Monthly Performance"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <div
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsGlobal(!isGlobal)}
          >
            <div
              className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                isGlobal
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-gray-300"
              }`}
            >
              {isGlobal && (
                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10">
                  <path
                    d="M1.5 5l2.5 2.5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Make global
              </p>
              <p className="text-xs text-gray-500">
                Changes to this template will apply to all clients using it
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!templateName.trim()}
            >
              Create template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
        }

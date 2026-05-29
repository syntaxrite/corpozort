"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Users, Plus, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

const mockClients = [
  {
    id: "1",
    name: "Acme Corp",
    integrationCount: 3,
    worstStatus: "healthy" as const,
    lastReportDate: "May 1",
  },
  {
    id: "2",
    name: "Beta Agency",
    integrationCount: 2,
    worstStatus: "degraded" as const,
    lastReportDate: "Apr 15",
  },
  {
    id: "3",
    name: "Gamma Inc",
    integrationCount: 1,
    worstStatus: "broken" as const,
    lastReportDate: null,
  },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddClient() {
    if (!clientName.trim()) return;
    setLoading(true);
    // DB call goes here in Week 3
    setTimeout(() => {
      setLoading(false);
      setShowAdd(false);
      setClientName("");
    }, 800);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">
            {mockClients.length} client{mockClients.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add client
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Client list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add your first client to start monitoring their marketing integrations."
          action={{ label: "Add client", onClick: () => setShowAdd(true) }}
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {filtered.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-indigo-700">
                      {client.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.integrationCount} integration
                      {client.integrationCount !== 1 ? "s" : ""}
                      {client.lastReportDate
                        ? ` · Last report ${client.lastReportDate}`
                        : " · No reports yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={client.worstStatus}>
                    {client.worstStatus.charAt(0).toUpperCase() +
                      client.worstStatus.slice(1)}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Add client modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add client"
        description="Add a new client to your workspace."
      >
        <div className="space-y-4">
          <Input
            id="clientName"
            label="Client name"
            placeholder="Acme Corp"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
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
              onClick={handleAddClient}
              loading={loading}
              disabled={!clientName.trim()}
            >
              Add client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

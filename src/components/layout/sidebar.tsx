"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Plug,
  FileText,
  Layout,
  LogOut,
  Plus,
} from "lucide-react";
import { signOut, useSession, authClient } from "@/lib/auth/client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Templates", href: "/dashboard/templates", icon: Layout },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [showNewOrg, setShowNewOrg] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  async function handleCreateOrg() {
    if (!orgName.trim()) return;
    setError("");
    setLoading(true);

    try {
      const slug = `${orgName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;

      const { error } = await authClient.organization.create({
        name: orgName.trim(),
        slug,
      });

      if (error) {
        setError("Could not create workspace. Try a different name.");
        setLoading(false);
        return;
      }

      setShowNewOrg(false);
      setOrgName("");
      router.refresh();
    } catch (e) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-200 px-3 py-5">
        {/* Logo */}
        <div className="px-3 mb-2">
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Corpo<span className="text-indigo-600">zort</span>
          </span>
        </div>

        {/* Org name */}
        {session && (
          <div className="px-3 mb-6">
            <p className="text-xs text-gray-400 truncate">
              {session.user.name}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-indigo-600" : "text-gray-400"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-0.5 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowNewOrg(true)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
          >
            <Plus className="h-4 w-4 text-gray-400" />
            New workspace
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 text-gray-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* New workspace modal */}
      <Modal
        open={showNewOrg}
        onClose={() => {
          setShowNewOrg(false);
          setOrgName("");
          setError("");
        }}
        title="New workspace"
        description="Create a new agency workspace."
      >
        <div className="space-y-4">
          <Input
            id="orgName"
            label="Agency name"
            placeholder="Acme Marketing"
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
              setError("");
            }}
            error={error}
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowNewOrg(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateOrg}
              loading={loading}
              disabled={!orgName.trim()}
            >
              Create workspace
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

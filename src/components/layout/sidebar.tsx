"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Plug,
  FileText,
  Layout,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    label: "Integrations",
    href: "/dashboard/integrations",
    icon: Plug,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    label: "Templates",
    href: "/dashboard/templates",
    icon: Layout,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-200 px-3 py-5">
      {/* Logo */}
      <div className="px-3 mb-8">
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          Corpo<span className="text-indigo-600">zort</span>
        </span>
      </div>

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

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
      >
        <LogOut className="h-4 w-4 text-gray-400" />
        Sign out
      </button>
    </aside>
  );
}

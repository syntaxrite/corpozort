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
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Templates", href: "/dashboard/templates", icon: Layout },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2 safe-area-pb">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-0",
              isActive ? "text-indigo-600" : "text-gray-400"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium truncate">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

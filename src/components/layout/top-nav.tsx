"use client";

import { useSession } from "@/lib/auth/client";

export function TopNav() {
  const { data: session } = useSession();

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {session?.user?.name ?? "Loading..."}
          </p>
          <p className="text-xs text-gray-500">
            {session?.user?.email ?? ""}
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-xs font-semibold text-indigo-700">
            {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
          </span>
        </div>
      </div>
    </header>
  );
}

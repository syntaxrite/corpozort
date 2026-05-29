import { cn } from "@/lib/utils";
import type { IntegrationStatus, ReportStatus } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "healthy" | "degraded" | "broken" | "sent" | "draft" | "scheduled" | "default";
}

const variants = {
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  degraded: "bg-amber-50 text-amber-700 border-amber-200",
  broken: "bg-red-50 text-red-700 border-red-200",
  sent: "bg-indigo-50 text-indigo-700 border-indigo-200",
  draft: "bg-gray-50 text-gray-600 border-gray-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-gray-50 text-gray-600 border-gray-200",
};

const dots = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500 animate-pulse",
  broken: "bg-red-500 animate-pulse",
  sent: "bg-indigo-500",
  draft: "bg-gray-400",
  scheduled: "bg-blue-500",
  default: "bg-gray-400",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[variant])} />
      {children}
    </span>
  );
}

// Convenience wrappers
export function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const labels = {
    healthy: "Healthy",
    degraded: "Degraded",
    broken: "Broken",
  };
  return <Badge variant={status}>{labels[status]}</Badge>;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const labels = {
    draft: "Draft",
    scheduled: "Scheduled",
    sent: "Sent",
  };
  return <Badge variant={status}>{labels[status]}</Badge>;
}

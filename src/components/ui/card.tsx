import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg" | "none";
}

export function Card({
  className,
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-sm font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

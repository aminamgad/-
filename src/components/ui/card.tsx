import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]",
        className,
      )}
      {...props}
    />
  );
}

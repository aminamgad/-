import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AppointmentFilter } from "@/lib/appointment-filters";

type Props = {
  current: AppointmentFilter;
  /** مثال: `/dashboard` أو `/dashboard/appointments` */
  basePath: string;
};

const tabs: { filter: AppointmentFilter; label: string }[] = [
  { filter: "all", label: "الكل" },
  { filter: "upcoming", label: "قادمة" },
  { filter: "past", label: "سابقة" },
];

export function AppointmentFilterLinks({ current, basePath }: Props) {
  const path = basePath.replace(/\/$/, "");

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="فلترة المواعيد">
      {tabs.map(({ filter, label }) => {
        const href =
          filter === "all" ? path : `${path}?filter=${filter}`;
        const active = current === filter;
        return (
          <Link
            key={filter}
            href={href}
            scroll={false}
            role="tab"
            aria-selected={active}
            className={cn(
              "inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

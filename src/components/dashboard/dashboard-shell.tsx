"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "المواعيد", icon: CalendarDays },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export function DashboardShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const open = useUiStore((s) => s.dashboardSidebarOpen);
  const setOpen = useUiStore((s) => s.setDashboardSidebarOpen);

  return (
    <div className="flex min-h-full bg-muted/30">
      <div
        className={cn(
          "fixed inset-0 z-40 cursor-pointer bg-black/40 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex w-[min(100%,18rem)] flex-col border border-border/80 bg-card shadow-xl transition-transform duration-300 ease-out md:static md:z-0 md:w-64 md:translate-x-0 md:border-0 md:bg-transparent md:shadow-none",
          "end-0",
          open ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border/80 bg-card px-4 md:rounded-none md:border-0 md:bg-transparent">
          <Link href="/" className="flex flex-1 items-center gap-2 font-heading text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            ميدنوفا
          </Link>
        </div>
        <nav
          className="flex flex-1 flex-col gap-1 bg-card p-3 md:bg-transparent"
          aria-label="لوحة التحكم"
        >
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/80 bg-card p-4 md:bg-transparent">
          <p className="truncate text-sm text-muted-foreground">مرحباً، {userName}</p>
        </div>
      </aside>

      <div className="flex min-h-full flex-1 flex-col md:min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur-xl md:px-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="القائمة"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="flex-1 text-center font-heading text-lg font-bold sm:text-start md:text-xl">
            لوحة التحكم
          </h1>
          <ThemeToggle />
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

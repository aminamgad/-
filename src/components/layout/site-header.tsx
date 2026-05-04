"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Sparkles, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#features", label: "المزايا" },
  { href: "/#doctors", label: "الأطباء" },
  { href: "/#testimonials", label: "آراء المرضى" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const mobileOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/25">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-heading text-xl tracking-tight">ميدنوفا</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-xl px-4 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === "/" && l.href.startsWith("/#") && "hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[10rem] truncate text-sm text-muted-foreground">
                {session.user?.name}
              </span>
              <Button type="button" variant="outline" onClick={() => signOut()}>
                خروج
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="gradient" size="lg" className="gap-2">
                <LogIn className="h-5 w-5" aria-hidden />
                تسجيل الدخول
              </Button>
            </Link>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="فتح القائمة"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.22 }}
        className="overflow-hidden border-t border-border/60 md:hidden"
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="القائمة">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="min-h-12 rounded-xl px-3 py-3 text-base font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {!session && (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="gradient" className="mt-2 w-full" size="lg">
                تسجيل الدخول
              </Button>
            </Link>
          )}
          {session && (
            <Button
              type="button"
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                setMobileOpen(false);
                signOut();
              }}
            >
              خروج
            </Button>
          )}
        </nav>
      </motion.div>
    </header>
  );
}

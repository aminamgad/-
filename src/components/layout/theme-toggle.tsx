"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-hidden className="rounded-xl">
        <span className="h-5 w-5" />
      </Button>
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-xl border-border/80"
      aria-label={dark ? "الوضع الفاتح" : "الوضع الداكن"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
}

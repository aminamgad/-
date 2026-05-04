"use client";

import * as React from "react";

export type ThemeSetting = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
  resolvedTheme: "light" | "dark";
};

const STORAGE_KEY = "theme";

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

function systemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolve(setting: ThemeSetting): "light" | "dark" {
  if (setting === "system") return systemPreference();
  return setting;
}

function applyDom(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeSetting>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light",
  );
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === "light" || raw === "dark" || raw === "system") {
          setThemeState(raw);
        }
      } catch {
        /* ignore */
      }
      setHydrated(true);
    });
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    queueMicrotask(() => {
      const nextResolved = resolve(theme);
      setResolvedTheme(nextResolved);
      applyDom(nextResolved);
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        /* ignore */
      }
    });
  }, [hydrated, theme]);

  React.useEffect(() => {
    if (!hydrated || theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      queueMicrotask(() => {
        const resolved = mq.matches ? "dark" : "light";
        setResolvedTheme(resolved);
        applyDom(resolved);
      });
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hydrated, theme]);

  const setTheme = React.useCallback((next: ThemeSetting) => {
    setThemeState(next);
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme يجب أن يُستخدم داخل ThemeProvider");
  }
  return ctx;
}

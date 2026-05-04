"use client";

import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthSessionProvider>
        {children}
        <Toaster
          dir="rtl"
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "font-sans text-base border border-border/80 shadow-lg backdrop-blur-sm",
            },
          }}
        />
      </AuthSessionProvider>
    </ThemeProvider>
  );
}

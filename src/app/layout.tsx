import type { Metadata } from "next";
import Script from "next/script";
import { Cairo, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

/** يتوافق مع مفتاح التخزين في ThemeProvider — بدون وسم script داخل شجرة React (React 19) */
const THEME_INIT = `(function(){try{var k='theme';var t=localStorage.getItem(k);var d=document.documentElement;var dark;if(t==='dark')dark=true;else if(t==='light')dark=false;else dark=window.matchMedia('(prefers-color-scheme: dark)').matches;d.classList.toggle('dark',dark);d.style.colorScheme=dark?'dark':'light'}catch(e){}})()`;

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "ميدنوفا — صحتك تبدأ من هنا",
  description:
    "منصة رعاية صحية حديثة بتجربة عربية RTL مصممة لمستخدمي الشرق الأوسط.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} ${tajawal.variable} ${ibmPlexArabic.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

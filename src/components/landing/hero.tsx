"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroIllustration } from "@/components/landing/hero-illustration";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/50 pb-20 pt-12 sm:pt-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_end,_rgba(37,99,235,0.12),_transparent_55%)]"
        aria-hidden
      />
      <Container className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            رعاية صحية رقمية — بتجربة عربية أصيلة
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-heading text-4xl font-extrabold leading-[1.15] text-foreground sm:text-5xl lg:text-[3.25rem]"
          >
            صحتك تبدأ{" "}
            <span className="text-gradient">من هنا</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            نوصّلك بأفضل الأطباء، نُدير مواعيدك بذكاء، ونمنحك لوحة تحكم واضحة لمتابعة
            رحلتك الصحية — بتصميم هادئ يشبه أفضل منتجات SaaS العالمية.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link href="/login" className="sm:w-auto">
              <Button variant="gradient" size="lg" className="w-full gap-2 sm:w-auto">
                <CalendarHeart className="h-6 w-6" aria-hidden />
                احجز موعد الآن
              </Button>
            </Link>
            <Link href="/#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                اكتشف المزايا
              </Button>
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
        >
          <HeroIllustration />
        </motion.div>
      </Container>
    </section>
  );
}

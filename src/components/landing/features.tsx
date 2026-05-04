"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BellRing,
  ShieldCheck,
  Stethoscope,
  CalendarClock,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: Stethoscope,
    title: "شبكة أطباء موثوقة",
    desc: "تخصصات متعددة مع ملفات تعريف واضحة وتقييمات شفافة.",
  },
  {
    icon: CalendarClock,
    title: "مواعيد بدون تعقيد",
    desc: "حجز سريع وتذكيرات ذكية توفّر وقتك وتقلّل الفوت.",
  },
  {
    icon: ShieldCheck,
    title: "خصوصية وبيانات آمنة",
    desc: "معايير حماية عالية لبياناتك الصحية والشخصية.",
  },
  {
    icon: BellRing,
    title: "إشعارات لحظية",
    desc: "تنبيهات للمواعيد والتغييرات — بلغة عربية واضحة.",
  },
  {
    icon: MessageCircleHeart,
    title: "متابعة إنسانية",
    desc: "تجربة واجهة هادئة تركّز على راحتك النفسية والبدنية.",
  },
  {
    icon: Sparkles,
    title: "تصميم عصري",
    desc: "حركة سلسة وتفاصيل دقيقة مثل أفضل منصات SaaS العالمية.",
  },
];

export function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            لماذا <span className="text-gradient">ميدنوفا</span>؟
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            منصة واحدة تجمع الجودة الطبية مع تجربة رقمية صُممت للغة العربية واتجاه
            RTL من الأساس.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-glow)]">
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary",
                    "transition-transform duration-300 group-hover:scale-105",
                  )}
                >
                  <item.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

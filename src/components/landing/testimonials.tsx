"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "سارة المطيري",
    role: "أم لطفلين",
    text: "تجربة راقية من البداية للنهاية. المواعيد واضحة والواجهة بالعربي مريحة للعين — أخيراً منصة تحس إنها مصممة لنا.",
  },
  {
    name: "فيصل الدوسري",
    role: "مهندس برمجيات",
    text: "الحركة والتنقل سلس، والإشعارات بالوقت المناسب. يشبه Stripe لكن لصحتي — هدوء وتنظيم.",
  },
  {
    name: "هند البقمي",
    role: "رائدة أعمال",
    text: "احترافية عالية في التفاصيل. التقييمات والتخصصات تفهمينها بسرعة وتختارين الطبيب المناسب بثقة.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();

  const next = useCallback(() => {
    setI((v) => (v + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setI((v) => (v - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next, reduceMotion]);

  const r = reviews[i]!;

  return (
    <section id="testimonials" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">آراء المرضى</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            قصص حقيقية من مستخدمين يقدّرون الوضوح والهدوء في رحلتهم الصحية.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <Card className="relative overflow-hidden p-8 sm:p-12">
            <Quote className="absolute start-6 top-6 h-10 w-10 text-primary/15" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={r.name}
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
              >
                <blockquote className="relative text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                  “{r.text}”
                </blockquote>
                <footer className="mt-8 flex flex-col gap-1 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-bold">{r.name}</p>
                    <p className="text-muted-foreground">{r.role}</p>
                  </div>
                  <div className="flex gap-1" aria-hidden>
                    {reviews.map((_, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "h-2 w-2 rounded-full bg-muted transition-colors",
                          idx === i && "bg-primary w-6",
                        )}
                      />
                    ))}
                  </div>
                </footer>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                aria-label="السابق"
                onClick={prev}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                aria-label="التالي"
                onClick={next}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PublicDoctor } from "@/lib/doctors-public";

export function DoctorCard({ doctor, index }: { doctor: PublicDoctor; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-glow)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold">{doctor.name}</h3>
              <p className="text-sm font-medium text-secondary">{doctor.specialty}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {doctor.rating.toFixed(1)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {doctor.reviewCount}+ تقييم من المرضى
          </p>
          <Link href={`/book?doctor=${doctor.id}`} className="block">
            <Button variant="secondary" className="w-full min-h-12 text-base">
              احجز موعد
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

import { Suspense } from "react";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { DoctorsSection } from "@/components/landing/doctors-section";
import { DoctorsSkeleton } from "@/components/landing/doctors-skeleton";
import { Testimonials } from "@/components/landing/testimonials";
import { getPublicDoctors } from "@/lib/doctors-public";

async function DoctorsBlock() {
  const doctors = await getPublicDoctors();
  return <DoctorsSection doctors={doctors} />;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Suspense fallback={<DoctorsSkeleton />}>
        <DoctorsBlock />
      </Suspense>
      <Testimonials />
    </>
  );
}

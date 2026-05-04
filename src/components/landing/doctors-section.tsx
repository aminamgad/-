import { Container } from "@/components/ui/container";
import { DoctorCard } from "@/components/landing/doctor-card";
import type { PublicDoctor } from "@/lib/doctors-public";

export function DoctorsSection({ doctors }: { doctors: PublicDoctor[] }) {
  return (
    <section id="doctors" className="scroll-mt-24 border-y border-border/60 bg-muted/30 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">أطباؤنا المتميزون</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            فريق طبي يجمع الخبرة العلمية مع التواصل الإنساني — لخدمتك بثقة وهدوء.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d, i) => (
            <DoctorCard key={d.id} doctor={d} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

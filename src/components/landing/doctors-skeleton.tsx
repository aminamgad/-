import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export function DoctorsSkeleton() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto h-6 w-full max-w-lg" />
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((k) => (
            <div key={k} className="overflow-hidden rounded-2xl border border-border/80 bg-card">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

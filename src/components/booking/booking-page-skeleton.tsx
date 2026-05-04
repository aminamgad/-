import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingPageSkeleton() {
  return (
    <Container className="max-w-2xl space-y-8 py-12">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-10 w-48" />
        <Skeleton className="mx-auto h-6 w-full max-w-md" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </Container>
  );
}

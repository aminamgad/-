import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

function LoginFallback() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto h-6 w-full max-w-sm" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </Container>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

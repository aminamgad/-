import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { safeInternalPath } from "@/lib/safe-internal-path";

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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const target = safeInternalPath(sp.callbackUrl, "/dashboard");

  if (session?.user?.id) {
    redirect(target);
  }

  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

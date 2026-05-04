"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("البريد أو كلمة المرور غير صحيحة");
        return;
      }
      toast.success("تم تسجيل الدخول بنجاح");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">
            تسجيل الدخول
          </h1>
          <p className="mt-3 text-muted-foreground">
            أدخل بياناتك للوصول إلى لوحة التحكم والمواعيد.
          </p>
        </div>
        <Card className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              دخول
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </Card>
      </Container>
    </section>
  );
}

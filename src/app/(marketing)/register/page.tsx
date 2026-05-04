"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل التسجيل");
        return;
      }
      toast.success("تم إنشاء الحساب");
      const sign = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (sign?.error) {
        toast.error("تم الإنشاء لكن الدخول فشل — جرّب من صفحة تسجيل الدخول");
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">
            إنشاء حساب
          </h1>
          <p className="mt-3 text-muted-foreground">
            خطوة واحدة تفصلك عن متابعة مواعيدك الصحية بوضوح.
          </p>
        </div>
        <Card className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold">
                الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
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
                كلمة المرور (8 أحرف على الأقل)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
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
                <UserPlus className="h-5 w-5" />
              )}
              تسجيل
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </Card>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LayoutDashboard, Stethoscope, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-full bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:px-8">
        <aside className="shrink-0 md:w-56">
          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              إدارة
            </p>
            <nav className="flex flex-col gap-1">
              <Link
                href="/admin"
                className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                النظرة العامة
              </Link>
              <Link
                href="/admin/doctors"
                className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Stethoscope className="h-4 w-4" />
                الأطباء
              </Link>
              <Link
                href="/"
                className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                <Home className="h-4 w-4" />
                الموقع
              </Link>
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

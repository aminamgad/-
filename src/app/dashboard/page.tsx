import Link from "next/link";
import { auth } from "@/auth";
import { Activity, CalendarCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AppointmentFilterLinks } from "@/components/dashboard/appointment-filter-links";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { ExportAppointmentsCsv } from "@/components/dashboard/export-appointments-csv";
import { getAppointmentsForUser } from "@/lib/appointments-list";
import { getDashboardStatsSlice } from "@/lib/dashboard-stats";
import {
  filterAppointmentsForDashboard,
  parseAppointmentFilter,
} from "@/lib/appointment-filters";

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = parseAppointmentFilter(sp.filter);

  const session = await auth();
  const rows = session?.user?.id
    ? await getAppointmentsForUser(session.user.id)
    : [];

  const { upcoming, past } = getDashboardStatsSlice(rows);

  const stats = [
    {
      label: "إجمالي المواعيد",
      value: rows.length,
      icon: CalendarCheck,
      hint: "كل الجلسات المسجّلة",
    },
    {
      label: "قادمة",
      value: upcoming.length,
      icon: Clock,
      hint: "مواعيد لم تمر بعد",
    },
    {
      label: "مكتملة",
      value: past.filter((r) => r.status === "مكتمل").length,
      icon: Activity,
      hint: "جلسات منتهية",
    },
  ];

  const filtered = filterAppointmentsForDashboard(rows, filter);

  const emptyFilteredHint =
    rows.length > 0 && filtered.length === 0
      ? "لا توجد مواعيد تطابق هذا الفلتر — جرّب «الكل» أو «قادمة»."
      : undefined;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-lg text-muted-foreground">
          نظرة سريعة على مواعيدك ومؤشرات الرعاية.
        </p>
        <Link
          href="/book"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
        >
          احجز موعداً جديداً
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-heading text-4xl font-extrabold tabular-nums text-foreground">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.hint}</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" aria-hidden />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border/80 bg-muted/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold">جدول المواعيد</h2>
            <p className="text-sm text-muted-foreground">
              التواريخ بالتقويم الميلادي بصيغة عربية محلية.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ExportAppointmentsCsv />
          </div>
        </div>
        <div className="border-b border-border/60 px-6 py-4">
          <AppointmentFilterLinks current={filter} basePath="/dashboard" />
        </div>
        <AppointmentsTable
          rows={filtered}
          emptyHint={emptyFilteredHint}
        />
      </Card>
    </div>
  );
}

import { auth } from "@/auth";
import { Activity, CalendarCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAppointmentsForUser } from "@/lib/appointments-list";
import { formatArabicDateTime } from "@/lib/dates";
import { getDashboardStatsSlice } from "@/lib/dashboard-stats";

export default async function DashboardPage() {
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

  return (
    <div className="space-y-10">
      <div>
        <p className="text-lg text-muted-foreground">
          نظرة سريعة على مواعيدك ومؤشرات الرعاية.
        </p>
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
        <div className="border-b border-border/80 bg-muted/40 px-6 py-4">
          <h2 className="font-heading text-xl font-bold">جدول المواعيد</h2>
          <p className="text-sm text-muted-foreground">
            التواريخ بالتقويم الميلادي بصيغة عربية محلية.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-start">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-sm text-muted-foreground">
                <th className="px-6 py-4 font-semibold">الطبيب</th>
                <th className="px-6 py-4 font-semibold">الموعد</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    لا توجد مواعيد بعد. جرّب الحجز من الصفحة الرئيسية بعد تسجيل الدخول.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-6 py-4 font-medium">{r.doctorName}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatArabicDateTime(r.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-secondary/15 px-3 py-1 text-sm font-medium text-secondary">
                        {r.status}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-muted-foreground">
                      {r.notes ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

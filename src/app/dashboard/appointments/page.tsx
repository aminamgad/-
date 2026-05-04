import Link from "next/link";
import { auth } from "@/auth";
import { AppointmentFilterLinks } from "@/components/dashboard/appointment-filter-links";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { ExportAppointmentsCsv } from "@/components/dashboard/export-appointments-csv";
import { Card } from "@/components/ui/card";
import { getAppointmentsForUser } from "@/lib/appointments-list";
import {
  filterAppointmentsForDashboard,
  parseAppointmentFilter,
} from "@/lib/appointment-filters";

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = parseAppointmentFilter(sp.filter);

  const session = await auth();
  const rows = session?.user?.id
    ? await getAppointmentsForUser(session.user.id)
    : [];

  const filtered = filterAppointmentsForDashboard(rows, filter);

  const emptyFilteredHint =
    rows.length > 0 && filtered.length === 0
      ? "لا توجد مواعيد تطابق هذا الفلتر."
      : undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">جميع المواعيد</h2>
          <p className="mt-1 text-muted-foreground">
            عرض وفلترة وتصدير مواعيدك من مكان واحد.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ExportAppointmentsCsv />
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
          >
            حجز جديد
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border/60 px-6 py-4">
          <AppointmentFilterLinks
            current={filter}
            basePath="/dashboard/appointments"
          />
        </div>
        <AppointmentsTable rows={filtered} emptyHint={emptyFilteredHint} />
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="font-semibold text-primary hover:underline">
          العودة للنظرة العامة
        </Link>
      </p>
    </div>
  );
}

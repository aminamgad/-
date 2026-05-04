import Link from "next/link";
import { CancelAppointmentButton } from "@/components/dashboard/cancel-appointment-button";
import { formatArabicDateTime } from "@/lib/dates";
import { canCancelAppointment } from "@/lib/appointment-actions";
import type { AppointmentRow } from "@/lib/appointments-list";

type Props = {
  rows: AppointmentRow[];
  emptyHint?: string;
};

export function AppointmentsTable({ rows, emptyHint }: Props) {
  if (rows.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-muted-foreground">
        {emptyHint ? (
          emptyHint
        ) : (
          <>
            لا توجد مواعيد بعد.{" "}
            <Link href="/book" className="font-semibold text-primary underline">
              احجز موعداً
            </Link>
          </>
        )}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-start">
        <thead>
          <tr className="border-b border-border/80 bg-muted/30 text-sm text-muted-foreground">
            <th className="px-6 py-4 font-semibold">الطبيب</th>
            <th className="px-6 py-4 font-semibold">الموعد</th>
            <th className="px-6 py-4 font-semibold">الحالة</th>
            <th className="px-6 py-4 font-semibold">ملاحظات</th>
            <th className="px-6 py-4 font-semibold">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
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
              <td className="px-6 py-4">
                <CancelAppointmentButton
                  appointmentId={r.id}
                  cancellable={canCancelAppointment(r.date, r.status)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

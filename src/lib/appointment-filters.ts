import type { AppointmentRow } from "@/lib/appointments-list";

export type AppointmentFilter = "all" | "upcoming" | "past";

export function parseAppointmentFilter(
  v: string | null | undefined,
): AppointmentFilter {
  if (v === "upcoming" || v === "past") return v;
  return "all";
}

/** فلترة الجدول — يُستدعى من دوال خادم أو مكتبة فقط (يستخدم التوقيت الحالي داخلياً). */
export function filterAppointmentsForDashboard(
  rows: AppointmentRow[],
  tab: AppointmentFilter,
): AppointmentRow[] {
  const nowMs = Date.now();
  if (tab === "all") return rows;
  if (tab === "upcoming") {
    return rows.filter(
      (r) => new Date(r.date).getTime() >= nowMs && r.status !== "ملغى",
    );
  }
  return rows.filter(
    (r) => new Date(r.date).getTime() < nowMs || r.status === "ملغى",
  );
}

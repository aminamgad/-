import type { AppointmentRow } from "@/lib/appointments-list";

/** الحساب خارج مكوّن React لتجنب قواعد نقاء التصيير (Date.now). */
export function partitionAppointmentsByNow(
  rows: AppointmentRow[],
  nowMs: number,
) {
  const upcoming = rows.filter((r) => new Date(r.date).getTime() >= nowMs);
  const past = rows.filter((r) => new Date(r.date).getTime() < nowMs);
  return { upcoming, past };
}

export function getDashboardStatsSlice(rows: AppointmentRow[]) {
  const nowMs = Date.now();
  return partitionAppointmentsByNow(rows, nowMs);
}

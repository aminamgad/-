/** يحدد إن كان المستخدم قادراً على طلب إلغاء الموعد من الواجهة. */
export function canCancelAppointment(dateIso: string, status: string): boolean {
  if (status === "ملغى" || status === "مكتمل") return false;
  return new Date(dateIso).getTime() > Date.now();
}

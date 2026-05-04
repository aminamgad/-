/**
 * هل يقع بدء الموعد ضمن نافذة التذكير؟
 * مثال: تذكير قبل 24 ساعة مع نافذة ±90 دقيقة يلتقط المواعيد بين ~22.5h و~25.5h من الآن.
 */
export function isInReminderWindow(
  appointmentStart: Date,
  now: Date,
  leadHours: number,
  windowMinutes: number,
): boolean {
  const msUntil = appointmentStart.getTime() - now.getTime();
  if (msUntil <= 0) return false;
  const targetMs = leadHours * 60 * 60 * 1000;
  const windowMs = windowMinutes * 60 * 1000;
  return Math.abs(msUntil - targetMs) <= windowMs;
}

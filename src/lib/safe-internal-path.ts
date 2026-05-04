/** مسار نسبي آمن لإعادة التوجيه بعد تسجيل الدخول (يمنع فتح إعادة توجيه خارجية). */
export function safeInternalPath(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (raw == null || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  const pathOnly = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;
  return pathOnly.length > 0 ? pathOnly : fallback;
}

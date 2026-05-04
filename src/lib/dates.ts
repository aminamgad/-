const ar = "ar-SA";

export function formatArabicDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(ar, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(d);
}

export function formatArabicDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(ar, { dateStyle: "long" }).format(d);
}

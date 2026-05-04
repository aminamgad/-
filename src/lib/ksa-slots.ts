/** توليد بدايات الفترات (٣٠ دقيقة) من 9:00 إلى 16:30 بتوقيت السعودية (UTC+3). */
const SLOT_MS = 30 * 60 * 1000;
const KSA_OFFSET = "+03:00";

export const SLOT_MINUTES = 30;

/** ساعة البداية والنهاية (0–24) — آخر بداية 16:30 */
const START_MIN = 9 * 60;
const END_MIN = 17 * 60;

/**
 * @param dateStr YYYY-MM-DD
 * @returns تواريخ بداية كل فترة (كائن Date)
 */
export function getKsaSlotStartsForDay(dateStr: string): Date[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error("صيغة التاريخ غير صالحة");
  }
  const slots: Date[] = [];
  for (let m = START_MIN; m < END_MIN; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const t = `${String(h).padStart(2, "0")}:${min === 0 ? "00" : "30"}:00`;
    const d = new Date(`${dateStr}T${t}${KSA_OFFSET}`);
    if (Number.isNaN(d.getTime())) {
      throw new Error("تاريخ غير صالح");
    }
    slots.push(d);
  }
  return slots;
}

export function addSlotDuration(start: Date): Date {
  return new Date(start.getTime() + SLOT_MS);
}

export { SLOT_MS };

import { NextResponse } from "next/server";
import { processAppointmentReminders } from "@/lib/process-appointment-reminders";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const header = req.headers.get("x-cron-secret")?.trim();
  const url = new URL(req.url);
  const query = url.searchParams.get("secret")?.trim();

  return (
    bearer === secret ||
    header === secret ||
    query === secret
  );
}

/** استدعاء من مجدول (Vercel Cron) أو يدوياً مع CRON_SECRET */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json(
      { error: "CRON_SECRET غير مُضبوط" },
      { status: 503 },
    );
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }

  try {
    const result = await processAppointmentReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "فشل المعالجة" }, { status: 500 });
  }
}

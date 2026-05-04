import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppointmentsForUser } from "@/lib/appointments-list";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }

  try {
    const rows = await getAppointmentsForUser(session.user.id);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "فشل التحميل" }, { status: 500 });
  }
}

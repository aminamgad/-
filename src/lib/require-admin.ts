import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      session: null as null,
      response: NextResponse.json({ error: "غير مصرّح" }, { status: 401 }),
    };
  }
  if (session.user.role !== "admin") {
    return {
      session: null as null,
      response: NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 }),
    };
  }
  return { session, response: null as null };
}

import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب غير صالح" }, { status: 400 });
  }

  const name =
    typeof body === "object" && body !== null && "name" in body
      ? String((body as { name: unknown }).name ?? "").trim()
      : "";
  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim().toLowerCase()
      : "";
  const message =
    typeof body === "object" && body !== null && "message" in body
      ? String((body as { message: unknown }).message ?? "").trim()
      : "";
  const website =
    typeof body === "object" && body !== null && "website" in body
      ? String((body as { website: unknown }).website ?? "")
      : "";

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "الاسم والبريد والرسالة مطلوبة" }, { status: 400 });
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: "الرسالة طويلة جداً" }, { status: 400 });
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "بريد غير صالح" }, { status: 400 });
  }

  try {
    const sent = await sendContactEmail({ name, email, message });
    if (!sent) {
      return NextResponse.json(
        { error: "خدمة البريد غير مهيأة على الخادم" },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل إرسال الرسالة" }, { status: 500 });
  }
}

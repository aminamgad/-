import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب غير صالح" }, { status: 400 });
  }

  const action =
    typeof body === "object" && body !== null && "action" in body
      ? String((body as { action: unknown }).action ?? "")
      : "";

  if (action !== "cancel") {
    return NextResponse.json({ error: "إجراء غير مدعوم" }, { status: 400 });
  }

  try {
    await connectDB();
    const doc = await Appointment.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!doc) {
      return NextResponse.json({ error: "الموعد غير موجود" }, { status: 404 });
    }

    if (doc.status === "ملغى" || doc.status === "مكتمل") {
      return NextResponse.json({ error: "لا يمكن إلغاء هذا الموعد" }, { status: 400 });
    }

    doc.status = "ملغى";
    await doc.save();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

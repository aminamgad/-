import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  void session;

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

  const b = body as Record<string, unknown>;

  try {
    await connectDB();
    const doc = await Doctor.findById(id);
    if (!doc) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    if (typeof b.name === "string") doc.name = b.name.trim();
    if (typeof b.specialty === "string") doc.specialty = b.specialty.trim();
    if (typeof b.image === "string") doc.image = b.image.trim();
    if (typeof b.rating === "number" && b.rating >= 0 && b.rating <= 5) {
      doc.rating = b.rating;
    }
    if (typeof b.reviewCount === "number" && b.reviewCount >= 0) {
      doc.reviewCount = b.reviewCount;
    }
    if (typeof b.bio === "string") doc.bio = b.bio.trim() || undefined;

    await doc.save();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  void session;

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
  }

  try {
    await connectDB();
    const appts = await Appointment.countDocuments({
      doctorId: new mongoose.Types.ObjectId(id),
      status: { $nin: ["ملغى"] },
    });
    if (appts > 0) {
      return NextResponse.json(
        { error: "لا يمكن الحذف — يوجد مواعيد مرتبطة بهذا الطبيب" },
        { status: 409 },
      );
    }

    const res = await Doctor.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}

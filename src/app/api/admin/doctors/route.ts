import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/require-admin";
import Doctor from "@/models/Doctor";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (response) return response;

  void session;

  try {
    await connectDB();
    const list = await Doctor.find().sort({ name: 1 }).lean();
    const payload = list.map((d) => ({
      id: String(d._id),
      name: d.name,
      specialty: d.specialty,
      image: d.image,
      rating: d.rating,
      reviewCount: d.reviewCount,
      bio: d.bio ?? "",
    }));
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "فشل التحميل" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  void session;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب غير صالح" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  const specialty = String(b.specialty ?? "").trim();
  const image = String(b.image ?? "").trim();
  const rating = Number(b.rating);
  const reviewCount = Number(b.reviewCount);
  const bio = String(b.bio ?? "").trim();

  if (!name || !specialty || !image) {
    return NextResponse.json({ error: "الاسم والتخصص ورابط الصورة مطلوبة" }, { status: 400 });
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    return NextResponse.json({ error: "التقييم بين 0 و 5" }, { status: 400 });
  }

  if (!Number.isFinite(reviewCount) || reviewCount < 0) {
    return NextResponse.json({ error: "عدد التقييمات غير صالح" }, { status: 400 });
  }

  try {
    await connectDB();
    const doc = await Doctor.create({
      name,
      specialty,
      image,
      rating,
      reviewCount,
      bio: bio || undefined,
    });
    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch {
    return NextResponse.json({ error: "فشل الإنشاء" }, { status: 500 });
  }
}

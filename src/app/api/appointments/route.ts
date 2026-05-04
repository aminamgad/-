import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { getAppointmentsForUser } from "@/lib/appointments-list";
import { isSlotBookable } from "@/lib/availability";
import { getKsaSlotStartsForDay } from "@/lib/ksa-slots";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import { formatArabicDateTime } from "@/lib/dates";
import { sendBookingConfirmationEmail } from "@/lib/mail";

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

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "يجب تسجيل الدخول لحجز موعد" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب غير صالح" }, { status: 400 });
  }

  const doctorId =
    typeof body === "object" && body !== null && "doctorId" in body
      ? String((body as { doctorId: unknown }).doctorId ?? "")
      : "";
  const dateStr =
    typeof body === "object" && body !== null && "date" in body
      ? String((body as { date: unknown }).date ?? "")
      : "";
  const slotStartRaw =
    typeof body === "object" && body !== null && "slotStart" in body
      ? String((body as { slotStart: unknown }).slotStart ?? "")
      : "";
  const notes =
    typeof body === "object" && body !== null && "notes" in body
      ? String((body as { notes?: unknown }).notes ?? "").trim().slice(0, 500)
      : "";

  if (!doctorId || !dateStr || !slotStartRaw) {
    return NextResponse.json(
      { error: "الطبيب والتاريخ ووقت الفترة مطلوبة" },
      { status: 400 },
    );
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return NextResponse.json({ error: "طبيب غير صالح" }, { status: 400 });
  }

  const slotStart = new Date(slotStartRaw);
  if (Number.isNaN(slotStart.getTime())) {
    return NextResponse.json({ error: "وقت غير صالح" }, { status: 400 });
  }

  if (slotStart.getTime() < Date.now()) {
    return NextResponse.json({ error: "لا يمكن حجز وقت في الماضي" }, { status: 400 });
  }

  let allowedSlots: Date[];
  try {
    allowedSlots = getKsaSlotStartsForDay(dateStr);
  } catch {
    return NextResponse.json({ error: "تاريخ غير صالح" }, { status: 400 });
  }

  const matchesAllowed = allowedSlots.some(
    (s) => s.getTime() === slotStart.getTime(),
  );
  if (!matchesAllowed) {
    return NextResponse.json(
      { error: "الفترة المختارة غير متاحة في الجدول" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      return NextResponse.json({ error: "الطبيب غير موجود" }, { status: 404 });
    }

    const bookable = await isSlotBookable(doctorId, slotStart);
    if (!bookable) {
      return NextResponse.json(
        { error: "هذا الوقت تم حجزه للتو. اختر فترة أخرى." },
        { status: 409 },
      );
    }

    const created = await Appointment.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      date: slotStart,
      status: "مؤكد",
      ...(notes ? { notes } : {}),
    });

    const userEmail = session.user?.email;
    if (userEmail) {
      void sendBookingConfirmationEmail({
        to: userEmail,
        patientName: session.user?.name ?? "",
        doctorName: doctor.name,
        whenLabel: formatArabicDateTime(created.date.toISOString()),
        notes: notes || undefined,
      }).catch(() => {
        /* تجاهل فشل البريد — الحجز ناجح */
      });
    }

    return NextResponse.json({
      ok: true,
      id: String(created._id),
      date: created.date.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الموعد" }, { status: 500 });
  }
}


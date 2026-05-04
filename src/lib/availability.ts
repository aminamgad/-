import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import {
  addSlotDuration,
  getKsaSlotStartsForDay,
} from "@/lib/ksa-slots";

function startOfKsaDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000+03:00`);
}

function endOfKsaDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999+03:00`);
}

/**
 * فترات متاحة كسلاسل ISO لطبيب في يوم معيّن (تُستبعد المحجوزة وغير الملغاة).
 */
export async function getAvailableSlotIsoStrings(
  doctorId: string,
  dateStr: string,
): Promise<string[]> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return [];
  }

  let slotStarts: Date[];
  try {
    slotStarts = getKsaSlotStartsForDay(dateStr);
  } catch {
    return [];
  }

  const now = Date.now();

  const dayStart = startOfKsaDay(dateStr);
  const dayEnd = endOfKsaDay(dateStr);

  const booked = await Appointment.find({
    doctorId: new mongoose.Types.ObjectId(doctorId),
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $nin: ["ملغى"] as const },
  })
    .select("date")
    .lean();

  const bookedMs = new Set(
    booked.map((b) => new Date(b.date).getTime()),
  );

  const available: string[] = [];
  for (const start of slotStarts) {
    if (start.getTime() < now) continue;
    if (bookedMs.has(start.getTime())) continue;
    available.push(start.toISOString());
  }

  return available;
}

/** يمكن حجز هذه البداية إن لم يوجد تعارض (نفس الطبيب، فترة غير ملغاة). */
export async function isSlotBookable(
  doctorId: string,
  slotStart: Date,
): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(doctorId)) return false;

  const slotEnd = addSlotDuration(slotStart);

  const conflict = await Appointment.countDocuments({
    doctorId: new mongoose.Types.ObjectId(doctorId),
    status: { $nin: ["ملغى"] as const },
    date: {
      $gte: slotStart,
      $lt: slotEnd,
    },
  });

  return conflict === 0;
}

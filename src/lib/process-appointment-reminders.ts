import connectDB from "@/lib/mongodb";
import { formatArabicDateTime } from "@/lib/dates";
import { isInReminderWindow } from "@/lib/reminder-window";
import { sendAppointmentReminderEmail } from "@/lib/mail";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import User from "@/models/User";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function processAppointmentReminders(): Promise<{
  scanned: number;
  sent: number;
  skippedNoWindow: number;
  skippedNoEmail: number;
  mailFailed: number;
}> {
  await connectDB();

  const leadHours = parsePositiveInt(process.env.REMINDER_LEAD_HOURS, 24);
  const windowMinutes = parsePositiveInt(process.env.REMINDER_WINDOW_MINUTES, 90);

  const now = new Date();
  const leadMs = leadHours * 60 * 60 * 1000;
  const winMs = windowMinutes * 60 * 1000;
  const low = new Date(now.getTime() + leadMs - winMs);
  const high = new Date(now.getTime() + leadMs + winMs);

  const candidates = await Appointment.find({
    date: { $gte: low, $lte: high },
    status: { $in: ["مؤكد", "قيد الانتظار"] },
    $or: [{ reminderSentAt: { $exists: false } }, { reminderSentAt: null }],
  }).lean();

  let sent = 0;
  let skippedNoWindow = 0;
  let skippedNoEmail = 0;
  let mailFailed = 0;

  for (const appt of candidates) {
    if (
      !isInReminderWindow(appt.date, now, leadHours, windowMinutes)
    ) {
      skippedNoWindow++;
      continue;
    }

    const [user, doctor] = await Promise.all([
      User.findById(appt.userId).lean(),
      Doctor.findById(appt.doctorId).lean(),
    ]);

    const email = user?.email?.trim();
    if (!email) {
      skippedNoEmail++;
      continue;
    }

    const patientName = user?.name ?? "";
    const doctorName = doctor?.name ?? "الطبيب";

    const ok = await sendAppointmentReminderEmail({
      to: email,
      patientName,
      doctorName,
      whenLabel: formatArabicDateTime(appt.date.toISOString()),
    });

    if (ok) {
      await Appointment.updateOne(
        { _id: appt._id },
        { $set: { reminderSentAt: new Date() } },
      );
      sent++;
    } else {
      mailFailed++;
    }
  }

  return {
    scanned: candidates.length,
    sent,
    skippedNoWindow,
    skippedNoEmail,
    mailFailed,
  };
}

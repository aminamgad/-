import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";

export type AppointmentRow = {
  id: string;
  date: string;
  status: string;
  notes?: string;
  doctorName: string;
};

export async function getAppointmentsForUser(
  userId: string,
): Promise<AppointmentRow[]> {
  await connectDB();
  const list = await Appointment.find({ userId }).sort({ date: 1 }).lean();
  const doctorIds = [...new Set(list.map((a) => String(a.doctorId)))];
  const doctors = await Doctor.find({ _id: { $in: doctorIds } }).lean();
  const map = new Map(doctors.map((d) => [String(d._id), d.name]));

  return list.map((a) => ({
    id: String(a._id),
    date: a.date.toISOString(),
    status: a.status,
    notes: a.notes,
    doctorName: map.get(String(a.doctorId)) ?? "—",
  }));
}

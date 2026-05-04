import mongoose, { Schema, type Model, type Types } from "mongoose";

export type AppointmentStatus = "قيد الانتظار" | "مؤكد" | "مكتمل" | "ملغى";

export interface IAppointment {
  userId: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  status: AppointmentStatus;
  notes?: string;
  /** يُضبط بعد إرسال بريد التذكير بنجاح */
  reminderSentAt?: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["قيد الانتظار", "مؤكد", "مكتمل", "ملغى"],
      default: "قيد الانتظار",
    },
    notes: { type: String },
    reminderSentAt: { type: Date },
  },
  { timestamps: true },
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ??
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;

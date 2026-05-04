import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";

/** يعمل في التطوير فقط — يملأ أطباء وحساب تجريبي ومواعيد نموذجية */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "غير متاح" }, { status: 403 });
  }

  await connectDB();

  const demoEmail = "demo@mednova.local";
  let user = await User.findOne({ email: demoEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash("demo12345", 12);
    user = await User.create({
      email: demoEmail,
      name: "مستخدم تجريبي",
      passwordHash,
    });
  }

  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany([
      {
        name: "د. ليان الراشد",
        specialty: "طب القلب",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 128,
        bio: "استشاري أمراض القلب والأوعية الدموية.",
      },
      {
        name: "د. عمر السبيعي",
        specialty: "طب الأطفال",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        rating: 4.8,
        reviewCount: 94,
        bio: "رعاية شاملة لصحة الأطفال والمراهقين.",
      },
      {
        name: "د. نورة العتيبي",
        specialty: "الجلدية والتجميل",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
        rating: 4.95,
        reviewCount: 210,
        bio: "تشخيص وعلاج الأمراض الجلدية.",
      },
    ]);
  }

  const doctors = await Doctor.find().limit(3);
  if (doctors.length > 0) {
    const existingAppts = await Appointment.countDocuments({ userId: user._id });
    if (existingAppts === 0) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      await Appointment.create([
        {
          userId: user._id,
          doctorId: doctors[0]!._id,
          date: nextWeek,
          status: "مؤكد",
          notes: "متابعة ضغط الدم",
        },
        {
          userId: user._id,
          doctorId: doctors[1]!._id,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: "قيد الانتظار",
        },
      ]);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "تم البذر: demo@mednova.local / demo12345",
  });
}

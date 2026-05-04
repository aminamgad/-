import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";

export async function GET() {
  try {
    await connectDB();
    const doctors = await Doctor.find().sort({ rating: -1 }).lean();
    const payload = doctors.map((d) => ({
      id: String(d._id),
      name: d.name,
      specialty: d.specialty,
      image: d.image,
      rating: d.rating,
      reviewCount: d.reviewCount,
      bio: d.bio,
    }));
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

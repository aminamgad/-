import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { FALLBACK_DOCTORS } from "@/lib/constants";

export type PublicDoctor = {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
};

export async function getPublicDoctors(): Promise<PublicDoctor[]> {
  try {
    await connectDB();
    const list = await Doctor.find().sort({ rating: -1 }).limit(6).lean();
    if (list.length === 0) {
      return FALLBACK_DOCTORS.map((d) => ({ ...d }));
    }
    return list.map((d) => ({
      id: String(d._id),
      name: d.name,
      specialty: d.specialty,
      image: d.image,
      rating: d.rating,
      reviewCount: d.reviewCount,
    }));
  } catch {
    return FALLBACK_DOCTORS.map((d) => ({ ...d }));
  }
}

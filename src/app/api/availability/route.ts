import { NextResponse } from "next/server";
import { getAvailableSlotIsoStrings } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId") ?? "";
  const date = searchParams.get("date") ?? "";

  if (!doctorId || !date) {
    return NextResponse.json(
      { error: "معرّف الطبيب والتاريخ مطلوبان" },
      { status: 400 },
    );
  }

  try {
    const slots = await getAvailableSlotIsoStrings(doctorId, date);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "تعذّر جلب المواعيد" }, { status: 500 });
  }
}

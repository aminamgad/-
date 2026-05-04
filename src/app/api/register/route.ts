import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 },
      );
    }

    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "البريد مسجّل مسبقاً" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ email, name, passwordHash });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

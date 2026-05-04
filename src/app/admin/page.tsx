import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">لوحة الإدارة</h1>
        <p className="mt-2 text-muted-foreground">
          إدارة محتوى الموقع. ابدأ بقائمة الأطباء الظاهرة للزوار.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/doctors">
          <Card className="p-6 transition-colors hover:border-primary/40">
            <h2 className="font-heading text-lg font-bold">الأطباء</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              إضافة وتعديل وحذف الأطباء وروابط الصور.
            </p>
          </Card>
        </Link>
        <Card className="p-6 opacity-70">
          <h2 className="font-heading text-lg font-bold">قريباً</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            تقارير وحجوزات متقدمة يمكن ربطها لاحقاً.
          </p>
        </Card>
      </div>
    </div>
  );
}

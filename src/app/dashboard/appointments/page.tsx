import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppointmentsPlaceholderPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <h2 className="font-heading text-2xl font-bold">المواعيد</h2>
      <p className="text-muted-foreground">
        قائمة مواعيدك التفصيلية متوفرة في الصفحة الرئيسية للوحة التحكم. يمكن لاحقاً نقل
        الفلترة والإجراءات السريعة إلى هذه الصفحة.
      </p>
      <Link href="/dashboard">
        <Button variant="gradient" size="lg">
          العودة للنظرة العامة
        </Button>
      </Link>
    </div>
  );
}

import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h2 className="font-heading text-2xl font-bold">الإعدادات</h2>
      <Card className="p-6">
        <p className="leading-relaxed text-muted-foreground">
          إعدادات الحساب والإشعارات ستُضاف هنا (البريد، رقم الجوال، تفضيلات التذكير).
          البنية جاهزة لتوسعة لاحقة دون كسر التخطيط العربي.
        </p>
      </Card>
    </div>
  );
}

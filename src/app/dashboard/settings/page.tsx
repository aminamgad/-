import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold">الإعدادات</h2>
        <p className="mt-2 text-muted-foreground">
          معلومات حسابك وتغيير كلمة المرور.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold">الحساب</h3>
        <dl className="mt-4 space-y-4 text-base">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">الاسم</dt>
            <dd className="mt-1 font-medium">{session?.user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</dt>
            <dd className="mt-1 font-mono text-sm" dir="ltr">
              {session?.user?.email ?? "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          لتغيير البريد أو البيانات الشخصية الكاملة يمكن لاحقاً ربط هذا القسم بنموذج
          تحقق عبر البريد.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold">الأمان</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          استخدم كلمة مرور قوية ولا تشاركها مع أي شخص.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </Card>
    </div>
  );
}

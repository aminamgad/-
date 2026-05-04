import { AdminDoctorsPanel } from "@/components/admin/admin-doctors-panel";

export default function AdminDoctorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">إدارة الأطباء</h1>
        <p className="mt-2 text-muted-foreground">
          الصور عبر رابط عام؛ لرفع إلى Cloudinary استخدم لوحة Cloudinary ثم الصق الرابط هنا.
        </p>
      </div>
      <AdminDoctorsPanel />
    </div>
  );
}

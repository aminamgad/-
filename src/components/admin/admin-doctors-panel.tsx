"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Doc = {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  bio: string;
};

const emptyForm = {
  name: "",
  specialty: "",
  image: "",
  rating: 4.8,
  reviewCount: 10,
  bio: "",
};

export function AdminDoctorsPanel() {
  const [list, setList] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل التحميل");
        return;
      }
      setList(Array.isArray(data) ? data : []);
    } catch {
      toast.error("خطأ في الشبكة");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  function startEdit(d: Doc) {
    setEditingId(d.id);
    setForm({
      name: d.name,
      specialty: d.specialty,
      image: d.image,
      rating: d.rating,
      reviewCount: d.reviewCount,
      bio: d.bio,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/doctors/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(typeof data.error === "string" ? data.error : "فشل التحديث");
          return;
        }
        toast.success("تم التحديث");
        cancelEdit();
        void load();
        return;
      }
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل الإضافة");
        return;
      }
      toast.success("تمت إضافة الطبيب");
      setForm(emptyForm);
      void load();
    } catch {
      toast.error("خطأ في الشبكة");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("حذف هذا الطبيب؟")) return;
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل الحذف");
        return;
      }
      toast.success("تم الحذف");
      if (editingId === id) cancelEdit();
      void load();
    } catch {
      toast.error("خطأ في الشبكة");
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold">
          {editingId ? "تعديل طبيب" : "إضافة طبيب"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          رابط الصورة: استخدم URL عام (مثلاً من Unsplash أو Cloudinary).
        </p>
        <form onSubmit={onSave} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-semibold">الاسم</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">التخصص</label>
            <input
              required
              value={form.specialty}
              onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">رابط الصورة</label>
            <input
              required
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3"
              dir="ltr"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">التقييم (0–5)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              max={5}
              required
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: Number(e.target.value) }))
              }
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">عدد التقييمات</label>
            <input
              type="number"
              min={0}
              required
              value={form.reviewCount}
              onChange={(e) =>
                setForm((f) => ({ ...f, reviewCount: Number(e.target.value) }))
              }
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-semibold">نبذة (اختياري)</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit" variant="gradient" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "حفظ التعديل" : "إضافة"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                إلغاء التعديل
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border/80 bg-muted/40 px-4 py-3">
          <h2 className="font-heading text-lg font-bold">قائمة الأطباء</h2>
        </div>
        {loading ? (
          <p className="p-8 text-center text-muted-foreground">جارٍ التحميل…</p>
        ) : list.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">لا يوجد أطباء بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-start text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground">
                  <th className="px-4 py-3">الاسم</th>
                  <th className="px-4 py-3">التخصص</th>
                  <th className="px-4 py-3">التقييم</th>
                  <th className="px-4 py-3 w-32">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr
                    key={d.id}
                    className={cn(
                      "border-b border-border/50",
                      editingId === d.id && "bg-primary/5",
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3">{d.specialty}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {d.rating} ({d.reviewCount})
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 px-2"
                          onClick={() => startEdit(d)}
                          aria-label="تعديل"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 px-2 text-destructive"
                          onClick={() => onDelete(d.id)}
                          aria-label="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { formatArabicDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

type DoctorOption = {
  id: string;
  name: string;
  specialty: string;
};

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preDoctor = searchParams.get("doctor");

  const { status } = useSession();

  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [doctorId, setDoctorId] = useState(preDoctor ?? "");
  const [dateStr, setDateStr] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [pickedSlot, setPickedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = (await res.json()) as DoctorOption[];
        if (!cancelled && Array.isArray(data)) setDoctors(data);
      } catch {
        if (!cancelled) toast.error("تعذّر تحميل قائمة الأطباء");
      } finally {
        if (!cancelled) setDoctorsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchSlotsFor = useCallback(async (doc: string, date: string) => {
    if (!doc || !date) {
      setSlots([]);
      setPickedSlot(null);
      return;
    }
    setSlotsLoading(true);
    setPickedSlot(null);
    try {
      const q = new URLSearchParams({ doctorId: doc, date });
      const res = await fetch(`/api/availability?${q}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "خطأ في الجدول");
        setSlots([]);
        return;
      }
      const list = (data as { slots?: string[] }).slots;
      setSlots(Array.isArray(list) ? list : []);
      if (Array.isArray(list) && list.length === 0) {
        toast.message("لا توجد فترات متاحة لهذا اليوم");
      }
    } catch {
      toast.error("تعذّر تحميل الفترات");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctorId || !dateStr || !pickedSlot) {
      toast.error("اختر الطبيب والتاريخ والوقت");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          date: dateStr,
          slotStart: pickedSlot,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل الحجز");
        return;
      }
      toast.success("تم تأكيد الموعد");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <Container className="max-w-2xl py-16">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container className="max-w-lg py-16 text-center">
        <Card className="p-8">
          <h1 className="font-heading text-2xl font-bold">تسجيل الدخول مطلوب</h1>
          <p className="mt-3 text-muted-foreground">
            سجّل الدخول أو أنشئ حساباً لإكمال حجز الموعد.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/login?callbackUrl=/book`}>
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href={`/register?callbackUrl=/book`}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="max-w-2xl py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">حجز موعد</h1>
        <p className="mt-3 text-muted-foreground">
          اختر الطبيب واليوم والفترة المناسبة — التوقيت بتوقيت السعودية (٩ صباحاً – ٥ مساءً).
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="doctor" className="text-sm font-semibold">
              الطبيب
            </label>
            {doctorsLoading ? (
              <Skeleton className="h-12 w-full rounded-xl" />
            ) : (
              <select
                id="doctor"
                required
                value={doctorId}
                onChange={(e) => {
                  const v = e.target.value;
                  setDoctorId(v);
                  void fetchSlotsFor(v, dateStr);
                }}
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— اختر الطبيب —</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-semibold">
              اليوم
            </label>
            <input
              id="date"
              type="date"
              required
              min={minDate}
              value={dateStr}
              onChange={(e) => {
                const v = e.target.value;
                setDateStr(v);
                void fetchSlotsFor(doctorId, v);
              }}
              className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <span className="text-sm font-semibold">الفترة الزمنية</span>
            {slotsLoading ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {[1, 2, 3, 4].map((k) => (
                  <Skeleton key={k} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {doctorId && dateStr
                  ? "لا توجد فترات متاحة. جرّب يوماً آخر."
                  : "اختر الطبيب والتاريخ أولاً."}
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {slots.map((iso) => (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setPickedSlot(iso)}
                    className={cn(
                      "min-h-12 rounded-xl border px-4 text-base font-medium transition-colors",
                      pickedSlot === iso
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/40 hover:bg-muted",
                    )}
                  >
                    {formatArabicDateTime(iso)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold">
              ملاحظات (اختياري)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              maxLength={500}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أعرّف الطبيب باختصار بسبب الزيارة"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full gap-2"
            disabled={submitting || !pickedSlot}
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : null}
            تأكيد الحجز
          </Button>
        </form>
      </Card>
    </Container>
  );
}

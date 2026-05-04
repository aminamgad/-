"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CancelAppointmentButton({
  appointmentId,
  cancellable,
}: {
  appointmentId: string;
  cancellable: boolean;
}) {
  const router = useRouter();
  const blocked = !cancellable;

  async function cancel() {
    if (!window.confirm("هل تريد إلغاء هذا الموعد؟")) return;
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل الإلغاء");
        return;
      }
      toast.success("تم إلغاء الموعد");
      router.refresh();
    } catch {
      toast.error("خطأ في الشبكة");
    }
  }

  if (blocked) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="min-h-9 px-3 text-sm"
      onClick={cancel}
    >
      إلغاء
    </Button>
  );
}

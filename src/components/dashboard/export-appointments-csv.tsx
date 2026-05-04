"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ExportAppointmentsCsv() {
  async function exportCsv() {
    try {
      const res = await fetch("/api/appointments");
      if (!res.ok) {
        toast.error("تعذّر جلب المواعيد");
        return;
      }
      const rows = (await res.json()) as Array<{
        doctorName: string;
        date: string;
        status: string;
        notes?: string;
      }>;
      if (!Array.isArray(rows)) {
        toast.error("بيانات غير متوقعة");
        return;
      }
      const header = ["الطبيب", "الموعد ISO", "الحالة", "ملاحظات"];
      const lines = [
        header.join(","),
        ...rows.map((r) =>
          [
            `"${(r.doctorName ?? "").replace(/"/g, '""')}"`,
            r.date,
            `"${(r.status ?? "").replace(/"/g, '""')}"`,
            `"${(r.notes ?? "").replace(/"/g, '""')}"`,
          ].join(","),
        ),
      ];
      const blob = new Blob(["\uFEFF" + lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تنزيل الملف");
    } catch {
      toast.error("فشل التصدير");
    }
  }

  return (
    <Button type="button" variant="outline" className="gap-2" onClick={exportCsv}>
      <Download className="h-4 w-4" aria-hidden />
      تصدير CSV
    </Button>
  );
}

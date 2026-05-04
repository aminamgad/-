"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "فشل الإرسال");
        return;
      }
      toast.success("تم إرسال رسالتك — سنتواصل قريباً");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("خطأ في الشبكة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />
        <div className="space-y-2">
          <label htmlFor="c-name" className="text-sm font-semibold">
            الاسم
          </label>
          <input
            id="c-name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="c-email" className="text-sm font-semibold">
            البريد الإلكتروني
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="c-msg" className="text-sm font-semibold">
            الرسالة
          </label>
          <textarea
            id="c-msg"
            name="message"
            required
            rows={6}
            maxLength={5000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="كيف يمكننا مساعدتك؟"
          />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="w-full gap-2" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          إرسال
        </Button>
      </form>
    </Card>
  );
}

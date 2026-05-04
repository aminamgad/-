import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking/booking-form";
import { BookingPageSkeleton } from "@/components/booking/booking-page-skeleton";

export const metadata: Metadata = {
  title: "حجز موعد — ميدنوفا",
  description: "احجز موعداً مع طبيبك بتوقيت السعودية.",
};

export default function BookPage() {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingForm />
    </Suspense>
  );
}

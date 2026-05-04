import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "اتصل بنا — ميدنوفا",
  description: "راسل فريق ميدنوفا — نرد في أقرب وقت.",
};

export default function ContactPage() {
  return (
    <section className="py-12 sm:py-20">
      <Container className="max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">اتصل بنا</h1>
          <p className="mt-3 text-muted-foreground">
            اترك لنا رسالة عبر النموذج أدناه. نستخدم بريدك فقط للرد على استفسارك.
          </p>
        </div>
        <ContactForm />
      </Container>
    </section>
  );
}

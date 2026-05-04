import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-muted/40 py-14">
      <Container className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="font-heading text-xl font-bold text-foreground">ميدنوفا</p>
          <p className="mt-2 max-w-sm text-base leading-relaxed text-muted-foreground">
            منصة رعاية صحية حديثة تجمع بين الخبرة الطبية وتجربة رقمية سلسة — مصممة
            للمستخدم العربي.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-base">
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground">روابط</span>
            <Link href="/#features" className="text-muted-foreground hover:text-primary">
              المزايا
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-primary">
              الدخول
            </Link>
            <Link href="/register" className="text-muted-foreground hover:text-primary">
              إنشاء حساب
            </Link>
            <Link href="/book" className="text-muted-foreground hover:text-primary">
              احجز موعد
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">
              اتصل بنا
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground">قانوني</span>
            <span className="text-muted-foreground">سياسة الخصوصية</span>
            <span className="text-muted-foreground">شروط الاستخدام</span>
          </div>
        </div>
      </Container>
      <Container className="mt-10 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ميدنوفا. جميع الحقوق محفوظة.
      </Container>
    </footer>
  );
}

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicHttps } from "@/lib/request-https";

/**
 * يجب عدم استيراد `auth` من `@/auth` هنا: ذلك يسحب Mongoose إلى بيئة Edge
 * ويُسبب خطأ `stream` module. التحقق من الجلسة عبر JWT فقط.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const secureCookie = isPublicHttps(request);

  const token =
    secret &&
    (await getToken({
      req: request,
      secret,
      secureCookie,
    }));

  if (pathname.startsWith("/admin")) {
    if (!secret) {
      const login = new URL("/login", request.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    if (!token) {
      const login = new URL("/login", request.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    const role = (token.role as string | undefined) ?? "user";
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!secret) {
      const login = new URL("/login", request.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    if (!token) {
      const login = new URL("/login", request.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

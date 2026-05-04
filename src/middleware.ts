import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * يجب عدم استيراد `auth` من `@/auth` هنا: ذلك يسحب Mongoose إلى بيئة Edge
 * ويُسبب خطأ `stream` module. التحقق من الجلسة عبر JWT فقط.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    const login = new URL("/login", request.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  const secureCookie = request.nextUrl.protocol === "https:";

  const token = await getToken({
    req: request,
    secret,
    secureCookie,
  });

  if (!token) {
    const login = new URL("/login", request.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

import type { NextRequest } from "next/server";

/**
 * يحدد ما إذا كان الطلب يمر عبر HTTPS من جهة المتصفح.
 * على Vercel وغيرها من البروكسيات، `nextUrl.protocol` قد يكون `http:` بينما
 * `x-forwarded-proto` هو `https` — وهذا يؤثر على اسم كوكي الجلسة في next-auth/getToken.
 */
export function isPublicHttps(request: NextRequest): boolean {
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwarded === "https") return true;
  if (forwarded === "http") return false;
  return request.nextUrl.protocol === "https:";
}

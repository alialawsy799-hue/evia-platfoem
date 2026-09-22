import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAdminCookie = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !hasAdminCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

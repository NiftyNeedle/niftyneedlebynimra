import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, expectedAdminToken } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await expectedAdminToken();

  if (!token || token !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

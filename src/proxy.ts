import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, expectedAdminToken } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Refresh the customer's Supabase session (and read the current user).
  let user = null;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const { pathname } = req.nextUrl;

  // Customer account area requires a logged-in customer.
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!user) {
      const redirect = req.nextUrl.clone();
      redirect.pathname = "/login";
      redirect.searchParams.set("from", pathname);
      return NextResponse.redirect(redirect);
    }
  }

  // Admin area requires the admin cookie.
  if (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    pathname !== "/admin/login"
  ) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || token !== (await expectedAdminToken())) {
      const redirect = req.nextUrl.clone();
      redirect.pathname = "/admin/login";
      redirect.searchParams.set("from", pathname);
      return NextResponse.redirect(redirect);
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Run on all routes except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

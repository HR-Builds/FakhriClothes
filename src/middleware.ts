import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
const PROTECTED = ["/cart", "/checkout", "/account", "/api/cart", "/api/checkout", "/api/orders"];
const ADMIN = ["/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("fc_token")?.value;
  let payload: { isAdmin?: boolean } | null = null;

  if (token) {
    try { payload = (await jwtVerify(token, SECRET)).payload as { isAdmin?: boolean }; }
    catch { payload = null; }
  }

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN.some((p) => pathname.startsWith(p));

  // API requests get JSON 401 (so fetch can handle it), pages get redirected
  if ((needsAuth || needsAdmin) && !payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    url.searchParams.set("message", "Please log in to continue.");
    return NextResponse.redirect(url);
  }
  if (needsAdmin && !payload?.isAdmin) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/account/:path*", "/admin/:path*", "/api/cart/:path*", "/api/checkout/:path*", "/api/orders/:path*", "/api/admin/:path*"],
};
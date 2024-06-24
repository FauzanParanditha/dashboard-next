import { NextRequest, NextResponse } from "next/server";
import { jwtConfig } from "@/utils/var";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|storage|assets|favicon.ico|images).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  const hostname = req.headers.get("host");
  let mode = "adm";

  if (
    process.env.NEXT_PUBLIC_APP_TYPE === "dev"
    // && process.env.FORCE_DOMAIN_MODE !== "true"
  ) {
    mode = req.cookies.get("_mode")?.value || mode;
  } else {
    if (hostname === process.env.NEXT_PUBLIC_APP_DOMAIN) {
      mode = "app";
    }
    if (hostname === process.env.NEXT_PUBLIC_ADM_DOMAIN) {
      mode = "adm";
    }
  }

  const token = req.cookies.get(jwtConfig.accessTokenName);
  if (req.nextUrl.pathname.startsWith("/__app/user")) {
    if (!token) return NextResponse.redirect(`${origin}`);
  }

  // Admin App
  if (mode === "adm") {
    const token = req.cookies.get(jwtConfig.accessAdminTokenName);
    if (path === "/") {
      return NextResponse.next();
    }
    if (req.nextUrl.pathname.startsWith("/__adm/dashboard")) {
      if (!token) return NextResponse.redirect(`${origin}`);
    }
    return NextResponse.rewrite(new URL(`/__adm${path}`, req.url));
  }

  // Main App
  // return NextResponse.rewrite(new URL(`/__app${path}`, req.url));
}

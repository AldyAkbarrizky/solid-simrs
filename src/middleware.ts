import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname);

  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";
  const isLoginPage = request.nextUrl.pathname === "/login";

  console.log("IsLoggedIn:", isLoggedIn, "IsLoginPage:", isLoginPage);

  // Jika user belum login dan bukan di halaman login, redirect ke login
  if (!isLoggedIn && !isLoginPage) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Allowing request to continue");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

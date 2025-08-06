import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // 1. Cek cookie 'token' yang kita set setelah login berhasil
  const token = request.cookies.get("token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // 2. Logika BARU: Jika user sudah login (punya token) dan mencoba mengakses halaman login
  if (token && isLoginPage) {
    // Arahkan mereka ke halaman utama (dashboard)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Logika LAMA (sedikit dimodifikasi): Jika user belum login dan mencoba mengakses halaman selain login
  if (!token && !isLoginPage) {
    // Arahkan mereka ke halaman login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika tidak ada kondisi di atas yang terpenuhi, izinkan request
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

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Якщо користувач не авторизований
  if (!token) {
    // Дозволяємо доступ до landing, login, register
    if (
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")
    ) {
      return NextResponse.next();
    }
    // Перенаправляємо на login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Якщо користувач авторизований, не можна на сторінки авторизації
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

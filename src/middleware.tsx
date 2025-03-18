import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/dashboard"];

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const decodedData = getDecodedToken(request);

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !decodedData) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access public routes (login/register)
  // redirect them to dashboard
  if (isPublicRoute && decodedData) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  (request as any).decodedToken = decodedData; // diger api route'larina token'ı iletme
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

function getDecodedToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

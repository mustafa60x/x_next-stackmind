import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/dashboard"];

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  const decodedData = await getDecodedToken(token);

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

async function getDecodedToken(token: string | undefined) {
  try {
    if (!token) {
      return null;
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

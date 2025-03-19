// app/api/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { validateCsrfToken, clearCsrfToken } from "@/lib/csrf";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { username, password, csrfToken } = await request.json();

  // Cookie üzerinden tempUserId çekimi
  const tempUserId = (await cookies()).get("tempUserId")?.value;
  if (!tempUserId || !csrfToken) {
    return NextResponse.json(
      { message: "CSRF token or user ID missing" },
      { status: 403 }
    );
  }

  // CSRF token doğrulaması
  if (!validateCsrfToken(tempUserId, csrfToken)) {
    return NextResponse.json(
      { message: "Invalid CSRF token" },
      { status: 403 }
    );
  }

  // Kullanıcı kontrolü
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, password")
    .eq("username", username)
    .single();

  if (!user || error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Token oluşturma ve CSRF token'ı temizleme (tek kullanımlık)
  const token = await generateToken(user);
  clearCsrfToken(tempUserId);

  const response = NextResponse.json(
    { token, user: { id: user.id, username } },
    { status: 200 }
  );

  // Auth token'ı cookie olarak ayarla
  /* response.cookies.set("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 gün
  }); */

  /* const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 gün
  }); */

  // Temporary user ID'yi temizle
  // (await cookies()).delete('tempUserId')

  return response;
}

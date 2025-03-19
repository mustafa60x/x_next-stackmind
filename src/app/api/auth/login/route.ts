// app/api/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { validateCsrfToken, clearCsrfToken } from "@/lib/csrf";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { username, password, csrfToken } = await request.json();

  // Cookie üzerinden tempUserId çekimi
  const tempUserId = request.cookies.get("tempUserId")?.value;
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
    { user: { id: user.id, username } },
    { status: 200 }
  );

  // Auth token'ı cookie olarak ayarla
  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 gün
  });

  // Temporary user ID'yi temizle
  response.cookies.delete("tempUserId");

  return response;
}

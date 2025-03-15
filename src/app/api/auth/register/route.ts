// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { users } from "@/lib/db";

// Kullanıcı verilerinin saklanacağı örnek dizin
// let users: Array<{ id: string; username: string; password: string }> = [];

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Eksik alanlar" }, { status: 400 });
    }

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return NextResponse.json(
        { message: "Kullanıcı zaten mevcut" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
    };
    users.push(newUser);

    const token = generateToken(newUser);
    return NextResponse.json(
      { token, user: { id: newUser.id, username } },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

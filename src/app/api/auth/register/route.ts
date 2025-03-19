// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { users } from "@/lib/db";
import { supabase } from "@/lib/supabase";

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

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email: username,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const token = await generateToken(data);
    return NextResponse.json(
      { token, user: { id: data.id, username } },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

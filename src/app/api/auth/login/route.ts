// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users } from '@/lib/db';
import { generateToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = users.find((u) => u.username === username);
  if (!user) {
    return NextResponse.json(
      { message: 'Invalid credentials', users },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = generateToken(user);
  return NextResponse.json(
    { token, user: { id: user.id, username } },
    { status: 200 }
  );
}

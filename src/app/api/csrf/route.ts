// app/api/csrf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';
import crypto from 'crypto';
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Cookie üzerinden tempUserId alınır; yoksa rastgele oluşturulur
  const tempUserId =
    (await cookies()).get('tempUserId')?.value ||
    crypto.randomInt(0, 2147483647).toString();

  // CSRF token'ı tempUserId kullanılarak oluşturulur
  const csrfToken = await generateCsrfToken(tempUserId);

  // Yanıt oluşturulurken cookie set edilir
  const response = NextResponse.json({ csrfToken }, { status: 200 });
  const cookieStore = await cookies();
  cookieStore.set('tempUserId', tempUserId, {
    path: '/',
    httpOnly: true,
  });

  return response;
}

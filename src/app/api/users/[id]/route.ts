// /api/users/[id]
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // params'ı await ediyoruz, next.js uyarısı almamak için
  const { id } = await Promise.resolve(params);

  // Örnek kullanıcı objesi
  const user = {
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return NextResponse.json(user);
}

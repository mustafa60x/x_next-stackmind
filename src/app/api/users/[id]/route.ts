// /api/users/[id]
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  // params'ı await ediyoruz, next.js uyarısı almamak için
  const { id } = await Promise.resolve(context.params);

  // Örnek kullanıcı objesi
  const user = {
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return NextResponse.json(user);
}

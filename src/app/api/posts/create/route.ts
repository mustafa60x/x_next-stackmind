// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import { supabase } from '@/lib/supabase';
import { DecodedToken } from '@/types';
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt';


export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decodedToken = await verifyToken(accessToken);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  // Gelen veriyi sanitize et
  const sanitizedTitle = sanitizeHtml(title);
  const sanitizedContent = sanitizeHtml(content);

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title: sanitizedTitle,
        content: sanitizedContent,
        user_id: (decodedToken as DecodedToken).id,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

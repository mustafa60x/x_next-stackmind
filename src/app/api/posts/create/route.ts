// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import { verifyToken } from '@/lib/jwt';
import { supabase } from '@/lib/supabase';
import { DecodedToken } from '@/types';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
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
        user_id: (decoded as DecodedToken).id,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

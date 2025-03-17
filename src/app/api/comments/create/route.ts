// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { DecodedToken } from '@/types';
import { supabase } from '@/lib/supabase';

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

  const { content, postId } = await request.json();
  if (!content || !postId) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        content,
        user_id: (decoded as DecodedToken).id,
        post_id: postId,
        // score: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

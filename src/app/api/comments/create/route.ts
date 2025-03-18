// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { DecodedToken } from '@/types';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const decodedToken = (request as any).decodedToken;

  const { content, postId } = await request.json();
  if (!content || !postId) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        content,
        user_id: (decodedToken as DecodedToken).id,
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

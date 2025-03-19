
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(*)')
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

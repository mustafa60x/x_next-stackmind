
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { posts } from '@/lib/db';

export async function GET() {
  return NextResponse.json(posts, { status: 200 });
}

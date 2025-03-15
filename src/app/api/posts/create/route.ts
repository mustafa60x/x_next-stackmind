// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { posts } from '@/lib/db';

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

  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    userId: (decoded as any).id,
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);

  return NextResponse.json(newPost, { status: 201 });
}

// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { comments } from '@/lib/db';
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

  const { content, postId } = await request.json();
  if (!content || !postId) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const newComment = {
    id: Date.now().toString(),
    content,
    userId: (decoded as DecodedToken).id,
    postId,
    score: 0,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);

  return NextResponse.json(newComment, { status: 201 });
}

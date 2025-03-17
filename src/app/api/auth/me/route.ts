// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { DecodedToken } from '@/types';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('id', (decoded as DecodedToken).id)
    .single();

  if (!user || error) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ id: user.id, username: user.username }, { status: 200 });
}

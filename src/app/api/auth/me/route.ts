// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DecodedToken } from '@/types';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const decodedToken = (request as any).decodedToken;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('id', (decodedToken as DecodedToken).id)
    .single();

  if (!user || error) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ id: user.id, username: user.username }, { status: 200 });
}

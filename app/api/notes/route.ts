import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const text = typeof body?.body === 'string' ? body.body.trim() : '';
  if (!text || typeof body.listing_id !== 'string') {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: note, error } = await supabase
    .from('listing_notes')
    .insert({ listing_id: body.listing_id, member_id: session.memberId, body: text })
    .select()
    .single();

  if (error) {
    console.error('Failed to save note:', error);
    return NextResponse.json({ error: 'Could not save note.' }, { status: 500 });
  }

  return NextResponse.json({ note });
}

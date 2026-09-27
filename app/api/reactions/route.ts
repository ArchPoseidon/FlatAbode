import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.listing_id !== 'string' || typeof body.loved !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('listing_reactions').upsert(
    {
      listing_id: body.listing_id,
      member_id: session.memberId,
      loved: body.loved,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'listing_id,member_id' }
  );

  if (error) {
    console.error('Failed to save reaction:', error);
    return NextResponse.json({ error: 'Could not save reaction.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

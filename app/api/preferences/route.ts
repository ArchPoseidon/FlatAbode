import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rescoreListing } from '@/lib/rescore';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.locations)) {
    return NextResponse.json({ error: 'Invalid preferences payload.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error: upsertError } = await supabase.from('preferences').upsert(
    {
      member_id: session.memberId,
      budget_max: typeof body.budget_max === 'number' ? body.budget_max : null,
      bhk: typeof body.bhk === 'string' ? body.bhk : null,
      locations: body.locations,
      must_have_amenities: Array.isArray(body.must_have_amenities) ? body.must_have_amenities : [],
      custom_must_haves: Array.isArray(body.custom_must_haves) ? body.custom_must_haves : [],
      nice_to_haves: Array.isArray(body.nice_to_haves) ? body.nice_to_haves : [],
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'member_id' }
  );

  if (upsertError) {
    console.error('Failed to save preferences:', upsertError);
    return NextResponse.json({ error: 'Could not save preferences.' }, { status: 500 });
  }

  await supabase
    .from('members')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', session.memberId)
    .is('onboarded_at', null);

  // A new or changed preference set can change how existing listings score — rescore them all.
  const { data: readyListings } = await supabase
    .from('listings')
    .select('id, extracted_fields, rent, bhk, locality')
    .eq('group_id', session.groupId)
    .eq('status', 'ready');

  await Promise.all(
    (readyListings ?? []).map((l) =>
      rescoreListing(l.id, session.groupId, {
        rent: l.rent,
        bhk: l.bhk,
        locality: l.locality,
        ...(l.extracted_fields as Record<string, unknown>),
      })
    )
  );

  return NextResponse.json({ ok: true });
}

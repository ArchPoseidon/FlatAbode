import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';
import { extractListingFromUrl } from '@/lib/extract-listing';
import { rescoreListing } from '@/lib/rescore';
import { getDashboardData } from '@/lib/listings-data';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const data = await getDashboardData(session.groupId);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || (body.source_type !== 'url' && body.source_type !== 'manual')) {
    return NextResponse.json({ error: 'Invalid listing payload.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (body.source_type === 'url') {
    const url = typeof body.source_url === 'string' ? body.source_url.trim() : '';
    if (!url) return NextResponse.json({ error: 'A URL is required.' }, { status: 400 });

    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        group_id: session.groupId,
        added_by: session.memberId,
        source_type: 'url',
        source_url: url,
        status: 'extracting',
      })
      .select()
      .single();

    if (insertError || !listing) {
      console.error('Failed to create listing:', insertError);
      return NextResponse.json({ error: 'Could not create listing.' }, { status: 500 });
    }

    try {
      const extracted = await extractListingFromUrl(url);
      const { data: updated } = await supabase
        .from('listings')
        .update({
          title: extracted.title,
          description: extracted.description,
          rent: extracted.rent,
          bhk: extracted.bhk,
          locality: extracted.locality,
          photos: extracted.photos,
          cover_photo: extracted.cover_photo,
          extracted_fields: extracted.extracted_fields,
          status: 'ready',
        })
        .eq('id', listing.id)
        .select()
        .single();

      await rescoreListing(listing.id, session.groupId, extracted.extracted_fields);

      return NextResponse.json({ listing: updated ?? listing });
    } catch (err) {
      console.error('Extraction failed:', err);
      await supabase
        .from('listings')
        .update({
          status: 'failed',
          error_message: err instanceof Error ? err.message : 'Extraction failed.',
        })
        .eq('id', listing.id);
      return NextResponse.json(
        { error: "Couldn't read that listing automatically. You can add it manually instead." },
        { status: 422 }
      );
    }
  }

  // Manual entry — no extraction, fields come straight from the member.
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) return NextResponse.json({ error: 'A title is required.' }, { status: 400 });

  const extractedFields = {
    lift: typeof body.lift === 'boolean' ? body.lift : null,
    power_backup: typeof body.power_backup === 'boolean' ? body.power_backup : null,
    covered_parking: typeof body.covered_parking === 'boolean' ? body.covered_parking : null,
    pet_friendly: typeof body.pet_friendly === 'boolean' ? body.pet_friendly : null,
    furnished: typeof body.furnished === 'boolean' ? body.furnished : null,
  };

  const { data: listing, error: insertError } = await supabase
    .from('listings')
    .insert({
      group_id: session.groupId,
      added_by: session.memberId,
      source_type: 'manual',
      title,
      description: typeof body.description === 'string' ? body.description : null,
      rent: typeof body.rent === 'number' ? body.rent : null,
      bhk: typeof body.bhk === 'string' ? body.bhk : null,
      locality: typeof body.locality === 'string' ? body.locality : null,
      extracted_fields: extractedFields,
      status: 'ready',
    })
    .select()
    .single();

  if (insertError || !listing) {
    console.error('Failed to create manual listing:', insertError);
    return NextResponse.json({ error: 'Could not create listing.' }, { status: 500 });
  }

  await rescoreListing(listing.id, session.groupId, {
    rent: listing.rent,
    bhk: listing.bhk,
    locality: listing.locality,
    ...extractedFields,
  });

  return NextResponse.json({ listing });
}

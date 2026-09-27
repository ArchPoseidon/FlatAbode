import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';

const MIN_MEMBERS = 2;
const MAX_MEMBERS = 6;
const MAX_NAME_LENGTH = 40;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const names = body?.names;

  if (!Array.isArray(names) || names.length < MIN_MEMBERS || names.length > MAX_MEMBERS) {
    return NextResponse.json(
      { error: `Provide between ${MIN_MEMBERS} and ${MAX_MEMBERS} names.` },
      { status: 400 }
    );
  }

  const cleanNames = names.map((n) => (typeof n === 'string' ? n.trim() : ''));
  if (cleanNames.some((n) => n.length === 0 || n.length > MAX_NAME_LENGTH)) {
    return NextResponse.json(
      { error: `Each name must be 1-${MAX_NAME_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ city: 'Bangalore' })
    .select('id')
    .single();

  if (groupError || !group) {
    console.error('Failed to create group:', groupError);
    return NextResponse.json({ error: 'Could not create group.' }, { status: 500 });
  }

  const memberRows = cleanNames.map((name, i) => ({
    group_id: group.id,
    name,
    slug: generateSlug(),
    is_creator: i === 0,
  }));

  const { data: members, error: membersError } = await supabase
    .from('members')
    .insert(memberRows)
    .select('id, name, slug, is_creator');

  if (membersError || !members) {
    console.error('Failed to create members:', membersError);
    return NextResponse.json({ error: 'Could not create members.' }, { status: 500 });
  }

  const orderBySlug = new Map(memberRows.map((row, i) => [row.slug, i]));

  return NextResponse.json({
    groupId: group.id,
    members: [...members]
      .sort((a, b) => (orderBySlug.get(a.slug) ?? 0) - (orderBySlug.get(b.slug) ?? 0))
      .map((m) => ({ name: m.name, slug: m.slug, isCreator: m.is_creator })),
  });
}

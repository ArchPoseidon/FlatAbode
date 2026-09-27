import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { createSession } from '@/lib/session';

export async function GET(request: NextRequest, ctx: RouteContext<'/m/[slug]'>) {
  const { slug } = await ctx.params;
  const supabase = getSupabaseAdmin();

  const { data: member } = await supabase
    .from('members')
    .select('id, group_id, onboarded_at')
    .eq('slug', slug)
    .maybeSingle();

  if (!member) {
    return NextResponse.redirect(new URL('/?invalid=1', request.url));
  }

  await createSession({ memberId: member.id, groupId: member.group_id, slug });

  const destination = member.onboarded_at ? '/dashboard' : '/onboarding';
  return NextResponse.redirect(new URL(destination, request.url));
}

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';
import OnboardingFlow from './OnboardingFlow';

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const supabase = getSupabaseAdmin();

  const [{ data: member }, { data: preferences }] = await Promise.all([
    supabase.from('members').select('name').eq('id', session.memberId).maybeSingle(),
    supabase.from('preferences').select('*').eq('member_id', session.memberId).maybeSingle(),
  ]);

  return <OnboardingFlow memberName={member?.name ?? 'there'} initial={preferences ?? null} />;
}

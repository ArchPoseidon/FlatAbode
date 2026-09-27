export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getDashboardData } from '@/lib/listings-data';
import Dashboard from './Dashboard';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const supabase = getSupabaseAdmin();
  const { data: member } = await supabase
    .from('members')
    .select('name, onboarded_at')
    .eq('id', session.memberId)
    .maybeSingle();

  if (!member?.onboarded_at) redirect('/onboarding');

  const data = await getDashboardData(session.groupId);

  return <Dashboard initialData={data} currentMemberId={session.memberId} currentMemberName={member.name} />;
}

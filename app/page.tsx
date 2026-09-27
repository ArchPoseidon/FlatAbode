export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase';
import LandingWizard from './LandingWizard';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const session = await getSession();
  if (session) {
    const { data: member } = await getSupabaseAdmin()
      .from('members')
      .select('onboarded_at')
      .eq('id', session.memberId)
      .maybeSingle();
    redirect(member?.onboarded_at ? '/dashboard' : '/onboarding');
  }

  const params = await searchParams;
  const invalidLink = params?.invalid === '1';

  return <LandingWizard invalidLink={invalidLink} />;
}

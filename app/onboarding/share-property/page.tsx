export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import ShareProperty from './ShareProperty';

export default async function SharePropertyPage() {
  const session = await getSession();
  if (!session) redirect('/');

  return <ShareProperty />;
}

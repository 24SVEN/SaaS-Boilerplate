import { redirect } from 'next/navigation';

import { getSession } from '@/libs/auth/session';

export default async function CenteredLayout(props: { children: React.ReactNode }) {
  const session = await getSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  );
}

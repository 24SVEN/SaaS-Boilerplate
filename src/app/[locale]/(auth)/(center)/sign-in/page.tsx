import { getTranslations } from 'next-intl/server';

import { Login } from '@/features/auth/Login';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({ locale: props.params.locale, namespace: 'SignIn' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function SignInPage() {
  return <Login mode="signin" />;
}

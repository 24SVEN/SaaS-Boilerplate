import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function UserProfilePage() {
  const t = useTranslations('UserProfile');
  return (
    <>
      <TitleBar title={t('title_bar')} description={t('title_bar_description')} />
      <p>Profile management coming soon.</p>
    </>
  );
}

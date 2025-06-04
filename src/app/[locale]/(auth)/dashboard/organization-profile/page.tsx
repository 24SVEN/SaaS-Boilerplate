import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function OrganizationProfilePage() {
  const t = useTranslations('OrganizationProfile');
  return (
    <>
      <TitleBar title={t('title_bar')} description={t('title_bar_description')} />
      <p>Organization management coming soon.</p>
    </>
  );
}

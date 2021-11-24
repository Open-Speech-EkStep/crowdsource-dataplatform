import { useTranslation } from 'next-i18next';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

const HomepageLink = () => {
  const { t } = useTranslation();

  return (
    <Link href={routePaths.home}>
      <a target="_blank">{t('homepage')}</a>
    </Link>
  );
};

export default HomepageLink;

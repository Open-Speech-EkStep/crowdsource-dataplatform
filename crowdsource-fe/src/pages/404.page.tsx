import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FourOFour from 'components/FourOFour';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

const Custom404 = () => <FourOFour />;

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default Custom404;

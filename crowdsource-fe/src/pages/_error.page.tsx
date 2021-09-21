// TODO: Convert this file to 404.page.tsx once we remove all the page toggles.
// Content of that file should be:
/*
  import type { NextPage, GetStaticProps } from 'next';
  import { useTranslation } from 'next-i18next';
  import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
  import ErrorComponent from 'next/error';

  import { DEFAULT_LOCALE } from 'constants/localesConstants';

  const FourOFour: NextPage = () => {
    const { t } = useTranslation();

    return <ErrorComponent statusCode={404} title={t('404Title')} />;
  };

  import type { NextPage, GetStaticProps } from 'next';
  import { useTranslation } from 'next-i18next';
  import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
  import ErrorComponent from 'next/error';

  import { DEFAULT_LOCALE } from 'constants/localesConstants';

  const FourOFour: NextPage = () => {
    const { t } = useTranslation();

    return <ErrorComponent statusCode={404} title={t('404Title')} />;
  };

  /* istanbul ignore next * /
  export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  };

  export default FourOFour;`
*/
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ErrorComponent from 'next/error';

import { DEFAULT_LOCALE } from 'constants/localesConstants';
import nodeConfig from 'constants/nodeConfig';

const is404 = (statusCode: number) => statusCode === 404;

const Error = ({ statusCode }: { statusCode: number }) => {
  const { t } = useTranslation();

  return <ErrorComponent statusCode={statusCode} title={is404(statusCode) ? t('404Title') : undefined} />;
};

/* istanbul ignore next */
export const getServerSideProps: GetServerSideProps = async ({
  res: { statusCode },
  locale = DEFAULT_LOCALE,
}) => {
  if (!nodeConfig.enabledPages['error'] && is404(statusCode)) {
    return {
      redirect: {
        destination: `/${locale}/not-found.html`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      statusCode,
    },
  };
};

export default Error;

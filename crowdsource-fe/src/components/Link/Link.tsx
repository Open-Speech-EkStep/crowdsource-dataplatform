import type { PropsWithChildren } from 'react';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';

const Link = ({ href, locale = undefined, ...rest }: PropsWithChildren<NextLinkProps>) => {
  const { locale: currentLocale, defaultLocale } = useRouter();
  const isDefaultLocale = locale ? locale === defaultLocale : currentLocale === defaultLocale;
  const hrefWithLocale = isDefaultLocale && defaultLocale ? `/${defaultLocale}${href}` : href;

  return <NextLink {...rest} href={hrefWithLocale} locale={locale} />;
};

export default Link;

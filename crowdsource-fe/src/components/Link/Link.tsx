import type { ReactNode } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface LinkProps {
  children: ReactNode;
  href: string;
  locale?: string;
}

const Link = ({ href, locale = undefined, ...rest }: LinkProps) => {
  const { locale: currentLocale, defaultLocale } = useRouter();
  const isDefaultLocale = locale ? locale === defaultLocale : currentLocale === defaultLocale;
  const hrefWithLocale = isDefaultLocale && defaultLocale ? `/${defaultLocale}${href}` : href;

  return <NextLink {...rest} href={hrefWithLocale} locale={locale} />;
};

export default Link;

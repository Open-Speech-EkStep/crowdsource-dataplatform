import NextLink from 'next/link';
import { useRouter } from 'next/router';

function Link({ href, locale, ...rest }) {
  const { locale: currentLocale, defaultLocale } = useRouter();
  const isDefaultLocale = locale ? locale === defaultLocale : currentLocale === defaultLocale;
  const hrefWithLocale = isDefaultLocale ? `/${defaultLocale}${href}` : href;

  return <NextLink {...rest} href={hrefWithLocale} locale={locale} />;
}

export default Link;

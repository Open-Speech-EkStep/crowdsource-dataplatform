import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const propTypes = {
  href: PropTypes.string.isRequired,
  locale: PropTypes.string,
};

function Link({ href, locale, ...rest }) {
  const { locale: currentLocale, defaultLocale } = useRouter();
  const isDefaultLocale = locale ? locale === defaultLocale : currentLocale === defaultLocale;
  const hrefWithLocale = isDefaultLocale && defaultLocale ? `/${defaultLocale}${href}` : href;

  return <NextLink {...rest} href={hrefWithLocale} locale={locale} />;
}

Link.propTypes = propTypes;

export default Link;

import classnames from 'classnames';
import { useRouter } from 'next/router';

import Link from 'components/Link';
import { DISPLAY_LANGUAGES } from 'constants/localesConstants';

function LanguageSwitcher() {
  const { asPath: currentRoutePath, locale: currentLocale, locales } = useRouter();

  return (
    <ul className="navbar-nav">
      {locales.map(locale => (
        <li key={locale} className="nav-item">
          <Link href={currentRoutePath} locale={locale}>
            <a className={classnames('nav-link', { active: currentLocale === locale })}>
              {DISPLAY_LANGUAGES[locale]}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default LanguageSwitcher;

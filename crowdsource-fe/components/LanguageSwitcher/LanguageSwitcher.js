import Link from 'next/link';
import { useRouter } from 'next/router';

import translationConstants from 'constants/translationConstants';

function LanguageSwitcher() {
  const { asPath: currentRoutePath, locales, pathname, query } = useRouter();

  return (
    <ul className="navbar-nav">
      {locales.map(locale => (
        <li key={locale} className="nav-item">
          <Link href={{ pathname, query }} as={currentRoutePath} locale={locale}>
            <a className="nav-link">{translationConstants[locale]}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default LanguageSwitcher;

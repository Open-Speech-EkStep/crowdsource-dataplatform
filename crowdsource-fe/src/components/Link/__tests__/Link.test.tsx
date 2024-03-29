import router from 'next/router';

import { render, verifyAxeTest } from 'utils/testUtils';

import Link from '../Link';

describe('Link', () => {
  const { defaultLocale } = router;

  beforeEach(() => {
    router.defaultLocale = 'en';
  });

  afterEach(() => {
    router.defaultLocale = defaultLocale;
  });

  const setup = (locale?: string) =>
    render(
      <Link href="/some/path" locale={locale}>
        <a>Some link</a>
      </Link>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the component and matches it against stored snapshot when passed locale is same as default locale', () => {
    const { asFragment } = setup('en');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the component and matches it against stored snapshot when passed locale is different than default locale', () => {
    const { asFragment } = setup('hi');

    expect(asFragment()).toMatchSnapshot();
  });
});

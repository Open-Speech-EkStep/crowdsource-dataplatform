import { axe } from 'jest-axe';
import router from 'next/router';

import { render } from 'utils/testUtils';

import Link from '../Link';

describe('Link', () => {
  const { defaultLocale } = router;

  beforeEach(() => {
    router.defaultLocale = 'en';
  });

  afterEach(() => {
    router.defaultLocale = defaultLocale;
  });

  const setup = locale =>
    render(
      <Link href="/some/path" locale={locale}>
        <a>Some link</a>
      </Link>
    );

  it('should not fail an axe audit', async () => {
    const { container } = setup();

    expect(await axe(container)).toHaveNoViolations();
  });

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

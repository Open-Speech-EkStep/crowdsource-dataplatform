import React from 'react';

import router from 'next/router';

import { render, screen, userEvent, verifyAxeTest } from 'utils/testUtils';

import TermsAndConditions from '../TermsAndConditions';

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn().mockReturnValue({
    current: {
      offsetTop: 200,
    },
  });
  return {
    ...originReact,
    useRef: mUseRef,
  };
});

const useMockRef = jest.spyOn(React, 'useRef');

describe('TermsAndConditions', () => {
  const mockScrollToFn = jest.fn();
  window.scrollTo = mockScrollToFn;
  window.location.hash = '#terms-of-use';

  router.push = jest.fn();

  const setup = () => {
    return render(<TermsAndConditions />);
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should scroll to terms of use section', async () => {
    const ref = { current: {} };
    Object.defineProperty(ref, 'current', {
      set(_current) {
        if (_current) {
          jest.spyOn(_current, 'offsetTop', 'get').mockReturnValueOnce(200);
        }
        this._current = _current;
      },
      get() {
        return this._current;
      },
    });
    useMockRef.mockReturnValueOnce(ref);
    setup();
    userEvent.click(screen.getByTestId('TermsOfUse'));
    expect(router.push).toHaveBeenCalledWith({ hash: 'terms-of-use', pathname: '/terms-and-conditions/' });
    router.events.emit('hashChangeComplete');
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', top: 56 });
  });

  it('should scroll to privacy policy section', async () => {
    setup();
    userEvent.click(screen.getByTestId('PrivacyPolicy'));
    expect(router.push).toHaveBeenCalledWith({ hash: 'privacy-policy', pathname: '/terms-and-conditions/' });
  });

  it('should scroll to copyright section', async () => {
    setup();
    userEvent.click(screen.getByTestId('Copyright'));
    expect(router.push).toHaveBeenCalledWith({ hash: 'copyright', pathname: '/terms-and-conditions/' });
  });
});

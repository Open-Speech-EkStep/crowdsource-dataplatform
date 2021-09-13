/* eslint-disable jest/no-export */
import type { ReactNode, ReactElement, ComponentType } from 'react';

import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';

const Wrapper: ComponentType = ({ children }: { children?: ReactNode }) => children as ReactElement;

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { renderHook } from '@testing-library/react-hooks';

// override render method
export { customRender as render };

type VerifyAxeTestParams =
  | { container: RenderResult['container'] }
  | (() => { container: RenderResult['container'] });
export const verifyAxeTest = (params: VerifyAxeTestParams) => {
  it('should not fail an axe audit', async () => {
    let axeResult;

    await act(async () => {
      axeResult = await axe(typeof params === 'function' ? params().container : params.container);
    });

    expect(axeResult).toHaveNoViolations();
  });
};

export const verifyVRTest = (title: string, url: string, cb?: (page: Page) => Promise<void>) => {
  describe(`${title} VR test`, () => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: true,
        devtools: false,
        ignoreHTTPSErrors: true,
        args: ['--start-fullscreen'],
      });
    });

    it('match snapshot', async () => {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      await page.addStyleTag({
        content: `
      *,
      *::after,
      *::before {
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          animation-delay: -0.0001s !important;
          animation-duration: 0s !important;
          animation-play-state: paused !important;
          caret-color: transparent !important;
      }
      `,
      });

      cb && (await cb(page));

      const image = await page.screenshot({
        fullPage: true,
      });

      expect(image).toMatchImageSnapshot();
    });

    afterAll(async () => {
      await browser.close();
    });
  });
};

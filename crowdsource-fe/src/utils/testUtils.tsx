/* eslint-disable jest/no-export */
import type { ReactNode, ReactElement, ComponentType } from 'react';

import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

const Wrapper: ComponentType = ({ children }: { children?: ReactNode }) => children as ReactElement;

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { renderHook } from '@testing-library/react-hooks';

// override render method
export { customRender as render };

export const verifyAxeTest = ({ container }: { container: RenderResult['container'] }) => {
  it('should not fail an axe audit', async () => {
    let axeResult;

    await act(async () => {
      axeResult = await axe(container);
    });

    expect(axeResult).toHaveNoViolations();
  });
};

export const verifyVRTest = (title: string, url: string) => {
  describe(`${title} VR test`, () => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: true,
      });
    });

    it('match snapshot', async () => {
      const page = await browser.newPage();
      await page.setViewport({
        width: 1920,
        height: 0,
        deviceScaleFactor: 1,
      });
      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      const bodyHandle = await page.$('body');
      const boundingBox = await bodyHandle?.boundingBox();
      const image = await page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width: boundingBox?.width as number,
          height: boundingBox?.height as number,
        },
      });
      // const image = await page.screenshot({ fullPage: true });

      expect(image).toMatchImageSnapshot();
    });

    afterAll(async () => {
      await browser.close();
    });
  });
};

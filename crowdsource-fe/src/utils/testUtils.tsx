/* eslint-disable jest/no-export */
import type { ReactNode, ReactElement, ComponentType } from 'react';

import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render, act } from '@testing-library/react';
import { axe } from 'jest-axe';

const Wrapper: ComponentType = ({ children }: { children?: ReactNode }) => children as ReactElement;

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
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

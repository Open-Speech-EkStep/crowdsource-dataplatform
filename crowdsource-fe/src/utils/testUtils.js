/* eslint-disable jest/no-export */
import { render, act } from '@testing-library/react';
import { axe } from 'jest-axe';

const Wrapper = ({ children }) => children;

const customRender = (ui, options) => render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { renderHook } from '@testing-library/react-hooks';

// override render method
export { customRender as render };

export const verifyAxeTest = ({ container }) => {
  it('should not fail an axe audit', async () => {
    let axeResult;

    await act(async () => {
      axeResult = await axe(container);
    });

    expect(axeResult).toHaveNoViolations();
  });
};

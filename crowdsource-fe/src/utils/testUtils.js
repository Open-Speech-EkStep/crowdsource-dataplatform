import { render } from '@testing-library/react';

const Wrapper = ({ children }) => children;

const customRender = (ui, options) => render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { renderHook } from '@testing-library/react-hooks';

// override render method
export { customRender as render };

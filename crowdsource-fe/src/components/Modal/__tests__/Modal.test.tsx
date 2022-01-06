import type { ReactNode } from 'react';

import { render, verifyAxeTest, screen } from 'utils/testUtils';

import Modal from '../Modal';

describe('Modal', () => {
  const setup = (
    props: {
      title?: string;
      subTitle?: string;
      footer?: ReactNode;
    } = {
      title: 'title',
      subTitle: 'subTitle',
      footer: <button type="submit">Done</button>,
    }
  ) =>
    render(
      <Modal {...props} show>
        <div>Hello world</div>
      </Modal>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    setup();

    expect(screen.getByTestId('Modal')).toMatchSnapshot();
  });

  it('should render the component and matches it against stored snapshot with default prop values', () => {
    setup({});

    expect(screen.getByTestId('Modal')).toMatchSnapshot();
  });
});

describe('Modal Not in DOM', () => {
  const setup = (
    props: {
      title?: string;
      subTitle?: string;
      footer?: ReactNode;
    } = {
      title: 'title',
      subTitle: 'subTitle',
      footer: <button type="submit">Done</button>,
    }
  ) =>
    render(
      <Modal {...props}>
        <div>Hello world</div>
      </Modal>
    );

  it('should render the component and matches it against stored snapshot', () => {
    setup();

    expect(screen.queryByTestId('Modal')).not.toBeInTheDocument();
  });
});

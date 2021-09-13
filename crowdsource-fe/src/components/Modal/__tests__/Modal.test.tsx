import { render, verifyAxeTest } from 'utils/testUtils';

import Modal from '../Modal';

describe('Modal', () => {
  const setup = () =>
    render(
      <Modal title="title" subTitle="subTitle" footer={<button type="submit">Done</button>}>
        <div>Hello world</div>
      </Modal>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});

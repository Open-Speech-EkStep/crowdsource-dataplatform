import { when } from 'jest-when';
import router from 'next/router';

import {
  render,
  verifyAxeTest,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from 'utils/testUtils';

import Medal from '../Medal';

describe('Medal', () => {
  const setup = (
    props: {
      medal: string;
      action: string;
      initiative: string;
      language: string;
    } = {
      medal: 'testmedal',
      action: 'testaction',
      initiative: 'initiative',
      language: 'language',
    }
  ) => render(<Medal {...props}></Medal>);

  setup();

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});

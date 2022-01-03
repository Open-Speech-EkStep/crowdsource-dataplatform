/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render } from 'utils/testUtils';

import TranslationInitiativeDetails from '../TranslationInitiativeDetails';

describe('Translation Actions', () => {
  const setup = () => {
    return render(<TranslationInitiativeDetails />);
  };

  it('should render the translation Initiative homepage', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});

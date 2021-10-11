import '__fixtures__/mockComponentsWithSideEffects';
import { render } from '@testing-library/react';

import { screen } from 'utils/testUtils';

import SunoDashboard from '../SunoDashboard';

describe('SunoDashboard', () => {
  const setup = () => {
    return render(<SunoDashboard />);
  };

  it('should render snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain language selector', () => {
    setup();
    expect(screen.getByRole('combobox', { name: 'Select Language' })).toBeInTheDocument();
  });
});

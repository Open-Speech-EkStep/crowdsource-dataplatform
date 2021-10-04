/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen } from 'utils/testUtils';

import RecordPage from '../../sunoIndia/record.page';

describe('Suno Home page', () => {
  const setup = () => {
    return render(<RecordPage />);
  };

  it('should render the suno india record component', () => {
    setup();

    expect(screen.getByTestId('Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
    expect(screen.getAllByTestId('IconTextButton')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('IconTextButton')[1]).toBeInTheDocument();
    expect(screen.getByTestId('SunoTranscribe')).toBeInTheDocument();
  });
});

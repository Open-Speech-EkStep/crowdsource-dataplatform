import { render, screen, userEvent, verifyAxeTest } from 'utils/testUtils';

import ImageView from '../ImageView';

describe('ImageView', () => {
  const setup = () => render(<ImageView imageUrl="images/photos.png" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should expand and collapse the image', async () => {
    setup();

    const collapseViewImage = screen.getByAltText('OCR Data');
    const expandViewBtn = screen.getByTestId('ExpandView');

    expect(expandViewBtn).toBeInTheDocument();
    expect(collapseViewImage).toBeInTheDocument();

    userEvent.click(expandViewBtn);

    expect(expandViewBtn).not.toBeInTheDocument();
    expect(collapseViewImage).not.toBeInTheDocument();

    const expandViewImage = screen.getByAltText('OCR Data Expanded');
    const collapseViewBtn = screen.getByTestId('CollapseView');

    expect(collapseViewBtn).toBeInTheDocument();
    expect(expandViewImage).toBeInTheDocument();

    userEvent.click(collapseViewBtn);

    expect(collapseViewBtn).not.toBeInTheDocument();
    expect(expandViewImage).not.toBeInTheDocument();
  });
});

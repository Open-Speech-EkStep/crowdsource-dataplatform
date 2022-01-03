import { render, screen, userEvent, verifyAxeTest, waitFor } from 'utils/testUtils';

import ImageView from '../ImageView';

describe('ImageView', () => {
  const mockViewUpdate = jest.fn();
  const setup = (expandState: boolean) =>
    render(
      <ImageView imageUrl="images/photos.png" expandState={expandState} handleExpandView={mockViewUpdate} />
    );

  verifyAxeTest(setup(false));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup(false);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should expand image', async () => {
    setup(false);

    const collapseViewImage = screen.getByAltText('OCR Data');
    const expandViewBtn = screen.getByTestId('ExpandView');

    expect(expandViewBtn).toBeInTheDocument();
    expect(collapseViewImage).toBeInTheDocument();

    userEvent.click(expandViewBtn);
    expect(mockViewUpdate).toBeCalledWith(true);
  });

  it('should collapse the image', async () => {
    setup(true);

    const expandViewImage = screen.getByAltText('OCR Data Expanded');
    const collapseViewBtn = screen.getByTestId('CollapseView');

    userEvent.click(collapseViewBtn);
    expect(mockViewUpdate).toBeCalledWith(false);

    await waitFor(() => {
      expect(collapseViewBtn).toBeInTheDocument();
      expect(expandViewImage).toBeInTheDocument();
    });
  });
});

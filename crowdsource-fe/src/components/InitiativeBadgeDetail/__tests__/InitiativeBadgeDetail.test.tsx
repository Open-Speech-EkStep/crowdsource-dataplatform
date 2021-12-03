import { render, verifyAxeTest, screen, userEvent } from 'utils/testUtils';

import InitiativeBadgeDetail from '../InitiativeBadgeDetail';

describe('InitiativeBadgeDetail', () => {
  const setup = async (
    initiative: 'suno' | 'likho' | 'bolo' | 'dekho',
    language: string,
    action: 'contribute' | 'validate',
    badge: 'bronze' | 'silver' | 'gold' | 'platinum'
  ) => {
    const renderResult = render(
      <InitiativeBadgeDetail
        initiative={initiative}
        language={language}
        action={action}
        badge={badge}
        onSelectSourceType={() => {}}
        onSelectBadgeType={() => {}}
      />
    );

    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup('suno', 'english', 'contribute', 'bronze'));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('suno', 'english', 'contribute', 'bronze');

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('Platinum')).toBeInTheDocument();
    expect(screen.getByText('selectBadgeLevelPrompt')).toBeInTheDocument();
  });

  it('should activate validate badges when validate radio button is selected', async () => {
    await setup('suno', 'english', 'contribute', 'bronze');
    expect(screen.getByTestId('action2')).not.toBeChecked();
    userEvent.click(screen.getByTestId('action2'));
    expect(screen.getByTestId('action2')).toBeChecked();
    expect(screen.getByTestId('action1')).not.toBeChecked();
  });

  it('should activate contribute badges when contribute radio button is selected', async () => {
    await setup('suno', 'english', 'validate', 'bronze');
    expect(screen.getByTestId('action1')).not.toBeChecked();
    userEvent.click(screen.getByTestId('action1'));
    expect(screen.getByTestId('action1')).toBeChecked();
    expect(screen.getByTestId('action2')).not.toBeChecked();
  });

  it('should activate silver badges when silver medal is selected', async () => {
    await setup('suno', 'english', 'contribute', 'bronze');
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Silver').parentElement).not.toHaveClass('active');
    userEvent.click(screen.getByText('Silver'));
    expect(screen.getByText('Silver').parentElement).toHaveClass('active');
  });
});

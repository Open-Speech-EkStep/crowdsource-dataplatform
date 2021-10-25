import { render } from 'utils/testUtils';

import MedalGallery from '../MedalGallery';

describe('MedalGallery', () => {
  const setup = (
    props: {
      userName: string;
      userBadges: any;
    } = {
      userName: 'testUser',
      userBadges: [],
    }
  ) => render(<MedalGallery {...props}></MedalGallery>);

  setup();

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the userName', () => {
    const { container } = setup();

    let usernameContainer = container.querySelector('[class="highlight"]');

    expect(usernameContainer?.innerHTML).toEqual('testUser');
  });

  it('should not render the badgeSection if userBadges is empty', () => {
    const { container } = setup();

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).toBeNull();
  });

  it('should render the badgeSection if userBadges is not empty', () => {
    const { container } = setup({
      userName: 'testUser',
      userBadges: [{}, {}],
    });

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).not.toBeNull();
  });

  it('should not render the badgeSection if userBadges is empty and show info message', () => {
    const { container } = setup({
      userName: 'testUser',
      userBadges: [],
    });

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).toBeNull();

    let infoMessage = container.querySelector('[class="w-100"]');

    console.log(infoMessage);

    expect(infoMessage?.innerHTML).toEqual('No badge earned for suno India');
  });
});

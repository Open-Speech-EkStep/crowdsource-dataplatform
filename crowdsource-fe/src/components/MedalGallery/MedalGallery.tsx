import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import LanguageMedals from 'components/LanguageMedals';

import styles from './MedalGallery.module.scss';
import BadgeSection from 'components/BadgeSection';
import { string } from 'yargs';

interface MedalGalleryProps {
  userName?: string | '';
  userBadges?: any;
}

const MedalGallery = ({ userName, userBadges }: MedalGalleryProps) => {
  const initiatives = ['suno', 'bolo', 'likho', 'dekho'];
  const languages = ['en', 'hi'];
  const { t } = useTranslation();

  const hasBadges = () => {
    return userBadges.length > 0;
  };

  function handleTabClick(tab: any, event: any) {
    event.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }

  return (
    <div className={styles.root}>
      <header className="text-center">
        <h2>
          Congratulations <span className={styles.highlight}>{userName}</span>!
        </h2>
        <h3 className="mt-3">Your Medal Gallery</h3>
      </header>
      <div className="font-family-rowdies mt-7 mt-md-9">
        <Tabs
          defaultActiveKey={initiatives[0]}
          id="uncontrolled-tab-example"
          className={`${styles.tabs} d-flex align-items-center border-bottom border-1 border-primary-60 hide-scrollbar`}
          onSelect={handleTabClick}
        >
          {initiatives.map(initiative => (
            <Tab
              key={initiative}
              eventKey={initiative}
              title={`${t(initiative)} ${t('india')}`}
              tabClassName={`${styles.tabLink} position-relative h-100 display-3 px-6 mx-md-0`}
            >
              <div className={`${styles.badgeSection} py-5`}>
                {hasBadges() ? (
                  <BadgeSection languages={languages} initiative={initiative} />
                ) : (
                  <Col className="p-0">
                    <Row className="mx-0 text-center mt-5">
                      <h4 className="w-100">No badge earned for {initiative} India</h4>
                    </Row>
                  </Col>
                )}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
      <div className={styles.text}>
        <p className="m-0">Please keep contributing actively to stand a chance to get recognised.</p>
        <p className="m-0">Your contribution will be validated before confirming the badge.</p>
      </div>
    </div>
  );
};

export default MedalGallery;

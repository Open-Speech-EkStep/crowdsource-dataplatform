import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import BadgeSection from 'components/BadgeSection';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';
import type SpeakerDetails from 'types/SpeakerDetails';
import { groupBy } from 'utils/utils';

import styles from './MedalGallery.module.scss';

const MedalGallery = () => {
  const initiatives: Array<Initiative> = ['suno', 'bolo', 'likho', 'dekho'];

  const { t } = useTranslation();

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const userRewardsApi = `${apiPaths.userRewards}/${speakerDetails?.userName || ''}`;

  const { data: userBadges, mutate } = useFetch<any>(userRewardsApi, { revalidateOnMount: false });

  useEffect(() => {
    if (speakerDetails) {
      mutate();
    }
  }, [speakerDetails, mutate]);

  let groupByInitiative: any = [];

  if (userBadges?.length) {
    groupByInitiative = groupBy(userBadges, 'type');
  }

  const hasBadges = (initiative: Initiative) => {
    return userBadges?.some((pair: any) => pair.type === INITIATIVES_MEDIA_MAPPING[initiative]);
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
          Congratulations <span className={styles.highlight}>{speakerDetails?.userName}</span>!
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
          {initiatives.map((initiative: Initiative) => (
            <Tab
              key={initiative}
              eventKey={initiative}
              title={`${t(initiative)} ${t('india')}`}
              tabClassName={`${styles.tabLink} position-relative h-100 display-3 px-6 mx-md-0`}
            >
              <div className={`${styles.badgeSection} py-5`}>
                {hasBadges(initiative) ? (
                  <BadgeSection
                    initiative={initiative}
                    initiativeBadge={groupByInitiative[INITIATIVES_MEDIA_MAPPING[initiative]]}
                  />
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

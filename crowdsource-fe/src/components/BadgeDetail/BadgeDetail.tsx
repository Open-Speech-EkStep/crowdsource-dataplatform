import { useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import InitiativeBadgeDetail from 'components/InitiativeBadgeDetail';
import LanguageDropDown from 'components/LanguageDropDown';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import routePaths from 'constants/routePaths';
import type { Initiative } from 'types/Initiatives';

import styles from './BadgeDetail.module.scss';

const BadgeDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const { language, initiative, source } = router.query;

  const [defaultLanguage, setLanguage] = useState(language || 'English');
  const [defaultInitiative, setDefaultInitiative] = useState<Initiative>(
    INITIATIVES_MAPPING[initiative as Initiative] || INITIATIVES_MAPPING.suno
  );
  const defaultAction = source || 'contribute';

  const setRoutingParam = (
    initiative: Initiative,
    language: string | string[],
    source: string | string[] | undefined
  ) => {
    router.push(
      `/${currentLocale}${routePaths.badges}?initiative=${initiative}&language=${language}&source=${source}`,
      undefined,
      {
        locale: currentLocale,
      }
    );
  };

  function handleTabClick(tab: any, event: any) {
    event.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
    setDefaultInitiative(tab);
    setRoutingParam(tab, defaultLanguage, source);
  }

  return (
    <div data-testid="BadgeDetail">
      <header>
        <h2 className="mb-5 mb-md-8">{t('badgesDetailPageHeading')}</h2>
        <LanguageDropDown
          selectedLanguage={defaultLanguage as string}
          updateSelectedLanguage={selectedLanguage => {
            setRoutingParam(defaultInitiative, selectedLanguage, source);
            setLanguage(selectedLanguage);
          }}
        />
      </header>
      <div className="font-family-rowdies mt-7 mt-md-9">
        <Tabs
          activeKey={defaultInitiative}
          id="uncontrolled-tab-example"
          className={`${styles.tabs} d-flex align-items-center border-bottom border-1 border-primary-60 hide-scrollbar`}
          onSelect={handleTabClick}
        >
          {Object.values(INITIATIVES_MAPPING).map((initiativeName: string) => (
            <Tab
              key={initiativeName}
              eventKey={initiativeName}
              title={`${t(initiativeName)} ${t('india')}`}
              tabClassName={`${styles.tabLink} position-relative h-100 display-3 px-6 mx-md-0`}
            ></Tab>
          ))}
        </Tabs>
        <div className="py-5">
          <InitiativeBadgeDetail
            initiative={defaultInitiative}
            language={defaultLanguage as string}
            action={defaultAction as string}
            onSelectSourceType={(type: string) => setRoutingParam(defaultInitiative, defaultLanguage, type)}
          />
        </div>
      </div>
      <div className="display-4">
        <p className="m-0">{t('badgeInfoText1')}</p>
        <p className="m-0">{t('badgeInfoText2')}</p>
      </div>
    </div>
  );
};

export default BadgeDetail;

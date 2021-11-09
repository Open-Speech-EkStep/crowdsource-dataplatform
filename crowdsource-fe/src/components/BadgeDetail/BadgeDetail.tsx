import { useState, useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import InitiativeBadgeDetail from 'components/InitiativeBadgeDetail';
import LanguageDropDown from 'components/LanguageDropDown';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { pageInitiativeRouteConstants, pageSourceConstants } from 'constants/pageRouteConstants';
import sessionStorageConstants from 'constants/sessionStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';

import styles from './BadgeDetail.module.scss';

const BadgeDetail = () => {
  const { t } = useTranslation();

  const [contributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  const [language, setLanguage] = useState<string>('English');
  const [defaultInitiative, setDefaultInitiative] = useState<Initiative>(INITIATIVES_MAPPING.suno);
  const [defaultAction, setDefaultAction] = useState<string>('contribute');

  function handleTabClick(tab: any, event: any) {
    event.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
    setDefaultInitiative(tab);
  }

  useEffect(() => {
    const prevPath = sessionStorage.getItem(sessionStorageConstants.prevPath) || '';
    const moduleName = pageInitiativeRouteConstants[prevPath] || 'Others';
    const allModules = Object.values(INITIATIVES_MAPPING);
    if (moduleName.toLowerCase() !== 'Others') {
      const initiativeName =
        allModules.find(module => module == moduleName.toLowerCase()) || INITIATIVES_MAPPING.suno;
      const source = prevPath ? pageSourceConstants[prevPath] || 'contribute' : 'contribute';
      setLanguage(contributionLanguage ? contributionLanguage : 'English');
      setDefaultInitiative(initiativeName);
      setDefaultAction(source);
    }
  }, [contributionLanguage]);

  return (
    <div data-testid="BadgeDetail">
      <header>
        <h2 className="mb-5 mb-md-8">{t('badgesDetailPageHeading')}</h2>
        <LanguageDropDown
          selectedLanguage={language}
          updateSelectedLanguage={selectedLanguage => setLanguage(selectedLanguage)}
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
          <InitiativeBadgeDetail initiative={defaultInitiative} language={language} action={defaultAction} />
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

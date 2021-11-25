import { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import InitiativeBadgeDetail from 'components/InitiativeBadgeDetail';
import LanguageDropDown from 'components/LanguageDropDown';
import {
  INITIATIVES_MAPPING,
  INITIATIVES_MEDIA_MAPPING,
  INITIATIVES_REVERSE_MEDIA_MAPPING,
} from 'constants/initiativeConstants';
import { MEDALS } from 'constants/medalConstants';
import { sourceConstants } from 'constants/pageRouteConstants';
import routePaths from 'constants/routePaths';
import type { Initiative } from 'types/Initiatives';
import type { InitiativeType } from 'types/InitiativeType';
import type { MedalsType } from 'types/MedalsType';
import type { SourceType } from 'types/SourceType';

import styles from './BadgeDetail.module.scss';

const BadgeDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale: currentLocale } = useRouter();
  const { language, initiative, source, badge } = router.query;

  const [defaultLanguage, setLanguage] = useState((language as string) || 'English');
  const [defaultInitiative, setDefaultInitiative] = useState<Initiative>(
    INITIATIVES_REVERSE_MEDIA_MAPPING[initiative as InitiativeType] || INITIATIVES_MAPPING.suno
  );
  const defaultAction: SourceType = (source as SourceType) || sourceConstants.contribute;
  const defaultBadge = (badge as MedalsType) || MEDALS[0];

  const setRoutingParam = (
    initiative: InitiativeType,
    language: string,
    source: SourceType,
    badge: MedalsType
  ) => {
    router.push(
      `/${currentLocale}${routePaths.badges}?initiative=${initiative}&language=${language}&source=${source}&badge=${badge}`,
      undefined,
      {
        locale: currentLocale,
      }
    );
  };

  function handleTabClick(tab: string | null, event: any) {
    event.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
    setDefaultInitiative(tab as Initiative);
    setRoutingParam(
      INITIATIVES_MEDIA_MAPPING[tab as Initiative],
      defaultLanguage,
      defaultAction,
      defaultBadge
    );
  }

  useEffect(() => {
    setRoutingParam(
      INITIATIVES_MEDIA_MAPPING[defaultInitiative],
      defaultLanguage,
      defaultAction,
      defaultBadge
    );
  }, []);

  return (
    <div data-testid="BadgeDetail">
      <header>
        <h2 className="mb-5 mb-md-8">{t('badgesDetailPageHeading')}</h2>
        <LanguageDropDown
          selectedLanguage={defaultLanguage as string}
          updateSelectedLanguage={selectedLanguage => {
            setRoutingParam(
              INITIATIVES_MEDIA_MAPPING[defaultInitiative],
              selectedLanguage,
              defaultAction,
              defaultBadge
            );
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
            action={defaultAction as SourceType}
            badge={defaultBadge as MedalsType}
            onSelectSourceType={(type: SourceType) =>
              setRoutingParam(
                INITIATIVES_MEDIA_MAPPING[defaultInitiative],
                defaultLanguage,
                type,
                defaultBadge
              )
            }
            onSelectBadgeType={(badge: MedalsType) =>
              setRoutingParam(
                INITIATIVES_MEDIA_MAPPING[defaultInitiative],
                defaultLanguage,
                defaultAction,
                badge
              )
            }
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

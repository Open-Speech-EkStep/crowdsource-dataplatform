import React, { useState, useEffect } from 'react';

import { useTranslation, Trans } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import ImageBasePath from 'components/ImageBasePath';
import Medal from 'components/Medal';
import TriColorGradientBg from 'components/TriColorGradientBg';
import apiPaths from 'constants/apiPaths';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import { MEDALS, MEDALS_MAPPING } from 'constants/medalConstants';
import nodeConfig from 'constants/nodeConfig';
import { sourceConstants } from 'constants/pageRouteConstants';
import { useFetchWithInit } from 'hooks/useFetch';
import type { Initiative } from 'types/Initiatives';
import type { MedalsType } from 'types/MedalsType';
import type { SourceType } from 'types/SourceType';
import { capitalizeFirstLetter, isLanguageImageAvailable } from 'utils/utils';

import styles from './InitiativeBadgeDetail.module.scss';

interface InitiativeBadgeDetailProps {
  action: SourceType;
  initiative: Initiative;
  language: string;
  badge: MedalsType;
  onSelectSourceType: (value: SourceType) => void;
  onSelectBadgeType: (value: MedalsType) => void;
}

const InitiativeBadgeDetail = ({
  initiative,
  action,
  language,
  badge,
  onSelectSourceType,
  onSelectBadgeType,
}: InitiativeBadgeDetailProps) => {
  const languageCode = LOCALE_LANGUAGES[language];
  const { t } = useTranslation();

  const languagePrefix = isLanguageImageAvailable(languageCode);

  const [participatedAction, setParticipatedAction] = useState<SourceType>(action);

  const [selectedMedal, setSelectedMedal] = useState<MedalsType>(MEDALS_MAPPING[badge] as MedalsType);
  const { data, mutate: rewardMutate } = useFetchWithInit<Array<{ contributions: number; badge: string }>>(
    `${apiPaths.rewardInfo}?type=${INITIATIVES_MEDIA_MAPPING[initiative]}&source=${participatedAction}&language=${language}`,
    {
      revalidateOnMount: false,
    }
  );

  useEffect(() => {
    setParticipatedAction(action);
  }, [action]);

  useEffect(() => {
    rewardMutate();
  }, [participatedAction, initiative, language, rewardMutate]);

  const contributionCount = data && data[MEDALS.indexOf(selectedMedal)].contributions;

  return (
    <div data-testid="InitiativeBadgeDetail">
      <Row className="py-5" data-testid="badgeLevelRow">
        <Col md="3" className="d-flex align-items-center fw-light display-3">
          {t('selectBadgeLevelPrompt')}
        </Col>
        <Col md="9" className="d-flex justify-content-between justify-content-lg-start mt-5 mt-md-0">
          {MEDALS.map(medal => (
            <div key={medal} className={styles.medal}>
              <Medal
                initiative={initiative}
                selectedMedal={selectedMedal}
                medal={medal}
                action={participatedAction}
                language={language}
                handleClick={() => {
                  onSelectBadgeType(medal as MedalsType);
                  setSelectedMedal(medal as MedalsType);
                }}
              />
            </div>
          ))}
        </Col>
      </Row>
      <Row className="py-5" data-testid="participationRow">
        <Col md="3" className="d-flex align-items-center fw-light display-3">
          {t('participation')}
        </Col>
        <Col md="9" className="d-flex justify-content-between justify-content-md-start mt-5 mt-md-0">
          <Form.Group className="fw-light display-3" controlId="action">
            <Form.Check
              inline
              type="radio"
              id="action1"
              data-testid="action1"
              label={t('contribution')}
              value="Contribution"
              name="action"
              className="me-9"
              checked={participatedAction == (sourceConstants.contribute as SourceType)}
              onChange={() => {
                setParticipatedAction(sourceConstants.contribute);
                onSelectSourceType(sourceConstants.contribute);
              }}
            />
            <Form.Check
              inline
              type="radio"
              id="action2"
              data-testid="action2"
              label={t('validation')}
              value="Validation"
              name="action"
              checked={participatedAction == (sourceConstants.validate as SourceType)}
              onChange={() => {
                setParticipatedAction(sourceConstants.validate);
                onSelectSourceType(sourceConstants.validate);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <section className="py-5">
        <TriColorGradientBg>
          <Row>
            <Col
              xs={{ order: 1, span: 12 }}
              md={{ order: 2, span: 4 }}
              className="d-flex align-items-center justify-content-center"
            >
              <div className={styles.medalImg}>
                <ImageBasePath
                  src={`/images/${nodeConfig.brand}/${languagePrefix}/badges/${languagePrefix}_${
                    INITIATIVES_MAPPING[initiative]
                  }_${selectedMedal}_${participatedAction.toLowerCase()}.svg`}
                  width="250"
                  height="320"
                  alt={`Bronze Badge ${language}`}
                />
              </div>
            </Col>
            <Col
              xs={{ order: 2, span: 12 }}
              md={{ order: 1, span: 8 }}
              className="d-flex align-items-center justify-content-center text-center text-md-start mt-5 mt-md-0"
            >
              <div className={styles.heading}>
                <h2>
                  <Trans
                    i18nKey={`badgeDetailText`}
                    defaults={`badgeDetailText`}
                    values={{
                      action: t(participatedAction),
                      initiativeName: capitalizeFirstLetter(`${t(initiative)} ${t('initiativeTextSuffix')}`),
                      badge: capitalizeFirstLetter(t(selectedMedal.toLowerCase())),
                      language: capitalizeFirstLetter(t(language.toLowerCase())),
                      sourceType: t(`${INITIATIVES_MAPPING[initiative]}SourceType`).toLocaleLowerCase(),
                      count: contributionCount,
                    }}
                    components={{ span: <span className="text-warning" /> }}
                  />
                </h2>
              </div>
            </Col>
          </Row>
        </TriColorGradientBg>
      </section>
    </div>
  );
};

export default InitiativeBadgeDetail;

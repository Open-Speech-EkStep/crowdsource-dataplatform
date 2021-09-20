import type { ChangeEvent } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import ActionCard from 'components/ActionCard';
import apiPaths from 'constants/apiPaths';
import { INITIATIVE_ACTIONS, INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useFetch from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './ContributionActions.module.scss';

interface ContributionActionProps {
  initiativeMedia: string;
}

const ContributionActions = (props: ContributionActionProps) => {
  const { locales } = useRouter();
  const { t } = useTranslation();
  const initiative = INITIATIVES_MAPPING.suno;
  // const barChartColor = ['#5d6d9a', '#85A8F9', '#B7D0FE', '#6C85CE'];
  // const data = {
  //   id: 'line_chart',
  //   data: [
  //     {
  //       category: 'Male',
  //       value: 2025,
  //     },
  //     {
  //       category: 'Female',
  //       value: 1882,
  //     },
  //     {
  //       category: 'Specified',
  //       value: 1809,
  //     },
  //     {
  //       category: 'Others',
  //       value: 1322,
  //     },
  //   ],
  //   isScrollbar: false,
  //   colors: ['#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691', '#6C85CE'],
  //   tooltipTemplate: `<div>
  //           <h6 style="text-align: left; font-weight: bold">Not Specified</h6>
  //           <div>Contributed: <label>57  minute(s)</label></div>
  //           <div style="text-align: left;">Speakers: <label>8</label></div>
  //       </div>`,
  //   xAxisLabel: 'Month',
  //   yAxisLabel: 'Contribution (in hours)',
  // };

  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const { data: languageWithData } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.languagesWithData
  );

  const isLanguageAvailable = (languageData: any) => {
    return languageData &&
      languageData.find(
        (data: any) => data.type === props.initiativeMedia && data.language == contributionLanguage
      )
      ? true
      : false;
  };

  const { data: cardState } = useFetch<Array<{ count: string; type: string }>>(
    isLanguageAvailable(languageWithData) ? apiPaths.enableDisableCards : null
  );

  let isContributionEnabled: any;
  let isValidationEnabled: any;

  if (cardState) {
    const filteredData: any =
      cardState.find(
        (data: any) => data.type === props.initiativeMedia && data.language === contributionLanguage
      ) || {};
    isContributionEnabled = filteredData.hastarget || false;
    isValidationEnabled = filteredData.isallcontributed || false;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContributionLanguage(e.target.value);
  };

  return (
    <div className={styles.root} data-testid="ContributionActions">
      <Row>
        <Col xs="12">
          <div className="contributionLanguage">
            <Form.Group
              controlId="formGroupContributionLanguage"
              className="d-flex flex-column flex-md-row align-items-md-center"
            >
              <Form.Label className={`${styles.label} mb-0`}>
                {t('Select the language for contribution')}:
              </Form.Label>
              <Form.Select
                aria-label="Select the language for contribution"
                className={`${styles.selectContributionLanguage} mt-3 mt-md-0 ms-md-2`}
                name="category"
                onChange={handleChange as any}
              >
                {locales?.map(locale => (
                  <option key={locale} value={RAW_LANGUAGES[locale]}>
                    {DISPLAY_LANGUAGES[locale]}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
        <Col md="6" className="mt-7 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.transcribe}
            icon={`${initiative}_contribute_icon.svg`}
            text="Type what you hear"
            shadow="Green"
            disabled={isContributionEnabled}
          />
        </Col>
        <Col md="6" className="mt-9 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.validate}
            icon="validate.svg"
            text="Validate what others have contributed"
            shadow="Blue"
            disabled={!isValidationEnabled}
          />
        </Col>
        <Col xs="12">
          {/* <BarChart
            id="bar_chart"
            colors={barChartColor}
            isScrollbar={true}
            data={data}
            yAxisLabel="Translations (in sentences)"
          /> */}
        </Col>
      </Row>
    </div>
  );
};

export default ContributionActions;

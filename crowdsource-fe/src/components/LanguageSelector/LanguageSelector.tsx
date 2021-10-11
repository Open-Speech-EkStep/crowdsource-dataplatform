import type { ChangeEvent } from 'react';
import { Fragment } from 'react';

import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';

const LanguageSelector = ({
  selectedLanguage,
  updateSelectedLanguage,
}: {
  selectedLanguage: string;
  updateSelectedLanguage: (language: string) => void;
}) => {
  const { locales } = useRouter();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateSelectedLanguage(e.target.value);
  };

  return (
    <Fragment>
      <Row>
        <Col>
          <div>
            <Form.Group controlId="language">
              <Form.Label className={``}>Select a Language:</Form.Label>
              <Form.Select
                value={selectedLanguage}
                aria-label="Select Language"
                className={``}
                onChange={handleChange as any}
              >
                <option key="all" value="All Languages">
                  All Languages
                </option>
                {locales?.map(locale => (
                  <option key={locale} value={RAW_LANGUAGES[locale]}>
                    {DISPLAY_LANGUAGES[locale]}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default LanguageSelector;

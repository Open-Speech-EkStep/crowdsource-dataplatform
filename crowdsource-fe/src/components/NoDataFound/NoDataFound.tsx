import { useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import Button from 'components/Button';
import Link from 'components/Link';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import type { Initiative } from 'types/Initiatives';

interface NoDataFoundProps {
  url: string;
  initiative: Initiative;
  language: string;
}

const NoDataFound = ({ url, initiative, language }: NoDataFoundProps) => {
  const { t } = useTranslation();

  const initiativeName = `${t(INITIATIVES_MAPPING[initiative])} ${t('india')}`;
  return (
    <Container fluid="lg" className="mt-5 text-center">
      <div className="d-flex flex-column align-items-center">
        <h1>{t('thankyouForEnthusiasm')}</h1>
        <p className="mt-9">{t('noDataMessage', { language })}</p>
        <Link href={url} passHref>
          <Button className="mt-9" as="a" variant="primary">
            {t('backToInitiativePrompt', { initiativeName })}
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default NoDataFound;
